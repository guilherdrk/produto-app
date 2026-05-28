import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Observa mudanças no usuário logado em tempo real
    this.authService.usuarioAtual$.subscribe((user: Usuario | null) => {
      this.usuario = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  // Retorna as iniciais do nome para o avatar
  getIniciais(): string {
    if (!this.usuario?.nome) return '?';
    return this.usuario.nome
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}
