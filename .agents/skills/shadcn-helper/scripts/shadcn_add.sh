#!/bin/bash

# Shadcn/UI Manager helper script

ACTION=$1
COMPONENT=$2

# Resolve paths
if [ -d "frontend" ]; then
  FRONTEND_DIR="frontend"
elif [ -d "../frontend" ]; then
  FRONTEND_DIR="../frontend"
else
  FRONTEND_DIR="."
fi

case "$ACTION" in
  add)
    if [ -z "$COMPONENT" ]; then
      echo "❌ Please specify a component name! Example: $0 add button"
      exit 1
    fi
    echo "=== Installing Shadcn/UI component: $COMPONENT ==="
    cd "$FRONTEND_DIR"
    npx shadcn@latest add "$COMPONENT" -y
    ;;
  list)
    echo "=== Installed Shadcn/UI Components ==="
    if [ -d "$FRONTEND_DIR/src/components/ui" ]; then
      ls -1 "$FRONTEND_DIR/src/components/ui"
    else
      echo "No shadcn/ui components installed yet."
    fi
    ;;
  init)
    echo "=== Initializing Shadcn/UI ==="
    cd "$FRONTEND_DIR"
    npx shadcn@latest init -t vite -b radix -y
    ;;
  *)
    echo "Usage: $0 {add|list|init} [component_name]"
    exit 1
    ;;
esac
