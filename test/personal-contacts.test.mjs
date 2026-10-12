import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const script = new URL('../scripts/check-personal-contacts.py', import.meta.url);
const repoRoot = new URL('..', import.meta.url);

function run(root) {
  return spawnSync('python3', [script.pathname, root], { encoding: 'utf8' });
}

test('working tree has no personal emails or phone numbers', () => {
  const result = run(repoRoot.pathname);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test('a consumer email fails the check', () => {
  const root = mkdtempSync(join(tmpdir(), 'slic-contact-'));
  writeFileSync(join(root, 'note.txt'), `Email: ${'person@' + 'gmail.com'}\n`);
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /personal-email/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a named individual mailbox fails the check', () => {
  const root = mkdtempSync(join(tmpdir(), 'slic-contact-'));
  writeFileSync(join(root, 'note.txt'), `Email: ${'ada.lovelace@' + 'agency.gov'}\n`);
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /personal-email/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a personal phone number fails the check', () => {
  const root = mkdtempSync(join(tmpdir(), 'slic-contact-'));
  writeFileSync(join(root, 'note.txt'), `Mobile: ${'+6681' + '2345678'}\n`);
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /personal-phone/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('published organisation email and switchboard stay allowed', () => {
  const root = mkdtempSync(join(tmpdir(), 'slic-contact-'));
  writeFileSync(
    join(root, 'note.txt'),
    [
      'Email: info@smartcitythailand.or.th',
      'Tel: +66 2026 2333 ext. 5101 to 5111',
      'you@example.com',
    ].join('\n'),
  );
  try {
    const result = run(root);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
