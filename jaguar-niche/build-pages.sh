#!/usr/bin/env bash
# Builds a static copy of the site into ../jaguar-niche-site for GitHub Pages
# (served at https://tecolas.github.io/PROTO./jaguar-niche-site/).
set -euo pipefail
cd "$(dirname "$0")"
PAGES_BASE_PATH="/PROTO./jaguar-niche-site" npx next build
rm -rf ../jaguar-niche-site
cp -r out ../jaguar-niche-site
# GitHub Pages runs Jekyll by default, which hides folders starting with "_" (like _next)
touch ../.nojekyll
echo "Static site written to ../jaguar-niche-site"
