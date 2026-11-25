#!/usr/bin/env bash
# Builds a static copy of the site into ../norte-site for GitHub Pages
# (served at https://tecolas.github.io/PROTO./norte-site/).
set -euo pipefail
cd "$(dirname "$0")"
PAGES_BASE_PATH="/PROTO./norte-site" npx next build
rm -rf ../norte-site
cp -r out ../norte-site
# GitHub Pages runs Jekyll by default, which hides folders starting with "_" (like _next)
touch ../.nojekyll
echo "Static site written to ../norte-site"
