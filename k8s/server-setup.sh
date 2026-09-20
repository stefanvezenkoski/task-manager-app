#!/usr/bin/env bash
# Podgotvuva Ubuntu VM (Azure / DigitalOcean / Hetzner) da ja vrti aplikacijata na k3s.
# Se vrti EDNAS na serverot:
#   git clone https://github.com/stefanvezenkoski/task-manager-app.git
#   bash task-manager-app/k8s/server-setup.sh
set -euo pipefail

K8S_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

echo "==> 1/4  Instalacija na k3s"
if ! command -v k3s >/dev/null 2>&1; then
  # mode 644 za da moze i ne-root korisnik (azureuser) da vrti kubectl
  curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--write-kubeconfig-mode 644" sh -
fi
# k3s treba nekolku sekundi za node objektot da se pojavi;
# 'kubectl wait --all' pagja vednas ako uste nema nisto sto odgovara
echo "    cekam node da se pojavi..."
for _ in $(seq 1 60); do
  kubectl get nodes >/dev/null 2>&1 && break
  sleep 2
done
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
kubectl rollout status statefulset/postgres -n task-manager --timeout=300s
kubectl rollout status deployment/backend   -n task-manager --timeout=300s
kubectl rollout status deployment/frontend  -n task-manager --timeout=300s

echo
kubectl get pods -n task-manager
IP="$(curl -s -4 ifconfig.me || echo '<IP>')"
echo
echo "Gotovo. Aplikacijata e na:  http://${IP}"
