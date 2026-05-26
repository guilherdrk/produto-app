# ================================
# STAGE 1: BUILD
# Usa JDK completo + Maven para compilar
# Spring Boot 4 requer Java 21+
# ================================
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Copia o Maven Wrapper primeiro
# Docker cacheia essa camada enquanto pom.xml não mudar
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Baixa dependências em cache separado do código-fonte
RUN ./mvnw dependency:go-offline -B

# Copia código e compila (sem rodar testes)
COPY src ./src
RUN ./mvnw package -DskipTests -B

# ================================
# STAGE 2: RUNTIME
# Usa apenas JRE 21 — sem JDK, sem Maven, sem código-fonte
# Imagem muito menor e mais segura
# ================================
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Cria usuário não-root por segurança
# Rodar como root em container é má prática de segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia apenas o JAR do stage anterior
COPY --from=build /app/target/*.jar app.jar

# Define o usuário não-root
USER appuser

# Porta exposta pelo Spring Boot
EXPOSE 8080

# Health check: verifica se o Actuator está respondendo
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

# Opções de JVM para containers (limita uso de memória)
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
