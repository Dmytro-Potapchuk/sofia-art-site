#!/usr/bin/env bash
# Jednorazowa konfiguracja VPS (Ubuntu/Debian). Uruchom jako root lub przez sudo.
set -euo pipefail

DEPLOY_DIR="${1:-/opt/sofia-art}"

echo "==> Instalacja Docker..."
apt-get update
apt-get install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

source /etc/os-release
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "==> Katalog deploy: ${DEPLOY_DIR}"
mkdir -p "${DEPLOY_DIR}"

if [ ! -f "${DEPLOY_DIR}/docker-compose.yml" ]; then
  echo "Skopiuj deploy/docker-compose.yml i deploy/env.example do ${DEPLOY_DIR}"
  echo "Następnie: cp env.example .env && nano .env"
fi

echo "==> Gotowe. Docker: $(docker --version)"
echo "Deploy path: ${DEPLOY_DIR}"
