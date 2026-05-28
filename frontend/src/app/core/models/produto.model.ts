export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  ativo?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface ProdutoRequest {
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
}
