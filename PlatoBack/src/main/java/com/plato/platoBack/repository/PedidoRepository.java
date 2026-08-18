package com.plato.platoBack.repository;

import com.plato.platoBack.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByPedidoAbertoTrue();

    List<Pedido> findByPedidoAbertoFalseAndDataPedidoOrderByIdDesc(LocalDate dataPedido);
}
