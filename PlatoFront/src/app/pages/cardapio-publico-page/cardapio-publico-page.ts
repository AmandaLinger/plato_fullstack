import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import {
  CardapioPublico,
  CardapioPublicoService,
  ProdutoCardapioPublico,
} from '../../services/cardapio-publico.service';

interface GrupoCardapio {
  readonly categoria: string;
  readonly produtos: readonly ProdutoCardapioPublico[];
}

@Component({
  selector: 'app-cardapio-publico-page',
  imports: [CurrencyPipe],
  templateUrl: './cardapio-publico-page.html',
  styleUrl: './cardapio-publico-page.scss',
})
export class CardapioPublicoPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(CardapioPublicoService);

  cardapio: CardapioPublico | null = null;
  grupos: readonly GrupoCardapio[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const restauranteId = Number(this.route.snapshot.paramMap.get('restauranteId'));
    if (!Number.isInteger(restauranteId) || restauranteId <= 0) {
      this.isLoading = false;
      this.errorMessage = 'Cardápio não encontrado.';
      return;
    }

    this.service.buscar(restauranteId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (cardapio) => {
          this.cardapio = cardapio;
          this.grupos = this.agruparProdutos(cardapio.produtos);
        },
        error: () => this.errorMessage = 'Não foi possível carregar este cardápio.',
      });
  }

  private agruparProdutos(produtos: readonly ProdutoCardapioPublico[]): readonly GrupoCardapio[] {
    const grupos = new Map<string, ProdutoCardapioPublico[]>();
    for (const produto of produtos) {
      const categoria = produto.categoria?.trim() || 'Outros';
      grupos.set(categoria, [...(grupos.get(categoria) ?? []), produto]);
    }
    return [...grupos.entries()].map(([categoria, itens]) => ({ categoria, produtos: itens }));
  }
}
