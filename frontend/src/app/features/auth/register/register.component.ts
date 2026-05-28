import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Validador customizado: confirmar senha
function senhasIguais(control: AbstractControl) {
  const senha = control.get('senha')?.value;
  const confirmar = control.get('confirmarSenha')?.value;
  return senha === confirmar ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  form: FormGroup;
  erro = '';
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, { validators: senhasIguais });
    // ↑ validador de grupo aplicado ao formulário inteiro
  }

  // Getters para acessar os campos facilmente no template
  get nome()          { return this.form.get('nome')!; }
  get email()         { return this.form.get('email')!; }
  get senha()         { return this.form.get('senha')!; }
  get confirmarSenha(){ return this.form.get('confirmarSenha')!; }

  onSubmit(): void {
    if (this.form.invalid) {
      // Marca todos como touched para mostrar erros
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erro = '';

    const { nome, email, senha } = this.form.value;

    this.authService.register({ nome, email, senha }).subscribe({
      next: () => this.router.navigate(['/produtos']),
      error: (err) => {
        this.erro = err.error?.error || 'Erro ao criar conta. Tente novamente.';
        this.carregando = false;
      }
    });
  }
}
