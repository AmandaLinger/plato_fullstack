package com.plato.platoBack.service;

import com.plato.platoBack.dto.CardapioPublicoResponse;
import com.plato.platoBack.dto.ProdutoPublicoDto;
import com.plato.platoBack.entity.Restaurante;
import com.plato.platoBack.repository.ProdutoRepository;
import com.plato.platoBack.repository.RestauranteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CardapioPublicoService {
    private final RestauranteRepository restauranteRepository;
    private final ProdutoRepository produtoRepository;

    @Transactional(readOnly = true)
    public CardapioPublicoResponse buscar(Long restauranteId) {
        Restaurante restaurante = restauranteRepository.findByIdAndAtivoTrue(restauranteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurante não encontrado"));
        return new CardapioPublicoResponse(
                restaurante.getId(),
                restaurante.getNome(),
                produtoRepository.findAllByRestauranteIdAndAtivoTrueOrderByCategoriaAscNomeAsc(restauranteId)
                        .stream()
                        .map(ProdutoPublicoDto::from)
                        .toList()
        );
    }
}
