package com.plato.platoBack.service;

import com.plato.platoBack.dto.FuncionarioDto;
import com.plato.platoBack.entity.Funcionario;
import com.plato.platoBack.dto.UsuarioDto;
import com.plato.platoBack.repository.FuncionarioRepository;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Validated
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private RestauranteContextService restauranteContext;

    @Autowired
    private UsuarioService usuarioService;

    public List<Funcionario> chamaTodosFuncionarios(){
        return funcionarioRepository.findAllByRestauranteIdAndAtivoTrue(restauranteContext.getId());
    }

    public Funcionario chamaFuncionario(Long id) throws BadRequestException {
        return buscarAtivo(id);
    }

    @Transactional
    public Funcionario cadastrarFuncionario(FuncionarioDto funcionarioDto) throws BadRequestException {
        validarAcesso(funcionarioDto);
        usuarioService.criarUsuario(new UsuarioDto(
                funcionarioDto.getNome(),
                funcionarioDto.getSenha(),
                funcionarioDto.getAcesso()
        ));
        Funcionario funcionario = new Funcionario();
        funcionario.setNome(funcionarioDto.getNome());
        funcionario.setTelefone(funcionarioDto.getTelefone());
        funcionario.setCargo(funcionarioDto.getCargo());
        funcionario.setAcesso(funcionarioDto.getAcesso());
        funcionario.setAtivo(true);
        funcionario.setRestaurante(restauranteContext.getRestaurante());

        return funcionarioRepository.save(funcionario);
    }

    @Transactional
    public void deletarFuncionario(Long id) throws BadRequestException {
        Funcionario funcionario = buscarAtivo(id);
        funcionario.setAtivo(false);
        funcionarioRepository.save(funcionario);
    }

    @Transactional
    public void atualizaFuncionario(Long id, FuncionarioDto funcionarioDto) throws BadRequestException {
        validarAcesso(funcionarioDto);
        Funcionario funcionario = buscarAtivo(id);

        funcionario.setNome(funcionarioDto.getNome());
        funcionario.setTelefone(funcionarioDto.getTelefone());
        funcionario.setCargo(funcionarioDto.getCargo());
        funcionario.setAcesso(funcionarioDto.getAcesso());

        funcionarioRepository.save(funcionario);
    }

    private Funcionario buscarAtivo(Long id) {
        return funcionarioRepository.findByIdAndRestauranteIdAndAtivoTrue(id, restauranteContext.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Nenhum funcionário encontrado"
                ));
    }

    private void validarAcesso(FuncionarioDto dto) {
        if (dto.getAcesso() == null || dto.getAcesso() == com.plato.platoBack.enuns.NivelAcesso.ROOT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Acesso deve ser GERENTE, ATENDENTE ou CAIXA");
        }
    }
}
