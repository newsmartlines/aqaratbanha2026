#!/bin/bash
set -e

echo "==> Building frontend..."
pnpm --filter @workspace/banha-realestate run build

echo "==> Building backend..."
pnpm --filter @workspace/api-server run build

echo "==> Starting server on port ${PORT:-3001}..."
echo "TIP: Use 'pnpm run dev' for development with hot-reloading."
PORT=${PORT:-3001} pnpm --filter @workspace/api-server run start
