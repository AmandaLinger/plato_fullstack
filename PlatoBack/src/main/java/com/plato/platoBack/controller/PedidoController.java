package com.plato.platoBack.controller;


import com.plato.platoBack.dto.PedidoDto;
import com.plato.platoBack.dto.FinalizarPedidoDto;
import com.plato.platoBack.entity.Pedido;
import com.plato.platoBack.entity.Produto;
import com.plato.platoBack.service.PedidoService;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Validated
@RestController
@RequestMapping("/pedido")
@AllArgsConstructor
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<Produto> criaPedido(@RequestBody PedidoDto pedidoDto) {
        pedidoService.cadastrarPedido(pedidoDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public void atualizaPedido(@PathVariable Long id, @Validated @RequestBody PedidoDto pedidoDto) throws BadRequestException {
        pedidoService.atualizarPedido(id,pedidoDto);
    }

    @GetMapping
    public List<Pedido> chamaPedidos(){
        List<Pedido> listaPedidos = pedidoService.chamaPedido();
        return listaPedidos;
    }

    @GetMapping("/abertos")
    public List<Pedido> chamaPedidosAbertos() {
        return pedidoService.chamaPedidosAbertos();
    }

    @GetMapping("/finalizados")
    public List<Pedido> chamaPedidosFinalizadosPorData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return pedidoService.chamaPedidosFinalizadosPorData(data);
    }

    @GetMapping("/finalizados/relatorio")
    public ResponseEntity<byte[]> exportarNotasFiscais(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim
    ) throws BadRequestException {
        byte[] relatorio = pedidoService.gerarRelatorioNotasFiscais(inicio, fim);
        String filename = "notas-fiscais_" + inicio + "_a_" + fim + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .body(relatorio);
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<Void> finalizarPedido(
            @PathVariable Long id,
            @RequestBody FinalizarPedidoDto dto
    ) throws BadRequestException {
        pedidoService.finalizarPedido(id, dto == null ? null : dto.formaPagamento());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public void deletarPedido(@PathVariable Long id) throws BadRequestException {
        pedidoService.deletaPedido(id);
    }
}
