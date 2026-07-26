---
name: Shadcn/UI Manager
description: Helps add, install, and manage shadcn/ui components in the frontend.
---
# Shadcn/UI Manager Skill

This skill allows the agent to automatically add, install, and list shadcn/ui components in the frontend React application.

## Automation Script
The automation script is located at:
- `scripts/shadcn_add.sh` (relative to this skill directory)

## Usage Guidelines
When the user asks to add or list shadcn components:
1. To add a component: `bash .agents/skills/shadcn-helper/scripts/shadcn_add.sh add <component_name>`
2. To list installed components: `bash .agents/skills/shadcn-helper/scripts/shadcn_add.sh list`
3. To initialize shadcn/ui (if needed again): `bash .agents/skills/shadcn-helper/scripts/shadcn_add.sh init`
