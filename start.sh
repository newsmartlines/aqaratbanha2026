#!/bin/bash
set -e

echo "==> Building frontend..."
pnpm --filter @workspace/banha-realestate run build

echo "==> Starting server on port ${PORT:-3000}..."
pnpm --filter @workspace/api-server run dev
