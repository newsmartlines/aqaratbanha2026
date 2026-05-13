#!/bin/bash
set -e

# Start the API server explicitly on port 3001
PORT=3001 pnpm --filter @workspace/api-server run dev &
API_PID=$!

# Start the frontend using Replit's PORT env var (24749) — do NOT override it.
# Replit's artifact-router proxies port 5000 -> 24749 automatically.
pnpm --filter @workspace/banha-realestate run dev &
FRONTEND_PID=$!

# Wait for either process to exit
wait -n $API_PID $FRONTEND_PID

# If either exits, kill the other
kill $API_PID $FRONTEND_PID 2>/dev/null || true
