#!/usr/bin/env bash
# Krevanje na k3d klaster vo GitHub Codespace za demo na CI/CD pipeline-ot.
# Upotreba vo terminalot na Codespace-ot:
#   bash k8s/codespace-setup.sh
set -euo pipefail

K8S_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> 1/4  Instalacija na k3d i kubectl"
if ! command -v k3d >/dev/null 2>&1; then
  curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
fi
if ! command -v kubectl >/dev/null 2>&1; then
  KVER="$(curl -sL https://dl.k8s.io/release/stable.txt)"
  curl -sLO "https://dl.k8s.io/release/${KVER}/bin/linux/amd64/kubectl"
  sudo install -m 0755 kubectl /usr/local/bin/kubectl && rm -f kubectl
fi

echo "==> 1b   Kreiranje k3d klaster (port 80 -> traefik)"
CLUSTER="task-manager-cluster"
if k3d cluster list 2>/dev/null | grep -q "^${CLUSTER}"; then
  k3d cluster start "${CLUSTER}"
else
  k3d cluster create "${CLUSTER}" -p "80:80@loadbalancer"
fi
kubectl wait --for=condition=Ready node --all --timeout=180s

echo "==> 2/4  Generiranje na secrets (ne se vo git)"
if [ ! -f "${K8S_DIR}/postgres-secret.yaml" ]; then
  PGPASS="$(openssl rand -hex 16)"
  sed "s|<your_postgres_password_here>|${PGPASS}|" \
    "${K8S_DIR}/postgres-secret.yaml.example" > "${K8S_DIR}/postgres-secret.yaml"
  sed "s|<POSTGRES_PASSWORD_HERE>|${PGPASS}|" \
    "${K8S_DIR}/backend-secret.yaml.example" > "${K8S_DIR}/backend-secret.yaml"
  echo "    napravena nova lozinka, vmetnata vo dvata secret-a"
else
  echo "    secrets vekje postojat, gi ostavam"
fi

echo "==> 3/4  Apliciranje na manifestite"
kubectl apply -f "${K8S_DIR}/namespace.yaml"
kubectl apply -f "${K8S_DIR}"

echo "==> 4/4  Cekam podovite"
kubectl rollout status statefulset/postgres -n task-manager --timeout=180s
kubectl rollout status deployment/backend   -n task-manager --timeout=180s
kubectl rollout status deployment/frontend  -n task-manager --timeout=180s

echo
kubectl get pods -n task-manager
echo
echo "Gotovo. Otvori go PORTS tabot dolu, najdi port 80,"
echo "desen klik -> Port Visibility -> Public, i kopiraj go URL-to."
