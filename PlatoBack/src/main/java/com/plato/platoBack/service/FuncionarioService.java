package com.plato.platoBack.service;

import com.plato.platoBack.dto.FuncionarioDto;
import com.plato.platoBack.entity.Funcionario;
import com.plato.platoBack.repository.FuncionarioRepository;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
@Validated
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public List<Funcionario> chamaTodosFuncionarios(){
        return funcionarioRepository.findAll();
    }

    public Funcionario chamaFuncionario(Long id) throws BadRequestException {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow( () -> new BadRequestException("Nenhum funcionário encontrado")) ;

        return funcionario;
    }

    public Funcionario cadastrarFuncionario(FuncionarioDto funcionarioDto){
        Funcionario funcionario = new Funcionario();
        funcionario.setNome(funcionarioDto.getNome());
        funcionario.setTelefone(funcionarioDto.getTelefone());
        funcionario.setCargo(funcionarioDto.getCargo());

        return funcionarioRepository.save(funcionario);
    }

    @Transactional
    public void deletarFuncionario(Long id) throws BadRequestException {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(()-> new BadRequestException("Nenhum funcionário encontrado"));

        funcionarioRepository.delete(funcionario);
    }

    @Transactional
    public void atualizaFuncionario(Long id, FuncionarioDto funcionarioDto) throws BadRequestException {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Nenhum funcionário encontrado"));

        funcionario.setNome(funcionarioDto.getNome());
        funcionario.setTelefone(funcionarioDto.getTelefone());
        funcionario.setCargo(funcionarioDto.getCargo());

        funcionarioRepository.save(funcionario);
    }
}
