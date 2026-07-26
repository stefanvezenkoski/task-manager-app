# Workspace Rules for Task Manager App

This file contains rules and guidelines that the Antigravity agent will follow when working in this repository.

## Development Guidelines
- Always write clean, modular code.
- **For UI styling and components, use ONLY `shadcn/ui` components.**
- Keep components focused and reusable.
- Follow the project structure defined in [PROJECT_STRUCTURE.md](file:///Users/stefanvezenkoski/Desktop/task%20manager%20app/PROJECT_STRUCTURE.md).

## Project Architecture & CI/CD Setup
- This is a project for the CI/CD course requiring a minimum of three services:
  1. **Frontend**: React + TypeScript + Vite (Port 5173).
  2. **Backend**: FastAPI + Python (Port 8000).
  3. **Database**: PostgreSQL (Port 5432).
- **Dockerization**: Includes Dockerfiles for frontend/backend, and a `docker-compose.yml` to run all services locally.
- **GitHub Actions**: Configured to build and push Docker images to DockerHub upon push.
- **Next Steps**: Kubernetes (k8s) configurations will be worked on later. Do not modify or create k8s files unless explicitly requested.
