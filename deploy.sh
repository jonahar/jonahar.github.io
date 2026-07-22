#!/usr/bin/env bash
set -euo pipefail

# deploy.sh - Build React app and deploy to gh-pages branch
# Similar to GitHub Pages serving from a branch
# Usage: ./deploy.sh [--push] [--no-build]
#
# - Builds the app (npm run build) -> dist/
# - Creates/updates gh-pages branch with contents of dist/
# - Generates a commit on gh-pages branch
# - Optionally pushes to origin if --push flag or interactive prompt

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

# Fix npm registry if env is broken (common in Meta dev env where registry is set to http://127.0.0.1:1)
# We override to official registry for install/build steps
if [[ "${npm_config_registry:-}" == "http://127.0.0.1:1" ]]; then
  echo "Detected broken npm_config_registry=${npm_config_registry}, overriding to https://registry.npmjs.org"
  export npm_config_registry="https://registry.npmjs.org"
fi

configure_npm() {
  # Ensure npm uses a valid registry if current is loopback
  local current_registry
  current_registry="$(npm config get registry 2>/dev/null || echo "unknown")"
  if [[ "$current_registry" == "http://127.0.0.1:1"* ]]; then
    echo "Fixing npm registry from $current_registry to https://registry.npmjs.org"
    export npm_config_registry="https://registry.npmjs.org"
  fi
}
configure_npm

echo "=== Building site ==="
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found in $ROOT_DIR"
  exit 1
fi

if [ "$NO_BUILD" = false ]; then
  if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
  fi
  echo "Running build..."
  npm run build
else
  echo "Skipping build (--no-build flag)"
fi

if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: Build directory $BUILD_DIR not found"
  exit 1
fi

if [ -z "$(ls -A "$BUILD_DIR")" ]; then
  echo "Error: Build directory $BUILD_DIR is empty"
  exit 1
fi

# Ensure CNAME exists in build output for custom domain (jonaharris.com)
if [ -f "public/CNAME" ] && [ ! -f "$BUILD_DIR/CNAME" ]; then
  echo "Copying public/CNAME to $BUILD_DIR/CNAME"
  cp public/CNAME "$BUILD_DIR/"
elif [ -f "CNAME" ] && [ ! -f "$BUILD_DIR/CNAME" ]; then
  echo "Copying CNAME to $BUILD_DIR/CNAME"
  cp CNAME "$BUILD_DIR/"
fi

# Ensure .nojekyll to bypass Jekyll processing on gh-pages
touch "$BUILD_DIR/.nojekyll"

echo "Build output:"
ls -lh "$BUILD_DIR"
echo ""

# Function to deploy when gh-pages branch already exists
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
    echo "Found local gh-pages branch"
    git worktree add "$GH_PAGES_DIR" gh-pages
  elif git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    echo "Found remote origin/gh-pages, creating local tracking branch"
    git worktree add -b gh-pages "$GH_PAGES_DIR" origin/gh-pages
  else
    echo "ERROR: deploy_via_worktree called but gh-pages branch does not exist"
    exit 1
  fi

  echo ""
  echo "=== Copying built files to gh-pages ==="
  find "$GH_PAGES_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} + 2>/dev/null || true
  cp -r "$BUILD_DIR"/* "$GH_PAGES_DIR"/
  if [ -f "$BUILD_DIR/.nojekyll" ]; then
    cp "$BUILD_DIR/.nojekyll" "$GH_PAGES_DIR/"
  fi
  if [ -f "$BUILD_DIR/CNAME" ]; then
    cp "$BUILD_DIR/CNAME" "$GH_PAGES_DIR/"
  fi

  ls -la "$GH_PAGES_DIR" | head -n 30

  echo ""
  echo "=== Committing to gh-pages ==="
  (
    cd "$GH_PAGES_DIR"
    git add -A
    if git diff --cached --quiet; then
      echo "No changes to commit on gh-pages branch (build output identical)"
      exit 0
    fi

    git commit -m "Deploy to gh-pages from ${CURRENT_BRANCH} ${COMMIT_HASH}

Source commit: $(git -C "$ROOT_DIR" rev-parse HEAD)
${COMMIT_MSG}

Built with: npm run build
"

    echo "New commit: $(git log --oneline -1)"

    if [ "$PUSH" = true ]; then
      echo "Pushing gh-pages to origin..."
      git push origin gh-pages
    elif git remote | grep -q "^origin$"; then
      echo ""
      # Only prompt if stdin is a TTY
      if [ -t 0 ]; then
        read -p "Push gh-pages to origin? (y/N) " -n 1 -r || true
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
          git push origin gh-pages
        else
          echo "Skipping push. Run: git push origin gh-pages"
        fi
      else
        echo "Non-interactive shell, skipping push. Run: git push origin gh-pages"
      fi
    fi
  )

  trap - EXIT
  cleanup
}

# Function to deploy when gh-pages does NOT exist -> create orphan branch
deploy_new_orphan() {
  echo "=== No gh-pages branch found, creating new orphan branch ==="
  # Save current state
  local prev_branch
  prev_branch="$(git rev-parse --abbrev-ref HEAD)"

  # Ensure working directory is clean-ish? We will stash changes to dist? dist is ignored, so fine
  # Create orphan branch
  git checkout --orphan gh-pages

  # Remove all files from index and working tree (except dist and .git)
  git reset --hard 2>/dev/null || true
  # Clean untracked files except dist and node_modules
  # First, remove everything except BUILD_DIR and .git
  find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name "$BUILD_DIR" ! -name '.gitignore' -exec rm -rf {} + 2>/dev/null || true

  # Copy build output to root
  cp -r "$BUILD_DIR"/* ./
  if [ -f "$BUILD_DIR/.nojekyll" ]; then
    cp "$BUILD_DIR/.nojekyll" ./
  fi
  if [ -f "$BUILD_DIR/CNAME" ]; then
    cp "$BUILD_DIR/CNAME" ./
  fi

  # Also ensure CNAME and .nojekyll are included (they are hidden? CNAME visible, .nojekyll hidden)
  touch .nojekyll
  if [ -f "$ROOT_DIR/CNAME" ] && [ ! -f "./CNAME" ]; then
    cp "$ROOT_DIR/CNAME" ./
  fi
  if [ -f "$ROOT_DIR/public/CNAME" ] && [ ! -f "./CNAME" ]; then
    cp "$ROOT_DIR/public/CNAME" ./
  fi

  git add -A

  git commit -m "Initial deploy to gh-pages from ${prev_branch} ${COMMIT_HASH}

Source commit: ${COMMIT_HASH}
${COMMIT_MSG}

Built with: npm run build
"

  echo "Created gh-pages branch with commit: $(git log --oneline -1)"

  # Checkout back to previous branch
  git checkout "$prev_branch"

  if [ "$PUSH" = true ] && git remote | grep -q "^origin$"; then
    echo "Pushing gh-pages to origin..."
    git push origin gh-pages
  else
    echo "gh-pages branch created locally. Push with: git push origin gh-pages"
  fi
}

# Main deploy logic
if git show-ref --verify --quiet refs/heads/gh-pages || git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
  deploy_via_worktree
else
  deploy_new_orphan
fi

echo ""
echo "=== Deploy complete ==="
echo "gh-pages branch now contains the built site"
echo "If configured to serve from gh-pages branch on GitHub, your site will be live"
echo "Custom domain CNAME: $(cat "$BUILD_DIR/CNAME" 2>/dev/null || echo "not found")"
echo "Done."
