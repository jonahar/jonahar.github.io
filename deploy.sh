#!/usr/bin/env bash
set -euo pipefail

# Build the app and publish dist/ to the gh-pages branch via a temporary
# worktree — never switches branch or touches the working tree.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WT="$(mktemp -d)"
trap 'git -C "$ROOT" worktree remove --force "$WT" 2>/dev/null; rm -rf "$WT"' EXIT

cd "$ROOT"
npm run build   # regenerates dist/ (CNAME comes from public/ automatically)

# Check out gh-pages in the temp worktree (create it if it doesn't exist yet).
if git show-ref --verify --quiet refs/heads/gh-pages; then
  git worktree add "$WT" gh-pages
elif git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
  git worktree add -B gh-pages "$WT" origin/gh-pages
else
  git worktree add -B gh-pages "$WT"
fi

# Replace its contents with the fresh build.
find "$WT" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -a dist/. "$WT"/
touch "$WT/.nojekyll"

git -C "$WT" add -A
git -C "$WT" commit -m "Deploy $(git rev-parse --short HEAD)" || echo "Nothing to deploy."
echo "Done. Push with: git push origin gh-pages"
