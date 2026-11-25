#!/usr/bin/env bash
# Builds a static copy of the site into ../molho for GitHub Pages
# (served at https://tecolas.github.io/PROTO./molho/).
set -euo pipefail
cd "$(dirname "$0")"
PAGES_BASE_PATH="/PROTO./molho" npx next build
rm -rf ../molho
cp -r out ../molho
# GitHub Pages runs Jekyll by default, which hides folders starting with "_" (like _next)
touch ../.nojekyll
echo "Static site written to ../molho"
