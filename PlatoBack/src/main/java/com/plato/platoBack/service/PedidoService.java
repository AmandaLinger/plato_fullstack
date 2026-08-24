package com.plato.platoBack.service;

import com.plato.platoBack.dto.PedidoDto;
import com.plato.platoBack.entity.Pedido;
import com.plato.platoBack.enuns.FormaPagamento;
import com.plato.platoBack.enuns.StatusCozinha;
import com.plato.platoBack.repository.PedidoRepository;
import com.plato.platoBack.repository.ProdutoRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@Validated
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private RestauranteContextService restauranteContext;

    @Autowired
    private ProdutoRepository produtoRepository;

    public void cadastrarPedido(PedidoDto pedidoDto) {
        Pedido p = new Pedido();
        p.setNumeroMesa(pedidoDto.getNumeroMesa());
        p.setItens(pedidoDto.getItens());
        p.setPedidoAberto(true);
        p.setEnviarCozinha(Boolean.TRUE.equals(pedidoDto.getEnviarCozinha()));
        p.setStatusCozinha(Boolean.TRUE.equals(pedidoDto.getEnviarCozinha())
                ? StatusCozinha.PENDENTE
                : null);
        p.setCriadoEm(LocalDateTime.now());
        p.setDataPedido(LocalDate.now());
        p.setRestaurante(restauranteContext.getRestaurante());

        if (p.getItens() != null) {
            p.getItens().forEach(item -> {
                Long produtoId = item.getProduto() == null ? null : item.getProduto().getId();
                item.setProduto(produtoRepository.findByIdAndRestauranteId(produtoId, restauranteContext.getId())
                        .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                org.springframework.http.HttpStatus.BAD_REQUEST, "Produto inválido para o restaurante")));
                item.setPedido(p);
            });
        }

        pedidoRepository.save(p);
    }

    public void atualizarPedido(Long id, PedidoDto pedidoDto ) throws BadRequestException {
        Pedido p = pedidoRepository.findByIdAndRestauranteId(id, restauranteContext.getId())
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

        if (pedidoDto.getFormaPagamento() != null) {
            p.setFormaPagamento(pedidoDto.getFormaPagamento());
        }

        if (p.getItens() != null) {
            p.getItens().forEach(item -> {
                Long produtoId = item.getProduto() == null ? null : item.getProduto().getId();
                item.setProduto(produtoRepository.findByIdAndRestauranteId(produtoId, restauranteContext.getId())
                        .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                org.springframework.http.HttpStatus.BAD_REQUEST, "Produto inválido para o restaurante")));
                item.setPedido(p);
            });
        }

        pedidoRepository.save(p);
    }

    public List<Pedido> chamaPedido(){
        return pedidoRepository.findAllByRestauranteId(restauranteContext.getId());
    }

    public List<Pedido> chamaPedidosAbertos() {
        return pedidoRepository.findByRestauranteIdAndPedidoAbertoTrue(restauranteContext.getId());
    }

    @Transactional(readOnly = true)
    public List<Pedido> chamaPedidosCozinha() {
        return pedidoRepository
                .findByRestauranteIdAndEnviarCozinhaTrueAndStatusCozinhaInOrderByCriadoEmAsc(
                        restauranteContext.getId(),
                        List.of(StatusCozinha.PENDENTE, StatusCozinha.EM_PREPARO)
                );
    }

    @Transactional
    public void atualizarStatusCozinha(Long id, StatusCozinha status) throws BadRequestException {
        if (status == null || status == StatusCozinha.PENDENTE) {
            throw new BadRequestException("Status de cozinha inválido");
        }
        Pedido pedido = pedidoRepository.findByIdAndRestauranteId(id, restauranteContext.getId())
                .orElseThrow(() -> new BadRequestException("Nenhum pedido encontrado"));
        if (!Boolean.TRUE.equals(pedido.getEnviarCozinha())
                || pedido.getStatusCozinha() == StatusCozinha.CONCLUIDO) {
            throw new BadRequestException("Pedido não está disponível na cozinha");
        }
        if (status == StatusCozinha.CONCLUIDO
                && pedido.getStatusCozinha() != StatusCozinha.EM_PREPARO) {
            throw new BadRequestException("Inicie o preparo antes de concluir o pedido");
        }
        pedido.setStatusCozinha(status);
        pedidoRepository.save(pedido);
    }

    public List<Pedido> chamaPedidosFinalizadosPorData(LocalDate dataPedido) {
        return pedidoRepository.findByRestauranteIdAndPedidoAbertoFalseAndDataPedidoOrderByIdDesc(restauranteContext.getId(), dataPedido);
    }

    @Transactional(readOnly = true)
    public byte[] gerarRelatorioNotasFiscais(LocalDate inicio, LocalDate fim) throws BadRequestException {
        if (fim.isBefore(inicio)) {
            throw new BadRequestException("A data final não pode ser anterior à data inicial");
        }

        List<Pedido> pedidos = pedidoRepository
                .findByRestauranteIdAndPedidoAbertoFalseAndDataPedidoBetweenOrderByDataPedidoAscIdAsc(restauranteContext.getId(), inicio, fim);
        StringBuilder csv = new StringBuilder("\uFEFFNota Fiscal;Data de Emissão;Mesa;Forma de Pagamento;Produtos;Valor Total (R$)\r\n");

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
                    .append(csvCell(pedido.getFormaPagamento() == null ? "" : pedido.getFormaPagamento().toValue())).append(';')
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
    public void finalizarPedido(Long id, FormaPagamento formaPagamento) throws BadRequestException {
        Pedido pedido = pedidoRepository.findByIdAndRestauranteId(id, restauranteContext.getId())
                .orElseThrow(() -> new BadRequestException("Nenhum pedido encontrado"));

        if (formaPagamento == null) {
            throw new BadRequestException("Forma de pagamento é obrigatória");
        }

        pedido.setPedidoAberto(false);
        pedido.setFormaPagamento(formaPagamento);
        pedidoRepository.save(pedido);
    }

    public void deletaPedido(Long id) throws BadRequestException {
        Pedido p = pedidoRepository.findByIdAndRestauranteId(id, restauranteContext.getId()).
                orElse(null);

        if(p == null){
            throw new BadRequestException("Nenhum produto encontrado com esse id");
        }

        pedidoRepository.delete(p);
    }
}
