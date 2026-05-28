import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProdutoService } from '../../../core/services/produto.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Produto } from '../../../core/models/produto.model';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss']
})
export class ProdutoFormComponent implements OnInit {
  form: FormGroup;
  carregando = false;
  carregandoDados = false;
  erro = '';

  // O mesmo componente serve para criar e editar!
  // Se houver ID na rota → modo edição; senão → modo criação
  produtoId: number | null = null;
  get modoEdicao(): boolean { return this.produtoId !== null; }
  get titulo():     string  { return this.modoEdicao ? 'Editar produto' : 'Novo produto'; }

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute  // ← acessa parâmetros da rota atual
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descricao: [''],
      preco: [null, [Validators.required, Validators.min(0.01)]],
      estoque: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Verifica se a rota tem o parâmetro :id
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.produtoId = Number(idParam);
      this.carregarProduto(this.produtoId);
    }
  }

  carregarProduto(id: number): void {
    this.carregandoDados = true;

    this.produtoService.buscarPorId(id).subscribe({
      next: (produto: Produto) => {
        // Preenche o formulário com os dados existentes
        this.form.patchValue({
          nome: produto.nome,
          descricao: produto.descricao,
          preco: produto.preco,
          estoque: produto.estoque
        });
        this.carregandoDados = false;
      },
      error: () => {
        this.erro = 'Produto não encontrado.';
        this.carregandoDados = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erro = '';

    const dados = this.form.value;

    // Decide qual operação executar com base no modo
    const operacao$ = this.modoEdicao
      ? this.produtoService.atualizar(this.produtoId!, dados)
      : this.produtoService.criar(dados);

    operacao$.subscribe({
      next: () => {
        // Após salvar, volta para a lista
        this.router.navigate(['/produtos']);
      },
      error: (err: {error?: {error?: string}}) => {
        this.erro = err.error?.error || 'Erro ao salvar produto.';
        this.carregando = false;
      }
    });
  }

  // Getters para o template
  get nome()    { return this.form.get('nome')!; }
  get preco()   { return this.form.get('preco')!; }
  get estoque() { return this.form.get('estoque')!; }
}
