#!/bin/sh

# safty checks - ensure git working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working tree not clean. Commit or stash changes first."
  exit 1
fi

set -e

echo "Bumping MINOR version (x.x.x → x.(x+1).0)"

npm version minor
git push
git push --tags

echo "Minor version pushed"
