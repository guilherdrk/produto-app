#!/bin/bash
# ============================================================
# deploy.sh — Executado no servidor via SSH pelo GitHub Actions
#
# O que faz:
#   1. Vai para a pasta do projeto
#   2. Baixa as versões mais novas das imagens do Docker Hub
#   3. Recria os containers com as novas imagens
#   4. Remove imagens antigas (libera espaço em disco)
# ============================================================

set -e  # Para imediatamente se qualquer comando falhar

echo "🚀 Iniciando deploy — $(date)"

# Navega para o diretório do projeto no servidor
cd /opt/produto-app

echo "📥 Baixando imagens atualizadas do Docker Hub..."
docker compose -f docker-compose.prod.yml pull

echo "🔄 Recriando containers com as novas imagens..."
# --no-deps: não recria serviços que não mudaram
# -d: roda em background
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo "🧹 Removendo imagens antigas (limpeza de disco)..."
docker image prune -f

echo "✅ Deploy concluído com sucesso! — $(date)"
echo ""
echo "📊 Status dos containers:"
docker compose -f docker-compose.prod.yml ps
