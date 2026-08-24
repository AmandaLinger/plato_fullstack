package com.plato.platoBack.service;

import com.plato.platoBack.entity.Restaurante;
import com.plato.platoBack.repository.RestauranteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RestauranteContextService {
    private final RestauranteRepository restauranteRepository;

    public Long getId() {
        Long id = RestauranteContext.get();
        if (id == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Restaurante não autenticado");
        return id;
    }

    public Restaurante getRestaurante() {
        return restauranteRepository.findByIdAndAtivoTrue(getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Restaurante inválido ou inativo"));
    }
}
