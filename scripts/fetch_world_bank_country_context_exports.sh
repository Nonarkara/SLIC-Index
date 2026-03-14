#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/output/spreadsheet"

mkdir -p "$OUTPUT_DIR"

curl -L -s -o "$OUTPUT_DIR/wb_NY.GDP.PCAP.PP.CD.json" 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.PP.CD?format=json&per_page=20000&mrv=30'
curl -L -s -o "$OUTPUT_DIR/wb_NY.GDP.MKTP.KD.ZG.json" 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=20000&mrv=30'
curl -L -s -o "$OUTPUT_DIR/wb_SI.POV.GINI.json" 'https://api.worldbank.org/v2/country/all/indicator/SI.POV.GINI?format=json&per_page=20000&mrv=30'
curl -L -s -o "$OUTPUT_DIR/wb_PA.NUS.PRVT.PP.json" 'https://api.worldbank.org/v2/country/all/indicator/PA.NUS.PRVT.PP?format=json&per_page=20000&mrv=30'
curl -L -s -o "$OUTPUT_DIR/wb_GC.TAX.TOTL.GD.ZS.json" 'https://api.worldbank.org/v2/country/all/indicator/GC.TAX.TOTL.GD.ZS?format=json&per_page=20000&mrv=30'
curl -L -s -o "$OUTPUT_DIR/wb_FD.AST.PRVT.GD.ZS.json" 'https://api.worldbank.org/v2/country/all/indicator/FD.AST.PRVT.GD.ZS?format=json&per_page=20000&mrv=30'

printf 'Wrote World Bank exports to %s\n' "$OUTPUT_DIR"
