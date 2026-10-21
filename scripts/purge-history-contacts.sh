#!/usr/bin/env bash
#
# purge-history-contacts.sh — remove personal contact details from git history.
#
# WHAT THIS IS FOR
#
#   The published knowledge rack used to serve the contact lines of named
#   individuals. Those lines are redacted in the tree and in production now,
#   but a redaction in the tree does not touch the commits that came before
#   it. This script rewrites those commits so the addresses are no longer
#   reachable through any branch on the remote.
#
#   This is a destructive, externally visible operation. It rewrites commit
#   SHAs and force-pushes every branch. It refuses to run without explicit
#   sign-off, and it verifies the result before it pushes anything.
#
# HOW IT WORKS
#
#   1. Backs every ref up into a bundle, so the rewrite can be undone locally.
#   2. Finds every blob in every branch that contains a personal-domain
#      address, and derives the address list from those blobs. No address is
#      ever written into this file or into the repository.
#   3. Swaps each dirty blob for its clean twin - the same path as it exists
#      at HEAD, which is already redacted.
#   4. Passes the addresses through --replace-text as well, in case an
#      address appears somewhere the blob swap did not cover.
#   5. Verifies that no personal address survives, and only then pushes.
#
#   Step 3 is not optional. --replace-text is a byte-level substitution that
#   works on text blobs and silently does nothing on binary ones: the two
#   source PDFs carry a plaintext address inside compressed streams, and
#   without the blob swap they survive the rewrite untouched.
#
# USAGE
#
#   scripts/purge-history-contacts.sh            # dry run: report, change nothing
#   scripts/purge-history-contacts.sh --execute  # print the plan, then stop
#   scripts/purge-history-contacts.sh --execute --yes   # do it
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PERSONAL_DOMAINS='gmail|hotmail|yahoo|yandex|outlook|icloud|proton(mail)?|aol|me|live'
ADDRESS_RE="[A-Za-z0-9._%+-]+@(${PERSONAL_DOMAINS})\.[A-Za-z]{2,}"

EXECUTE=0
CONFIRM=0
for arg in "$@"; do
  case "$arg" in
    --execute) EXECUTE=1 ;;
    --yes) CONFIRM=1 ;;
  esac
done

say() { printf '%s\n' "$*"; }
rule() { say "------------------------------------------------------------"; }

if ! command -v git-filter-repo >/dev/null 2>&1 && ! git filter-repo --help >/dev/null 2>&1; then
  say "git-filter-repo is not installed. Install it, then run this again."
  exit 1
fi

# ── 0. preconditions ────────────────────────────────────────────────────────
if [ -n "$(git status --porcelain)" ]; then
  say "The working tree is dirty. Commit or stash first."
  exit 1
fi
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  say "HEAD is not origin/main. Push what you have first."
  exit 1
fi

if [ "$EXECUTE" -eq 1 ] && [ "$CONFIRM" -ne 1 ]; then
  say ""
  say "This rewrites every branch and force-pushes to GitHub."
  say "Original commit SHAs stop working: links to old commits break, and"
  say "open pull requests will need to be rebased or reopened."
  say ""
  say "Re-run without --execute to see the plan, or with --execute --yes to do it."
  exit 1
fi

WORK="$(mktemp -d /tmp/purge-contacts.XXXXXX)"
BACKUP="$HOME/slic-index-pre-purge-$(date +%Y%m%d-%H%M%S).bundle"
# Overwrite the derived address list before the work directory goes away. A
# plain delete can be diverted to a trash folder, and the trash folder would
# then hold the addresses the script exists to remove.
cleanup() {
  if [ -f "$WORK/addresses.txt" ]; then
    : > "$WORK/addresses.txt"
    : > "$WORK/raw-addresses.txt"
  fi
  rm -rf "$WORK"
}
trap cleanup EXIT

# ── 1. find the dirty blobs ─────────────────────────────────────────────────
# node_modules/ is excluded on purpose. It used to be committed, and npm
# package metadata carries author fields like "someone@gmail.com". Those are
# public registry data, not a leak, and rewriting them would corrupt the
# vendored packages for no benefit. They are counted and reported separately.
say "Scanning every blob in every branch for personal addresses..."
: > "$WORK/dirty.txt"
: > "$WORK/vendor.txt"
git rev-list --objects --all > "$WORK/objects.txt"
while read -r sha path; do
  [ -z "${path:-}" ] && continue
  if git cat-file blob "$sha" 2>/dev/null | grep -qaE "$ADDRESS_RE"; then
    case "$path" in
      node_modules/*) printf '%s %s\n' "$sha" "$path" >> "$WORK/vendor.txt" ;;
      *) printf '%s %s\n' "$sha" "$path" >> "$WORK/dirty.txt" ;;
    esac
  fi
done < "$WORK/objects.txt"
sort -u -o "$WORK/dirty.txt" "$WORK/dirty.txt"
sort -u -o "$WORK/vendor.txt" "$WORK/vendor.txt"

DIRTY_COUNT=$(wc -l < "$WORK/dirty.txt" | tr -d ' ')
VENDOR_COUNT=$(wc -l < "$WORK/vendor.txt" | tr -d ' ')
if [ "$DIRTY_COUNT" -eq 0 ]; then
  say "No personal addresses found in any blob outside node_modules. Nothing to do."
  exit 0
fi

rule
say "$DIRTY_COUNT dirty blob(s):"
while read -r sha path; do
  n=$(git cat-file blob "$sha" | grep -aoE "$ADDRESS_RE" | sort -u | wc -l | tr -d ' ')
  say "  ${sha:0:12}  ${n} address(es)  $path"
done < "$WORK/dirty.txt"

if [ "$VENDOR_COUNT" -gt 0 ]; then
  say ""
  say "Skipped $VENDOR_COUNT blob(s) under node_modules/ - npm author fields,"
  say "public registry data, not a leak."
fi

# ── 2. derive the address list ──────────────────────────────────────────────
while read -r sha path; do
  git cat-file blob "$sha" | grep -aoE "$ADDRESS_RE"
done < "$WORK/dirty.txt" | sort -u > "$WORK/raw-addresses.txt"

DISTINCT=$(wc -l < "$WORK/raw-addresses.txt" | tr -d ' ')
: > "$WORK/addresses.txt"
while IFS= read -r addr; do
  printf 'literal:%s==>***REDACTED***\n' "$addr" >> "$WORK/addresses.txt"
done < "$WORK/raw-addresses.txt"

rule
say "$DISTINCT distinct personal address(es) across $DIRTY_COUNT blob(s)."
say "The list is derived at run time. It is never stored in the repository."

# ── 3. collect the clean twins ──────────────────────────────────────────────
: > "$WORK/swap.py"
printf 'MAP = {\n' >> "$WORK/swap.py"
SWAP_N=0
while read -r sha path; do
  clean=$(git rev-parse --verify --quiet "HEAD:$path" 2>/dev/null || true)
  if [ -z "$clean" ]; then
    say "  ! no clean twin at HEAD for $path - --replace-text only"
    continue
  fi
  git cat-file blob "$clean" > "$WORK/clean-$sha.bin"
  printf '    "%s": r"%s",\n' "$sha" "$WORK/clean-$sha.bin" >> "$WORK/swap.py"
  SWAP_N=$((SWAP_N + 1))
done < "$WORK/dirty.txt"
printf '}\n' >> "$WORK/swap.py"
cat >> "$WORK/swap.py" <<'PY'
for _old, _new in MAP.items():
    if blob.original_id.decode() == _old:
        blob.data = open(_new, "rb").read()
PY

rule
say "$SWAP_N blob(s) have a clean twin at HEAD and will be swapped."

# ── 4. the plan ─────────────────────────────────────────────────────────────
say ""
say "PLAN"
say "  1. fetch, and make a local branch for every remote branch"
say "  2. git filter-repo --force --blob-callback ... --replace-text ..."
say "  3. verify: 0 personal addresses remain outside node_modules"
say "  4. git push --force origin 'refs/heads/*:refs/heads/*'"
say ""
say "Branches that would be rewritten:"
git for-each-ref --format='    %(refname:short)' refs/remotes/origin | grep -v HEAD
say ""
say "Backup bundle would be written to:"
say "    $BACKUP"

if [ "$EXECUTE" -ne 1 ]; then
  say ""
  say "Dry run only. Nothing was changed."
  say "Add --execute to perform the rewrite."
  exit 0
fi

if [ "$CONFIRM" -ne 1 ]; then
  say ""
  say "This rewrites every branch and force-pushes to GitHub."
  say "Original commit SHAs stop working: links to old commits break, and"
  say "open pull requests will need to be rebased or reopened."
  say ""
  say "Re-run with --execute --yes to do it."
  exit 1
fi

# ── 5. execute ──────────────────────────────────────────────────────────────
rule
say "Making a local branch for every remote branch..."
git fetch origin --prune --quiet
git for-each-ref --format='%(refname:short)' refs/remotes/origin | grep -v HEAD | while read -r br; do
  name="${br#origin/}"
  git branch --force "$name" "refs/remotes/$br"
done

say "Backing up every ref to $BACKUP ..."
git bundle create "$BACKUP" --all
say "  done. Keep this bundle until you have verified the result."

say "Running git filter-repo ..."
git filter-repo --force \
  --blob-callback "$(cat "$WORK/swap.py")" \
  --replace-text "$WORK/addresses.txt"

say "Verifying before pushing ..."
: > "$WORK/after.txt"
git rev-list --objects --all > "$WORK/objects-after.txt"
while read -r sha path; do
  [ -z "${path:-}" ] && continue
  case "$path" in node_modules/*) continue ;; esac
  if git cat-file blob "$sha" 2>/dev/null | grep -qaE "$ADDRESS_RE"; then
    printf '%s %s\n' "$sha" "$path" >> "$WORK/after.txt"
  fi
done < "$WORK/objects-after.txt"
REMAINING=$(wc -l < "$WORK/after.txt" | tr -d ' ')
if [ "$REMAINING" -ne 0 ]; then
  say "  $REMAINING blob(s) still contain a personal address. Aborting before push."
  cat "$WORK/after.txt"
  exit 1
fi
say "  0 personal addresses remain outside node_modules."

say "Force-pushing every branch ..."
git push --force origin 'refs/heads/*:refs/heads/*'

rule
say "Done. Three things are still worth doing:"
say "  1. Ask GitHub Support to purge cached views of the old commits."
say "  2. Tell the named individuals their addresses were published for"
say "     about seven months, so they can decide whether to rotate them."
say "  3. Run: git gc --aggressive --prune=now, and keep the bundle until"
say "     you are satisfied."
