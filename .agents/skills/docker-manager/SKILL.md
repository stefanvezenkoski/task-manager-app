---
name: Local Docker Manager
description: Manages local Docker Compose services, container logs, rebuilding, health checking, and cleanup.
---
# Local Docker Manager Skill

This skill allows the agent to manage Docker Compose services locally, including starting, stopping, rebuilding, checking logs, displaying status, cleaning up resources, and verifying service health.

## Automation Script
The automation script is located at:
- `scripts/docker_manager.sh` (relative to this skill directory)

## Usage Guidelines
When the user asks to start, stop, rebuild, check logs, verify health, or clean up Docker containers:
1. To start services: `bash .agents/skills/docker-manager/scripts/docker_manager.sh up`
2. To stop services: `bash .agents/skills/docker-manager/scripts/docker_manager.sh down`
3. To rebuild and start services: `bash .agents/skills/docker-manager/scripts/docker_manager.sh build`
4. To check status of containers: `bash .agents/skills/docker-manager/scripts/docker_manager.sh status`
5. To view logs of all or a specific service: `bash .agents/skills/docker-manager/scripts/docker_manager.sh logs [optional_service_name]`
6. To clean up Docker system and volumes: `bash .agents/skills/docker-manager/scripts/docker_manager.sh clean`
7. To run a health check on the ports: `bash .agents/skills/docker-manager/scripts/docker_manager.sh check`
