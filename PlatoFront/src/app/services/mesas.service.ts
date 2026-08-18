import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ConsumoMesa, Mesa, PedidoRegistrado, ReservaMesa } from '../models/pedido.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MesasService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/pedido`;
  private readonly totalMesasKey = 'plato.totalMesas';
  private readonly reservasKey = 'plato.reservasMesas';
  readonly totalMesas = signal(this.readTotalMesas());
  readonly reservas = signal<readonly ReservaMesa[]>(this.readReservas());
  private readonly totalMesas$ = toObservable(this.totalMesas);
  private readonly reservas$ = toObservable(this.reservas);

  getTotalMesas(): number {
    return this.totalMesas();
  }

  setTotalMesas(total: number): void {
    localStorage.setItem(this.totalMesasKey, String(total));
    this.totalMesas.set(total);
  }

  reservarMesa(reserva: ReservaMesa): void {
    const reservas = [
      ...this.reservas().filter((item) => item.mesaNumero !== reserva.mesaNumero),
      reserva,
    ];
    localStorage.setItem(this.reservasKey, JSON.stringify(reservas));
    this.reservas.set(reservas);
  }

  cancelarReserva(mesaNumero: number): void {
    const reservas = this.reservas().filter((item) => item.mesaNumero !== mesaNumero);
    localStorage.setItem(this.reservasKey, JSON.stringify(reservas));
    this.reservas.set(reservas);
  }

  listarMesas(): Observable<readonly Mesa[]> {
    return combineLatest([this.totalMesas$, this.reservas$]).pipe(
      switchMap(([totalMesas, reservas]) =>
        this.listarPedidos().pipe(
          map((pedidos) => {
            const pedidosPorMesa = new Map<number, PedidoRegistrado>();
            const reservasPorMesa = new Map(
              reservas.map((reserva) => [reserva.mesaNumero, reserva]),
            );
            for (const pedido of pedidos) {
              pedidosPorMesa.set(pedido.numeroMesa, pedido);
            }

            return Array.from({ length: totalMesas }, (_, index): Mesa => {
              const numero = index + 1;
              const pedido = pedidosPorMesa.get(numero);
              const reserva = reservasPorMesa.get(numero);
              return {
                numero,
                status: pedido ? 'Ocupada' : reserva ? 'Reservada' : 'Livre',
                pedidoId: pedido ? String(pedido.id) : undefined,
                reserva: pedido ? undefined : reserva,
              };
            });
          }),
        ),
      ),
    );
  }

  buscarConsumo(numeroMesa: number): Observable<ConsumoMesa> {
    return this.listarPedidos().pipe(
      map((pedidos) => {
        const pedidosDaMesa = pedidos.filter((pedido) => pedido.numeroMesa === numeroMesa);
        return this.toConsumo(numeroMesa, pedidosDaMesa);
      }),
    );
  }

  listarConsumosOcupados(): Observable<readonly ConsumoMesa[]> {
    const totalMesas = this.getTotalMesas();
    return this.listarPedidos().pipe(
      map((pedidos) => {
        const numerosOcupados = [
          ...new Set(
            pedidos
              .map((pedido) => pedido.numeroMesa)
              .filter((numero) => numero >= 1 && numero <= totalMesas),
          ),
        ].sort((a, b) => a - b);

        return numerosOcupados.map((numeroMesa) =>
          this.toConsumo(
            numeroMesa,
            pedidos.filter((pedido) => pedido.numeroMesa === numeroMesa),
          ),
        );
      }),
    );
  }

  private listarPedidos(): Observable<readonly PedidoRegistrado[]> {
    return this.http.get<readonly PedidoRegistrado[]>(`${this.endpoint}/abertos`);
  }

  private readTotalMesas(): number {
    const total = Number(localStorage.getItem(this.totalMesasKey));
    return Number.isInteger(total) && total > 0 ? total : 12;
  }

  private readReservas(): readonly ReservaMesa[] {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(this.reservasKey) ?? '[]');
      if (!Array.isArray(value)) {
        return [];
      }

      return value.filter(
        (item): item is ReservaMesa =>
          typeof item === 'object' &&
          item !== null &&
          Number.isInteger((item as ReservaMesa).mesaNumero) &&
          typeof (item as ReservaMesa).clienteNome === 'string' &&
          typeof (item as ReservaMesa).horario === 'string',
      );
    } catch {
      return [];
    }
  }

  private toConsumo(
    numeroMesa: number,
    pedidos: readonly PedidoRegistrado[],
  ): ConsumoMesa {
    const itens = pedidos.flatMap((pedido) => pedido.itens ?? []).map((item) => ({
      id: String(item.id),
      produtoNome: item.produto.nome,
      quantidade: item.quantidade,
      observacoes: '',
      precoUnitario: item.produto.preco,
      subtotal: item.produto.preco * item.quantidade,
    }));

    return {
      mesaNumero: numeroMesa,
      pedidoId: pedidos.map((pedido) => pedido.id).join(','),
      abertoEm: '',
      itens,
      valorTotal: itens.reduce((total, item) => total + item.subtotal, 0),
    };
  }
}
