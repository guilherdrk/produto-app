import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None  // Permite que estilos globais alcancem este componente
})
export class LoginComponent {
  form: FormGroup;
  erro = '';
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.form.get('email')!; }
  get senha()  { return this.form.get('senha')!; }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.carregando = true;
    this.erro = '';

    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/produtos']),
      error: (err) => {
        this.erro = err.error?.error || 'Email ou senha inválidos';
        this.carregando = false;
      }
    });
  }
}
