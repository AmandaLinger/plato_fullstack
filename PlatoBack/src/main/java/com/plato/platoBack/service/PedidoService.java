package com.plato.platoBack.service;

import com.plato.platoBack.dto.PedidoDto;
import com.plato.platoBack.entity.Pedido;
import com.plato.platoBack.repository.PedidoRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Validated
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public void cadastrarPedido(PedidoDto pedidoDto) {
        Pedido p = new Pedido();
        p.setNumeroMesa(pedidoDto.getNumeroMesa());
        p.setItens(pedidoDto.getItens());
        p.setPedidoAberto(true);
        p.setDataPedido(LocalDate.now());

        if (p.getItens() != null) {
            p.getItens().forEach(item -> item.setPedido(p));
        }

        pedidoRepository.save(p);
    }

    public void atualizarPedido(Long id, PedidoDto pedidoDto ) throws BadRequestException {
        Pedido p = pedidoRepository.findById(id)
                .orElse(null);

        if(p == null){
            throw new BadRequestException("Nenhum pedido encontrado");
        }

        p.setNumeroMesa(pedidoDto.getNumeroMesa());
        p.setItens(pedidoDto.getItens());

        if (pedidoDto.getPedidoAberto() != null) {
            p.setPedidoAberto(pedidoDto.getPedidoAberto());
        }

        if (pedidoDto.getDataPedido() != null) {
            p.setDataPedido(pedidoDto.getDataPedido());
        }

        if (p.getItens() != null) {
            p.getItens().forEach(item -> item.setPedido(p));
        }

        pedidoRepository.save(p);
    }

    public List<Pedido> chamaPedido(){
        return pedidoRepository.findAll();
    }

    public List<Pedido> chamaPedidosAbertos() {
        return pedidoRepository.findByPedidoAbertoTrue();
    }

    public List<Pedido> chamaPedidosFinalizadosPorData(LocalDate dataPedido) {
        return pedidoRepository.findByPedidoAbertoFalseAndDataPedidoOrderByIdDesc(dataPedido);
    }

    @Transactional
    public void finalizarPedido(Long id) throws BadRequestException {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Nenhum pedido encontrado"));

        pedido.setPedidoAberto(false);
        pedidoRepository.save(pedido);
    }

    public void deletaPedido(Long id) throws BadRequestException {
        Pedido p = pedidoRepository.findById(id).
                orElse(null);

        if(p == null){
            throw new BadRequestException("Nenhum produto encontrado com esse id");
        }

        pedidoRepository.delete(p);
    }
}
