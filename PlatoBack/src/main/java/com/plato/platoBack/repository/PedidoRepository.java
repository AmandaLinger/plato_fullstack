package com.plato.platoBack.repository;

import com.plato.platoBack.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import com.plato.platoBack.enuns.StatusCozinha;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findAllByRestauranteId(Long restauranteId);

    java.util.Optional<Pedido> findByIdAndRestauranteId(Long id, Long restauranteId);

    List<Pedido> findByRestauranteIdAndPedidoAbertoTrue(Long restauranteId);

    List<Pedido> findByRestauranteIdAndEnviarCozinhaTrueAndStatusCozinhaInOrderByCriadoEmAscIdAsc(
            Long restauranteId,
            List<StatusCozinha> status
    );

    List<Pedido> findByRestauranteIdAndPedidoAbertoFalseAndDataPedidoOrderByIdDesc(Long restauranteId, LocalDate dataPedido);

    List<Pedido> findByRestauranteIdAndPedidoAbertoFalseAndDataPedidoBetweenOrderByDataPedidoAscIdAsc(
            Long restauranteId,
            LocalDate inicio,
            LocalDate fim
    );
}
