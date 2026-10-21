#!/usr/bin/env bash
# Build, commit the source, push to GitHub, then publish dist/ to Pages.
#
# Usage:
#   ./scripts/release.sh "your commit message"
#   ./scripts/release.sh                 # uses a timestamped default
#
# This is the manual one-shot path. It is intentionally self-contained: it
# checks for source changes, commits with jj when the repo is colocated (or
# with git otherwise), pushes main, then calls the existing Pages publisher.
set -euo pipefail

SITE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MSG="${1:-Site update $(date '+%Y-%m-%d %H:%M')}"
cd "$SITE"

echo "==> building"
npm run build

echo "==> committing source"
if [ -d .jj ] && command -v jj >/dev/null 2>&1; then
  if jj st 2>&1 | grep -q 'Working copy changes'; then
    jj describe -m "$MSG"
    jj bookmark set main -r @
    jj git push --bookmark main
  else
    echo "    no source changes"
  fi
elif [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "$MSG"
  git push origin HEAD:main
else
  echo "    no source changes"
fi

echo "==> publishing dist/ to sylqiu.github.io"
npm run deploy -- "$MSG"

echo "==> done"
echo "    live: https://sylqiu.github.io/"
