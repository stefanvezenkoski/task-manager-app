---
name: GitHub Sync Skill
description: Automates Git status checks, commits, and pushing code to GitHub.
---
# GitHub Automation Skill

This skill allows the agent to automatically check Git status, stage changes, commit with a clear, concise commit message, and push to GitHub using the helper script.

## Automation Script
The automation script is located at:
- `scripts/github_sync.sh` (relative to this skill directory)

## Usage Guidelines
When the user requests to sync, push, or commit changes:
1. Run `bash .agents/skills/github-automation/scripts/github_sync.sh status` to check current status.
2. If there are changes, prompt or generate a suitable commit message.
3. Run `bash .agents/skills/github-automation/scripts/github_sync.sh sync "<commit_message>"` to add, commit, and push.
