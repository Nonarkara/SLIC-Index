#!/usr/bin/env bash
# Key every partner logo off its paper so it can sit on the cream ground.
#
# The sources live in logo-sources/logos/ and are not published; the keyed marks are
# written to public/Logos/ and are what the site serves. Every mark is
# transparent, so the footer row has no white plates and no boxes.
#
# The Axiom mark is the flat "Minimalist Navy Tile" artwork. The 3D-rendered
# version that used to sit in public/Logos/axiom_logo.png was 7.8MB, was the
# only non-flat brand asset in the set, and disagreed with everything else.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python3 scripts/key-logo.py logo-sources/logos/depa_logo.jpg \
  public/Logos/depa_logo.png --name depa
python3 scripts/key-logo.py logo-sources/logos/smart_city_thailand_logo.jpg \
  public/Logos/smart_city_thailand_logo.png --name smart-city
python3 scripts/key-logo.py logo-sources/logos/retl_logo.png \
  public/Logos/retl_logo.png --name retl
python3 scripts/key-logo.py logo-sources/logos/axiom-minimal.png \
  public/Logos/axiom_logo.png --name axiom
python3 scripts/key-logo.py logo-sources/logos/rcad-sdw.png \
  public/Logos/rcad-sdw.png --name rcad-sdw

echo "partner logos rebuilt"
