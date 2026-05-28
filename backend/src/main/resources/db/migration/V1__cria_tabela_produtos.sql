CREATE TABLE produtos (
    id          BIGSERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    descricao   TEXT,
    preco       DECIMAL(10, 2) NOT NULL,
    estoque     INTEGER NOT NULL DEFAULT 0,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);