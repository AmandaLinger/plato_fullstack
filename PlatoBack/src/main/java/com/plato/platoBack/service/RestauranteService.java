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
import com.plato.platoBack.dto.PrimeiroGerenteDto;
import com.plato.platoBack.dto.AtualizarSenhaGerenteDto;
import com.plato.platoBack.dto.GerenteResponse;
import com.plato.platoBack.entity.Usuario;
import com.plato.platoBack.repository.UsuarioRepository;
import com.plato.platoBack.enuns.NivelAcesso;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
@RequiredArgsConstructor
public class RestauranteService {
    private final RestauranteRepository restauranteRepository;
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @Transactional(readOnly = true)
    public List<Restaurante> listarAtivos() {
        return restauranteRepository.findAllByAtivoTrueOrderByNomeAsc();
    }

    @Transactional(readOnly = true)
    public List<Restaurante> listarAtivosSemGerente() {
        exigirRoot();
        return restauranteRepository.findAllByAtivoTrueOrderByNomeAsc().stream()
                .filter(restaurante -> !usuarioRepository.existsByRestauranteIdAndAcessoAndAtivoTrue(
                        restaurante.getId(), NivelAcesso.GERENTE))
                .toList();
    }

    @Transactional
    public Restaurante cadastrarRestaurante(RestauranteDto restauranteDto) {
        exigirRoot();
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
        exigirRoot();
        Restaurante restaurante = restauranteRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Restaurante não encontrado"
                ));

        restaurante.setAtivo(false);
        restauranteRepository.save(restaurante);
    }

    @Transactional
    public Usuario criarPrimeiroGerente(Long restauranteId, PrimeiroGerenteDto dto) {
        exigirRoot();
        Restaurante restaurante = restauranteRepository.findByIdAndAtivoTrue(restauranteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurante não encontrado"));
        if (usuarioRepository.existsByRestauranteIdAndAcessoAndAtivoTrue(restauranteId, NivelAcesso.GERENTE)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "O restaurante já possui um gerente");
        }
        if (dto == null || dto.nome() == null || dto.nome().isBlank()
                || dto.senha() == null || dto.senha().length() < 8 || dto.senha().length() > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome e senha de 8 a 72 caracteres são obrigatórios");
        }
        if (usuarioRepository.findByNomeAndRestauranteIdAndAtivoTrue(dto.nome().trim(), restauranteId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nome de usuário já cadastrado no restaurante");
        }
        return usuarioRepository.save(Usuario.builder()
                .nome(dto.nome().trim())
                .senha(passwordEncoder.encode(dto.senha()))
                .acesso(NivelAcesso.GERENTE)
                .ativo(true)
                .restaurante(restaurante)
                .build());
    }

    @Transactional(readOnly = true)
    public List<GerenteResponse> listarGerentes(Long restauranteId) {
        exigirRoot();
        if (restauranteRepository.findByIdAndAtivoTrue(restauranteId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurante não encontrado");
        }
        return usuarioRepository
                .findAllByRestauranteIdAndAcessoAndAtivoTrueOrderByNomeAsc(restauranteId, NivelAcesso.GERENTE)
                .stream()
                .map(GerenteResponse::from)
                .toList();
    }

    @Transactional
    public void atualizarSenhaGerente(Long restauranteId, Long gerenteId, AtualizarSenhaGerenteDto dto) {
        exigirRoot();
        if (dto == null || dto.novaSenha() == null
                || dto.novaSenha().length() < 8 || dto.novaSenha().length() > 72) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A nova senha deve ter entre 8 e 72 caracteres"
            );
        }
        if (restauranteRepository.findByIdAndAtivoTrue(restauranteId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurante não encontrado");
        }
        Usuario gerente = usuarioRepository.findByIdAndRestauranteIdAndAtivoTrue(gerenteId, restauranteId)
                .filter(usuario -> usuario.getAcesso() == NivelAcesso.GERENTE)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Gerente não encontrado neste restaurante"
                ));
        gerente.setSenha(passwordEncoder.encode(dto.novaSenha()));
        usuarioRepository.save(gerente);
    }

    private void exigirRoot() {
        if (AcessoContext.get() != NivelAcesso.ROOT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso exclusivo do usuário Root");
        }
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
