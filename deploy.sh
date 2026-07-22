#!/usr/bin/env bash
set -euo pipefail

# deploy.sh - Build React app and deploy to gh-pages branch
# Similar to GitHub Pages serving from a branch
# Usage: ./deploy.sh [--push] [--no-build]

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

BUILD_DIR="dist"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
COMMIT_HASH="$(git rev-parse --short HEAD)"
COMMIT_MSG="$(git log -1 --pretty=%B)"

PUSH=false
NO_BUILD=false
for arg in "$@"; do
  case "$arg" in
    --push) PUSH=true ;;
    --no-build) NO_BUILD=true ;;
    -h|--help)
      echo "Usage: ./deploy.sh [--push] [--no-build]"
      echo "  --push      Auto-push gh-pages to origin without prompting"
      echo "  --no-build  Skip npm run build, use existing dist/"
      exit 0
      ;;
  esac
done

# Fix npm registry for Meta dev env
if [[ "${npm_config_registry:-}" == "http://127.0.0.1:1" ]]; then
  echo "Detected broken npm_config_registry, overriding to https://registry.npmjs.org"
  export npm_config_registry="https://registry.npmjs.org"
fi
configure_npm() {
  local cur
  cur="$(npm config get registry 2>/dev/null || echo "unknown")"
  if [[ "$cur" == "http://127.0.0.1:1"* ]]; then
    echo "Fixing npm registry from $cur to https://registry.npmjs.org"
    export npm_config_registry="https://registry.npmjs.org"
  fi
}
configure_npm

echo "=== Building site ==="
if [ ! -f "package.json" ]; then echo "Error: package.json not found"; exit 1; fi

if [ "$NO_BUILD" = false ]; then
  if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
  fi
  echo "Running build..."
  npm run build
else
  echo "Skipping build (--no-build)"
fi

if [ ! -d "$BUILD_DIR" ]; then echo "Error: $BUILD_DIR not found"; exit 1; fi
if [ -z "$(ls -A "$BUILD_DIR")" ]; then echo "Error: $BUILD_DIR empty"; exit 1; fi

if [ -f "public/CNAME" ] && [ ! -f "$BUILD_DIR/CNAME" ]; then cp public/CNAME "$BUILD_DIR/"; fi
if [ -f "CNAME" ] && [ ! -f "$BUILD_DIR/CNAME" ]; then cp CNAME "$BUILD_DIR/"; fi
touch "$BUILD_DIR/.nojekyll"

echo "Build output:"
ls -lh "$BUILD_DIR"
echo ""

deploy_via_worktree() {
  local GH_PAGES_DIR
  GH_PAGES_DIR="$(mktemp -d)"
  echo "=== Preparing gh-pages worktree at $GH_PAGES_DIR ==="
  cleanup() {
    echo "Cleaning up worktree..."
    git worktree remove --force "$GH_PAGES_DIR" 2>/dev/null || rm -rf "$GH_PAGES_DIR"
    git worktree prune 2>/dev/null || true
  }
  trap cleanup EXIT

  if git show-ref --verify --quiet refs/heads/gh-pages; then
    git worktree add "$GH_PAGES_DIR" gh-pages
  elif git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    git worktree add -b gh-pages "$GH_PAGES_DIR" origin/gh-pages
  else
    echo "ERROR: deploy_via_worktree called but gh-pages missing"
    exit 1
  fi

  echo "=== Copying built files ==="
  find "$GH_PAGES_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} + 2>/dev/null || true
  cp -r "$BUILD_DIR"/* "$GH_PAGES_DIR"/
  for dot in "$BUILD_DIR"/.*; do
    [ -e "$dot" ] || continue
    b="$(basename "$dot")"
    [[ "$b" == "." || "$b" == ".." ]] && continue
    cp "$dot" "$GH_PAGES_DIR"/ 2>/dev/null || true
  done

  ls -la "$GH_PAGES_DIR" | head -n 40

  echo "=== Committing ==="
  (
    cd "$GH_PAGES_DIR"
    git add -A
    if git diff --cached --quiet; then
      echo "No changes to commit"
      exit 0
    fi
    git commit -m "Deploy to gh-pages from ${CURRENT_BRANCH} ${COMMIT_HASH}

Source commit: $(git -C "$ROOT_DIR" rev-parse HEAD)
${COMMIT_MSG}

Built with: npm run build
"
    echo "New commit: $(git log --oneline -1)"
    if [ "$PUSH" = true ]; then
      git push origin gh-pages
    elif git remote | grep -q "^origin$"; then
      if [ -t 0 ]; then
        read -p "Push gh-pages to origin? (y/N) " -n 1 -r || true; echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then git push origin gh-pages; else echo "Skip push, run: git push origin gh-pages"; fi
      else
        echo "Non-interactive, skip push. Run: git push origin gh-pages"
      fi
    fi
  )
  trap - EXIT
  cleanup
}

deploy_new_orphan() {
  echo "=== No gh-pages branch found, creating new orphan branch via temp repo ==="
  local TMP_REPO
  TMP_REPO="$(mktemp -d)"
  echo "Temp repo: $TMP_REPO"

  cleanup_tmp() {
    rm -rf "$TMP_REPO"
  }
  trap cleanup_tmp EXIT

  # Init temp repo
  (
    cd "$TMP_REPO"
    git init -q
    git config user.name "$(git -C "$ROOT_DIR" config user.name || echo "deploy")"
    git config user.email "$(git -C "$ROOT_DIR" config user.email || echo "deploy@local")"

    # Copy build output to temp repo root
    cp -r "$ROOT_DIR/$BUILD_DIR"/* ./
    for dot in "$ROOT_DIR/$BUILD_DIR"/.*; do
      [ -e "$dot" ] || continue
      b="$(basename "$dot")"
      [[ "$b" == "." || "$b" == ".." ]] && continue
      cp "$dot" ./ 2>/dev/null || true
    done
    touch .nojekyll
    if [ ! -f CNAME ]; then
      if [ -f "$ROOT_DIR/public/CNAME" ]; then cp "$ROOT_DIR/public/CNAME" ./CNAME; fi
      if [ -f "$ROOT_DIR/CNAME" ] && [ ! -f ./CNAME ]; then cp "$ROOT_DIR/CNAME" ./CNAME; fi
    fi

    echo "Temp repo files:"
    ls -la

    git add -A
    git commit -q -m "Initial deploy to gh-pages from ${CURRENT_BRANCH} ${COMMIT_HASH}

Source commit: ${COMMIT_HASH}
${COMMIT_MSG}

Built with: npm run build
"
    echo "Created temp commit: $(git log --oneline -1)"

    # Push this orphan branch into main repo as gh-pages
    # Use git push to filesystem path
    git push -q "$ROOT_DIR" HEAD:gh-pages
    echo "Pushed gh-pages branch to $ROOT_DIR"
  )

  trap - EXIT
  cleanup_tmp

  # Now we have gh-pages branch in main repo, show it
  echo "gh-pages branch created:"
  git log gh-pages --oneline -1
  git show gh-pages --stat --oneline | head -n 20

  if [ "$PUSH" = true ] && git remote | grep -q "^origin$"; then
    echo "Pushing gh-pages to origin..."
    git push origin gh-pages
  else
    echo "gh-pages branch ready locally. Push with: git push origin gh-pages"
  fi
}

if git show-ref --verify --quiet refs/heads/gh-pages || git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
  deploy_via_worktree
else
  deploy_new_orphan
fi

echo ""
echo "=== Deploy complete ==="
echo "gh-pages contains built site"
if [ -f "$BUILD_DIR/CNAME" ]; then echo "CNAME: $(cat "$BUILD_DIR/CNAME")"; fi
echo "Done."
