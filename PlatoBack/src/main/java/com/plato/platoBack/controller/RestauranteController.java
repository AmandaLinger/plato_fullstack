package com.plato.platoBack.controller;

import com.plato.platoBack.dto.RestauranteDto;
import com.plato.platoBack.dto.PrimeiroGerenteDto;
import com.plato.platoBack.dto.AtualizarSenhaGerenteDto;
import com.plato.platoBack.entity.Usuario;
import com.plato.platoBack.entity.Restaurante;
import com.plato.platoBack.service.RestauranteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/restaurantes")
public class RestauranteController {
    private final RestauranteService restauranteService;

    @GetMapping
    public ResponseEntity<List<Restaurante>> listarAtivos() {
        return ResponseEntity.ok(restauranteService.listarAtivos());
    }

    @GetMapping("/sem-gerente")
    public ResponseEntity<List<Restaurante>> listarAtivosSemGerente() {
        return ResponseEntity.ok(restauranteService.listarAtivosSemGerente());
    }

    @PostMapping
    public ResponseEntity<Restaurante> criarRestaurante(@RequestBody RestauranteDto restauranteDto) {
        Restaurante restaurante = restauranteService.cadastrarRestaurante(restauranteDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurante);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void inativarRestaurante(@PathVariable Long id) {
        restauranteService.inativarRestaurante(id);
    }

    @PostMapping("/{id}/primeiro-gerente")
    public ResponseEntity<Usuario> criarPrimeiroGerente(
            @PathVariable Long id,
            @RequestBody PrimeiroGerenteDto dto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restauranteService.criarPrimeiroGerente(id, dto));
    }

    @PatchMapping("/{id}/gerente/senha")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarSenhaGerente(
            @PathVariable Long id,
            @RequestBody AtualizarSenhaGerenteDto dto
    ) {
        restauranteService.atualizarSenhaGerente(id, dto);
    }
}
