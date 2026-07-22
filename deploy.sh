#!/usr/bin/env bash
set -euo pipefail

# build the app and deploy to gh-pages branch via a temporary worktree
# - does not switch branches or alter the working tree
# - wipes worktree content except .git, copies dist/, adds .nojekyll and CNAME, commits

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$ROOT/dist"
WORKTREE_DIR="$(mktemp -d)"

echo "Deploy script root: $ROOT"
echo "Worktree dir: $WORKTREE_DIR"

cleanup() {
  set +e
  echo "Cleaning up worktree..."
  if git -C "$ROOT" worktree list | grep -q "$WORKTREE_DIR"; then
    git -C "$ROOT" worktree remove --force "$WORKTREE_DIR" 2>/dev/null || true
  fi
  rm -rf "$WORKTREE_DIR"
}
trap cleanup EXIT

# Always rebuild to ensure gh-pages reflects the latest source
if [ ! -d "$DIST_DIR" ]; then
  echo "dist/ not found, building..."
  pushd "$ROOT" > /dev/null
  if [ ! -d "node_modules" ]; then
    npm install
  fi
  npm run build
  popd > /dev/null
else
  echo "dist/ exists, rebuilding to ensure fresh..."
  pushd "$ROOT" > /dev/null
  npm run build
  popd > /dev/null
fi

if [ ! -d "$DIST_DIR" ] || [ -z "$(ls -A "$DIST_DIR" 2>/dev/null)" ]; then
  echo "Error: dist/ is missing or empty after build"
  exit 1
fi

# Determine if gh-pages branch exists
cd "$ROOT"
BRANCH_EXISTS=false
if git show-ref --verify --quiet refs/heads/gh-pages; then
  BRANCH_EXISTS=true
elif git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
  BRANCH_EXISTS=true
fi

if [ "$BRANCH_EXISTS" = true ]; then
  # If local branch exists, use it; otherwise create tracking from origin
  if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "Adding worktree for existing local gh-pages branch"
    git worktree add "$WORKTREE_DIR" gh-pages
  else
    echo "Adding worktree for remote origin/gh-pages as new local gh-pages branch"
    git worktree add -B gh-pages "$WORKTREE_DIR" origin/gh-pages
  fi
else
  echo "gh-pages branch does not exist, creating new orphan-like branch via worktree"
  # -B creates branch if not exists, starting from HEAD; we will wipe content anyway
  git worktree add -B gh-pages "$WORKTREE_DIR"
fi

# Now work inside worktree dir
cd "$WORKTREE_DIR"

# Wipe everything except .git file/dir pointer
echo "Wiping existing content in worktree (except .git)..."
# Remove all files and dirs at top level except .git
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

# Copy dist content
echo "Copying contents of $DIST_DIR to worktree..."
cp -a "$DIST_DIR"/. .

# Ensure .nojekyll exists (prevents GitHub Pages from running Jekyll)
touch .nojekyll

# Ensure CNAME exists for custom domain
# Priority: public/CNAME, then root CNAME, then keep existing from dist if already copied
if [ -f "$ROOT/public/CNAME" ]; then
  cp -f "$ROOT/public/CNAME" ./CNAME
  echo "CNAME copied from public/CNAME"
elif [ -f "$ROOT/CNAME" ]; then
  cp -f "$ROOT/CNAME" ./CNAME
  echo "CNAME copied from root CNAME"
fi

if [ -f "./CNAME" ]; then
  echo "CNAME present: $(cat ./CNAME)"
else
  echo "Warning: CNAME not found, site will be served without custom domain"
fi

# Stage and commit if there are changes
git add -A

if git diff --cached --quiet; then
  echo "No changes to commit. gh-pages is already up to date."
  exit 0
fi

COMMIT_MSG="Deploy to gh-pages: $(date -u +"%Y-%m-%d %H:%M:%S UTC") - $(git -C "$ROOT" rev-parse --short HEAD || echo unknown)"

echo "Committing..."
git commit -m "$COMMIT_MSG"

echo ""
echo "Successfully created commit on gh-pages branch:"
git log -1 --oneline

echo ""
echo "Worktree at $WORKTREE_DIR will be removed on exit (via trap)."
echo "If you want to push: git push origin gh-pages"
