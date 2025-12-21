#!/bin/sh

# safty checks - ensure git working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working tree not clean. Commit or stash changes first."
  exit 1
fi

set -e

echo "Bumping MAJOR version ((x+1).0.0)"

npm version major
git push
git push --tags

echo "Publishing new version to npm registry"

npm publish

echo "Major release pushed"
