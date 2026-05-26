# ================================
# STAGE 1: BUILD
# Node.js para compilar o Angular
# ================================
FROM node:18-alpine AS build

WORKDIR /app

# Copia package.json e instala dependências primeiro (cache)
# Se package.json não mudar, Docker reutiliza esta camada
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copia o código e compila para produção
COPY . .
RUN npm run build -- --configuration production

# ================================
# STAGE 2: RUNTIME
# Nginx serve os arquivos estáticos
# Imagem final: ~25MB vs ~800MB do Node
# ================================
FROM nginx:alpine AS runtime

# Remove config padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa configuração personalizada
COPY nginx.conf /etc/nginx/conf.d/

# Copia o build do Angular (stage anterior) para o diretório do Nginx
# O nome "frontend" é o nome do projeto no angular.json
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Porta 80 exposta pelo Nginx
EXPOSE 80

# Health check simples
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
