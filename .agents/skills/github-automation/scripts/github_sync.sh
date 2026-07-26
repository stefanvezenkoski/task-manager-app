#!/bin/bash

# A simple helper script to automate Git actions

ACTION=$1
MSG=$2

if [ "$ACTION" = "status" ]; then
  echo "=== Checking Git Status ==="
  git status
elif [ "$ACTION" = "sync" ]; then
  if [ -z "$MSG" ]; then
    MSG="update: automated commit"
  fi
  echo "=== Staging changes ==="
  git add -A
  echo "=== Committing changes with message: '$MSG' (Author: Antigravity) ==="
  git commit --author="Antigravity <antigravity-bot@users.noreply.github.com>" -m "$MSG"
  echo "=== Pushing to current branch ==="
  git push
else
  echo "Unknown action: $ACTION"
  echo "Usage: $0 [status|sync] [commit_message]"
  exit 1
fi
