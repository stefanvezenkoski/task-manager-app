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

  # Run validation
  if [ -f ".agents/skills/pre-commit-check/scripts/validate.sh" ]; then
    echo "=== Running Pre-Commit Validation ==="
    bash .agents/skills/pre-commit-check/scripts/validate.sh
    if [ $? -ne 0 ]; then
      echo "❌ Validation failed! Aborting sync."
      exit 1
    fi
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
