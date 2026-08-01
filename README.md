# Task Manager App

A full-stack task management (to-do list) application, built as a project for the **Continuous Integration and Delivery** course (FCSE, 2025/26).

The app supports creating, viewing, updating, marking as complete, and deleting tasks through a REST API backed by a relational database.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite (production build served via nginx) |
| Backend | FastAPI (Python) + SQLAlchemy |
| Database | PostgreSQL |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes (tested with k3d + Traefik Ingress) |
| CI/CD | GitHub Actions → DockerHub, self-hosted runner for CD |

## Architecture

The application is split into three independent services communicating over HTTP and SQL:

```
Client / Browser
      |
      | HTTP (port 80 in production behind Ingress, or 5173 for local Vite dev)
      v
Frontend (React + TypeScript + Vite)  --HTTP (REST API / JSON)-->  Backend (FastAPI + SQLAlchemy)  --SQL-->  Database (PostgreSQL)
                                       <---------JSON Response---------                              <---Result sets---
```

Every HTTP request passes through the Ingress controller (Traefik), which routes traffic to the matching Kubernetes Service, and from there to the pod running the app.

## Project Structure

```
task-manager-app/
  .github/workflows/     # CI/CD pipeline (GitHub Actions)
  backend/
    app/
      main.py            # FastAPI endpoints
      models.py          # SQLAlchemy models
      schemas.py         # Pydantic schemas
      crud.py            # CRUD operations
      database.py        # Database connection
    Dockerfile
    requirements.txt
  frontend/
    src/
    Dockerfile            # multi-stage build (Vite build + nginx)
    nginx.conf
  k8s/                    # Kubernetes manifests
  docker-compose.yml
  .env.example            # environment variable template (copy to .env)
  .gitignore
```

---

## 1. Running with Docker Compose (local)

### Step 1 — Copy the `.example` file(s)

Before the first run, copy `.env.example` to `.env` (the real file with credentials, which is never committed to Git):

```bash
cp .env.example .env
```

Open `.env` and make sure it contains:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=taskdb
DATABASE_URL=postgresql://postgres:postgres@taskdb:5432/taskdb
```

By default, local development uses `postgres` / `postgres` as the username and password — in a real production environment these should be replaced with stronger credentials.

### Step 2 — Start all services

```bash
docker compose up --build
```

This starts the three services defined in `docker-compose.yml`:

- **`taskdb`** — PostgreSQL database (port 5432), with a named volume (`pgdata`) for data persistence
- **`backend-service`** — FastAPI backend (port 8000), depends on `taskdb`
- **`frontend`** — React app built with Vite and served via nginx (port 5173 → container port 80), depends on `backend-service`. Built with `VITE_API_URL=/api` so it calls the backend through the same origin.

### Step 3 — Verify it's working

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend health check: [http://localhost:8000/health](http://localhost:8000/health) → `{"status":"ok"}`
- Backend API docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

### Stopping

```bash
docker compose down
```

To also remove the database volume (deletes all data):

```bash
docker compose down -v
```

---

## 2. Running with Kubernetes

### Prerequisites

- A running Kubernetes cluster (tested with [k3d](https://k3d.io)), with an Ingress Controller (Traefik, bundled by default in k3d)
- `kubectl` installed and pointing at the cluster

### Step 1 — Create a cluster (if you don't already have one)

```bash
k3d cluster create task-manager-cluster -p "80:80@loadbalancer" -p "443:443@loadbalancer"
```

### Step 2 — Copy the `.example` Secret files

For security reasons, `Secret` manifests containing real passwords are **not committed to Git** — only `.example` templates are. Before running `kubectl apply`, copy them and fill in the real values:

```bash
cd k8s
cp postgres-secret.yaml.example postgres-secret.yaml
cp backend-secret.yaml.example backend-secret.yaml
```

Open `postgres-secret.yaml` and `backend-secret.yaml` and replace the placeholder with the real password. By default, local development uses:

```yaml
# postgres-secret.yaml
stringData:
  POSTGRES_PASSWORD: postgres
```

```yaml
# backend-secret.yaml
stringData:
  DATABASE_URL: postgresql://postgres:postgres@postgres.task-manager.svc.cluster.local:5432/taskdb
```

(The `postgres` username is already set in `postgres-configmap.yaml`, which **is** committed to Git since it contains no sensitive data.)

### Step 3 — Check the Docker image names

In `backend-deployment.yaml` and `frontend-deployment.yaml`, make sure `image:` points to your actual DockerHub username:

```yaml
image: <your-dockerhub-username>/task-manager-backend:latest
```

### Step 4 — Apply the manifests

```bash
kubectl apply -f .
```

(applies every `.yaml` file in the `k8s/` folder — resource dependencies, such as Namespace before everything else, are handled by Kubernetes itself when re-applying, but for a clean first-time setup you can apply in this order: `namespace.yaml` → `postgres-configmap.yaml` + `postgres-secret.yaml` → `postgres-statefulset.yaml` → `postgres-service.yaml` → `backend-secret.yaml` → `backend-deployment.yaml` → `backend-service.yaml` → `frontend-deployment.yaml` → `frontend-service.yaml` → `middleware.yaml` → `ingress.yaml`)

### Step 5 — Verify everything is running

```bash
kubectl get all,ingress,middleware -n task-manager
```

All pods should show `Running`, Deployments should show `READY 2/2`, and the StatefulSet should show `1/1`.

### Step 6 — Test it

```bash
curl http://localhost/api/health
curl http://localhost/api/tasks
```

Open in a browser: [http://localhost/](http://localhost/)

### Cleanup

```bash
kubectl delete namespace task-manager
```

(Deletes everything at once — all resources, including the data in the PersistentVolumeClaim.)

---

## CI/CD

The project has a GitHub Actions pipeline (`.github/workflows/`) that, on every push to `main`:

1. Builds Docker images for the backend and frontend
2. Pushes them to DockerHub (tagged `latest` and with the commit SHA)
3. *(bonus)* Automatically redeploys to the local Kubernetes cluster via a self-hosted runner (`kubectl rollout restart`)

## Security Notes

Files containing real passwords (`.env`, `k8s/postgres-secret.yaml`, `k8s/backend-secret.yaml`) are listed in `.gitignore` and are never committed to Git. Only the `.example` templates (with no real values) are part of the repository. Anyone cloning the project must copy and fill them in themselves, following the steps above.

