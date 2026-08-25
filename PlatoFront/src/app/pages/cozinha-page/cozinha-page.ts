import { DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap, timer } from 'rxjs';
import { BtnBack } from '../../components/btn-back/btn-back';
import { PedidoRegistrado, StatusCozinha } from '../../models/pedido.models';
import { PedidosService } from '../../services/pedidos.service';

@Component({ selector: 'app-cozinha-page', imports: [BtnBack, DatePipe], templateUrl: './cozinha-page.html', styleUrl: './cozinha-page.scss' })
export class CozinhaPage implements OnInit {
  private readonly pedidosService = inject(PedidosService);
  private readonly destroyRef = inject(DestroyRef);
  pedidos: readonly PedidoRegistrado[] = [];
  isLoading = true;
  pedidoEmAtualizacao: number | null = null;
  errorMessage = '';

  ngOnInit(): void {
    timer(0, 5000).pipe(
      switchMap(() => this.pedidosService.listarCozinha().pipe(
        catchError(() => {
          this.errorMessage = 'Não foi possível atualizar os pedidos da cozinha.';
          return of(this.pedidos);
        }),
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((pedidos) => {
      this.pedidos = [...pedidos
        .filter((pedido) => pedido.enviarCozinha && pedido.itens.length > 0 &&
          (pedido.statusCozinha === 'PENDENTE' || pedido.statusCozinha === 'EM_PREPARO'))]
        .sort((a, b) => {
          const timeDifference = new Date(a.criadoEm ?? 0).getTime() - new Date(b.criadoEm ?? 0).getTime();
          return timeDifference !== 0 ? timeDifference : a.id - b.id;
        });
      this.isLoading = false;
    });
  }

  avancarStatus(pedido: PedidoRegistrado): void {
    if (this.pedidoEmAtualizacao !== null || !pedido.statusCozinha) return;
    const proximoStatus: StatusCozinha = pedido.statusCozinha === 'PENDENTE' ? 'EM_PREPARO' : 'CONCLUIDO';
    this.pedidoEmAtualizacao = pedido.id;
    this.errorMessage = '';
    this.pedidosService.atualizarStatusCozinha(pedido.id, proximoStatus)
      .pipe(finalize(() => this.pedidoEmAtualizacao = null))
      .subscribe({
        next: () => this.pedidos = proximoStatus === 'CONCLUIDO'
          ? this.pedidos.filter((item) => item.id !== pedido.id)
          : this.pedidos.map((item) => item.id === pedido.id ? { ...item, statusCozinha: proximoStatus } : item),
        error: () => this.errorMessage = 'Não foi possível atualizar o status do pedido.',
      });
  }
}
