#!/usr/bin/env bash
# =============================================================================
# Banha Real Estate — Production Build Script
# =============================================================================
# Usage:
#   chmod +x scripts/build-prod.sh
#   ./scripts/build-prod.sh
#
# What this does:
#   1. Installs all dependencies
#   2. Builds the React frontend (→ artifacts/banha-realestate/dist/public/)
#   3. Builds the Express API server (→ artifacts/api-server/dist/)
#   4. Prints next steps
# =============================================================================

set -e

BOLD="\033[1m"
GREEN="\033[32m"
BLUE="\033[34m"
YELLOW="\033[33m"
RESET="\033[0m"

echo ""
echo -e "${BOLD}${BLUE}══════════════════════════════════════════${RESET}"
echo -e "${BOLD}${BLUE}   Banha Real Estate — Production Build   ${RESET}"
echo -e "${BOLD}${BLUE}══════════════════════════════════════════${RESET}"
echo ""

# Check pnpm
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm is not installed. Run: npm install -g pnpm"
  exit 1
fi

# Check .env exists
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}⚠️  No .env file found. Copying .env.example...${RESET}"
  cp .env.example .env
  echo -e "${YELLOW}   Edit .env and set DATABASE_URL before starting the server.${RESET}"
  echo ""
fi

echo -e "${BOLD}[1/3]${RESET} Installing dependencies..."
pnpm install --frozen-lockfile
echo -e "${GREEN}✔ Dependencies installed${RESET}"
echo ""

echo -e "${BOLD}[2/3]${RESET} Building frontend..."
pnpm --filter @workspace/banha-realestate run build
echo -e "${GREEN}✔ Frontend built → artifacts/banha-realestate/dist/public/${RESET}"
echo ""

echo -e "${BOLD}[3/3]${RESET} Building API server..."
pnpm --filter @workspace/api-server run build
echo -e "${GREEN}✔ API server built → artifacts/api-server/dist/${RESET}"
echo ""

echo -e "${BOLD}${GREEN}══════════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}   ✅ Build Complete!                       ${RESET}"
echo -e "${BOLD}${GREEN}══════════════════════════════════════════${RESET}"
echo ""
echo "Next steps:"
echo ""
echo "  1. Make sure .env has a valid DATABASE_URL"
echo "  2. Push database schema:"
echo "       pnpm db:push"
echo ""
echo "  3. Start the production server:"
echo "       NODE_ENV=production PORT=3001 node artifacts/api-server/dist/index.mjs"
echo ""
echo "  OR for cPanel static hosting:"
echo "     Upload contents of artifacts/banha-realestate/dist/public/ to public_html/"
echo ""
