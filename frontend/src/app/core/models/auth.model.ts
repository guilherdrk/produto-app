export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  nome: string;
  email: string;
}

export interface Usuario {
  nome: string;
  email: string;
}
