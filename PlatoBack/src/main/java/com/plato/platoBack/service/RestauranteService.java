package com.plato.platoBack.service;

import com.plato.platoBack.dto.RestauranteDto;
import com.plato.platoBack.entity.Restaurante;
import com.plato.platoBack.repository.RestauranteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestauranteService {
    private final RestauranteRepository restauranteRepository;

    @Transactional(readOnly = true)
    public List<Restaurante> listarAtivos() {
        return restauranteRepository.findAllByAtivoTrueOrderByNomeAsc();
    }

    @Transactional
    public Restaurante cadastrarRestaurante(RestauranteDto restauranteDto) {
        String nome = validarNome(restauranteDto);
        if (restauranteRepository.existsByNomeIgnoreCaseAndAtivoTrue(nome)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Restaurante já cadastrado");
        }

        return restauranteRepository.save(Restaurante.builder()
                .nome(nome)
                .ativo(true)
                .build());
    }

    @Transactional
    public void inativarRestaurante(Long id) {
        Restaurante restaurante = restauranteRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Restaurante não encontrado"
                ));

        restaurante.setAtivo(false);
        restauranteRepository.save(restaurante);
    }

    private String validarNome(RestauranteDto restauranteDto) {
        if (restauranteDto == null || restauranteDto.getNome() == null
                || restauranteDto.getNome().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome do restaurante é obrigatório");
        }

        String nome = restauranteDto.getNome().trim();
        if (nome.length() > 120) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nome do restaurante deve ter no máximo 120 caracteres"
            );
        }
        return nome;
    }
}
