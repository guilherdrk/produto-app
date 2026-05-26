import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutoService } from '../../../core/services/produto.service';
import { Produto } from '../../../core/models/produto.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.scss']
})
export class ProdutoListComponent implements OnInit {
  produtos: Produto[] = [];
  carregando = true;
  erro = '';
  sucessoMsg = '';

  // Controle do modal de confirmação de exclusão
  modalAberto = false;
  produtoParaExcluir: Produto | null = null;
  excluindo = false;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.erro = '';

    this.produtoService.listarTodos().subscribe({
      next: (dados: Produto[]) => {
        this.produtos = dados;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar produtos. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  // Abre o modal pedindo confirmação antes de excluir
  confirmarExclusao(produto: Produto): void {
    this.produtoParaExcluir = produto;
    this.modalAberto = true;
  }

  cancelarExclusao(): void {
    this.produtoParaExcluir = null;
    this.modalAberto = false;
  }

  excluir(): void {
    if (!this.produtoParaExcluir?.id) return;

    this.excluindo = true;

    this.produtoService.deletar(this.produtoParaExcluir.id).subscribe({
      next: () => {
        this.sucessoMsg = `"${this.produtoParaExcluir?.nome}" excluído com sucesso.`;
        this.modalAberto = false;
        this.produtoParaExcluir = null as Produto | null;
        this.excluindo = false;
        this.carregarProdutos();

        // Remove a mensagem de sucesso após 3 segundos
        setTimeout(() => this.sucessoMsg = '', 3000);
      },
      error: () => {
        this.erro = 'Erro ao excluir produto.';
        this.excluindo = false;
        this.modalAberto = false;
      }
    });
  }

  // Formata o preço em BRL
  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
