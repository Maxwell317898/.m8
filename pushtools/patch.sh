#!/bin/sh

# safty checks - ensure git working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working tree not clean. Commit or stash changes first."
  exit 1
fi

set -e

echo "Bumping PATCH version (x.x.x → x.x.(x+1))"

npm version patch
git push
git push --tags

echo "Publishing new version to npm registry"

npm publish

echo "Patch release pushed"
