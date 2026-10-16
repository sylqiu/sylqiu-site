#!/usr/bin/env bash
# Build the site and publish the generated dist/ to the Pages repo.
#
#   npm run deploy            # uses a default commit message
#   npm run deploy -- "msg"   # message for the Pages commit
#
# The site is a Vite SPA in this repo; what the web serves is the *built* copy
# in sylqiu/sylqiu.github.io (branch master, GitHub Pages). This script does the
# whole hop: build, rsync into a clone of that repo, push, then wait until the
# deployed bundle hash actually matches the local build.
set -euo pipefail

SITE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAGES_REPO="https://github.com/sylqiu/sylqiu.github.io.git"
WORK="${TMPDIR:-/tmp}/sylqiu-ghpages"
SITE_URL="https://sylqiu.github.io"
MSG="${1:-KV cache illustration update}"

cd "$SITE"
echo "==> building"
npm run build

BUNDLE="$(grep -o "assets/index-[a-zA-Z0-9_-]*\.js" dist/index.html | head -1 || true)"
if [ -z "$BUNDLE" ]; then
  echo "!! dist/index.html has no bundle reference — the build did not produce a site" >&2
  exit 1
fi
echo "==> local bundle: $BUNDLE"

echo "==> staging dist/ into the Pages repo"
rm -rf "$WORK"
git clone -q "$PAGES_REPO" "$WORK"
cd "$WORK"
git fetch -q origin
git reset -q --hard origin/master
rsync -a --delete --exclude .git --exclude .DS_Store "$SITE/dist/" "$WORK/"

if [ -z "$(git status --porcelain)" ]; then
  echo "==> nothing to publish — Pages already holds this build"
else
  git add -A
  git commit -q -m "$MSG"
  echo "==> pushing to sylqiu/sylqiu.github.io"
  git push -q origin master
fi

echo "==> waiting for Pages to serve $BUNDLE (usually 1-3 min)"
SERVED=""
for _ in $(seq 1 60); do
  SERVED="$(curl -s "$SITE_URL/?cb=$RANDOM" | grep -o "assets/index-[a-zA-Z0-9_-]*\.js" | head -1 || true)"
  if [ "$SERVED" = "$BUNDLE" ]; then
    curl -sL "$SITE_URL/$BUNDLE" -o "$WORK/.live-bundle.js"
    echo "==> live and verified: $SITE_URL"
    shasum -a 256 "$WORK/.live-bundle.js" "$SITE/dist/$BUNDLE"
    exit 0
  fi
  sleep 5
done

echo "!! Pages still serves ${SERVED:-nothing}; the push is in, it just has not rebuilt yet" >&2
echo "!! re-run npm run deploy to re-check (it will not push twice)" >&2
exit 2
