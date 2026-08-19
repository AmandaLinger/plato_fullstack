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
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.stream.Collectors;

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

    @Transactional(readOnly = true)
    public byte[] gerarRelatorioNotasFiscais(LocalDate inicio, LocalDate fim) throws BadRequestException {
        if (fim.isBefore(inicio)) {
            throw new BadRequestException("A data final não pode ser anterior à data inicial");
        }

        List<Pedido> pedidos = pedidoRepository
                .findByPedidoAbertoFalseAndDataPedidoBetweenOrderByDataPedidoAscIdAsc(inicio, fim);
        StringBuilder csv = new StringBuilder("\uFEFFNota Fiscal;Data de Emissão;Mesa;Produtos;Valor Total (R$)\r\n");

        for (Pedido pedido : pedidos) {
            String produtos = pedido.getItens() == null ? "" : pedido.getItens().stream()
                    .map(item -> formatarQuantidade(item.getQuantidade()) + "x " + item.getProduto().getNome())
                    .collect(Collectors.joining(", "));
            double valorTotal = pedido.getItens() == null ? 0 : pedido.getItens().stream()
                    .mapToDouble(item -> item.getProduto().getPreco() * item.getQuantidade())
                    .sum();

            csv.append(csvCell(String.format("%06d", pedido.getId()))).append(';')
                    .append(csvCell(pedido.getDataPedido().toString())).append(';')
                    .append(csvCell(String.valueOf(pedido.getNumeroMesa()))).append(';')
                    .append(csvCell(produtos)).append(';')
                    .append(csvCell(String.format(Locale.forLanguageTag("pt-BR"), "%.2f", valorTotal)))
                    .append("\r\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String formatarQuantidade(Double quantidade) {
        if (quantidade == null) {
            return "0";
        }
        return quantidade % 1 == 0 ? String.valueOf(quantidade.longValue()) : quantidade.toString();
    }

    private String csvCell(String value) {
        String safeValue = value == null ? "" : value;
        if (!safeValue.isEmpty() && "=+-@".indexOf(safeValue.charAt(0)) >= 0) {
            safeValue = "'" + safeValue;
        }
        return "\"" + safeValue.replace("\"", "\"\"") + "\"";
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
