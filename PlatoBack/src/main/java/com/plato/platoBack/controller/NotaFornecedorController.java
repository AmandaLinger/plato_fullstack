package com.plato.platoBack.controller;

import com.plato.platoBack.dto.NotaFornecedorDto;
import com.plato.platoBack.service.NotaFornecedorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/notas-fornecedores")
@RequiredArgsConstructor
public class NotaFornecedorController {
    private final NotaFornecedorService notaFornecedorService;

    @GetMapping
    public ResponseEntity<List<NotaFornecedorDto>> listar() {
        return ResponseEntity.ok(notaFornecedorService.listar());
    }

    @GetMapping("/relatorio")
    public ResponseEntity<byte[]> exportar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim
    ) {
        byte[] relatorio = notaFornecedorService.gerarRelatorio(inicio, fim);
        String filename = "notas-fornecedores_" + inicio + "_a_" + fim + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .body(relatorio);
    }

    @PostMapping
    public ResponseEntity<NotaFornecedorDto> criar(@RequestBody NotaFornecedorDto dto) {
        NotaFornecedorDto criada = notaFornecedorService.criar(dto);
        return ResponseEntity.created(URI.create("/api/notas-fornecedores/" + criada.getId()))
                .body(criada);
    }
}
