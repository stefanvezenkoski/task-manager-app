---
name: Pre-Commit Validation Skill
description: Validates frontend compilation (TypeScript) and backend syntax before any commit or push.
---
# Pre-Commit Validation Skill

This skill allows the agent to automatically check code quality, compile code, and run tests before committing or pushing changes to the repository.

## Automation Script
The validation script is located at:
- `scripts/validate.sh` (relative to this skill directory)

## Usage Guidelines
When the user asks to validate the project or before committing/pushing changes:
1. Run `bash .agents/skills/pre-commit-check/scripts/validate.sh` to run all validation checks.
2. If any validation fails (non-zero return code), fix the errors and do not proceed with committing/pushing changes.
