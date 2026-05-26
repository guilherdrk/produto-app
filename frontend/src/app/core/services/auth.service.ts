import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, Usuario } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // BehaviorSubject mantém e emite o estado atual do usuário
  private usuarioAtual = new BehaviorSubject<Usuario | null>(this.getUsuarioStorage());

  usuarioAtual$ = this.usuarioAtual.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(dados: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, dados).pipe(
      tap(response => this.salvarSessao(response))
    );
  }

  register(dados: RegisterRequest): Observable<AuthResponse> {  
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, dados).pipe(
      tap(response => this.salvarSessao(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.usuarioAtual.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAutenticado(): boolean {
    return !!this.getToken();
  }

  private salvarSessao(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    const usuario: Usuario = { nome: response.nome, email: response.email };
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    this.usuarioAtual.next(usuario);
  }

  private getUsuarioStorage(): Usuario | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}
