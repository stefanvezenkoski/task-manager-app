#!/bin/bash

# Docker Compose Automation Manager

ACTION=$1
SERVICE=$2

case "$ACTION" in
  up)
    echo "=== Starting Docker Compose Services ==="
    docker compose up -d
    ;;
  down)
    echo "=== Stopping Docker Compose Services ==="
    docker compose down
    ;;
  build)
    echo "=== Rebuilding and Starting Docker Compose Services ==="
    docker compose up -d --build
    ;;
  status)
    echo "=== Container Status ==="
    docker compose ps
    ;;
  logs)
    if [ -n "$SERVICE" ]; then
      echo "=== Logs for service: $SERVICE (Last 100 lines) ==="
      docker compose logs --tail=100 "$SERVICE"
    else
      echo "=== Logs for all services (Last 100 lines) ==="
      docker compose logs --tail=100
    fi
    ;;
  clean)
    echo "=== Cleaning up Docker Containers, Volumes, and Networks ==="
    docker compose down -v
    docker system prune -f
    ;;
  check)
    echo "=== Health Checking Services ==="
    
    # 1. Database Check
    if nc -z localhost 5432 2>/dev/null; then
      echo "✅ Database (PostgreSQL) is listening on port 5432"
    else
      echo "❌ Database (PostgreSQL) is NOT listening on port 5432"
    fi

    # 2. Backend Check
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health | grep -q "200"; then
      echo "✅ Backend (FastAPI) is healthy on http://localhost:8000/health"
    else
      if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ | grep -q "200\|404"; then
        echo "✅ Backend (FastAPI) is running on http://localhost:8000"
      else
        echo "❌ Backend (FastAPI) is NOT responding on http://localhost:8000"
      fi
    fi

    # 3. Frontend Check
    if curl -s -I http://localhost:5173 > /dev/null; then
      echo "✅ Frontend (Vite) is active on http://localhost:5173"
    else
      echo "❌ Frontend (Vite) is NOT active on http://localhost:5173"
    fi
    ;;
  *)
    echo "Usage: $0 {up|down|build|status|logs|clean|check} [service_name]"
    exit 1
    ;;
esac
