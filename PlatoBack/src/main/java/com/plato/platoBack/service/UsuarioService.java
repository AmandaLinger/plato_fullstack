package com.plato.platoBack.service;

import com.plato.platoBack.dto.UsuarioDto;
import com.plato.platoBack.entity.Usuario;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import com.plato.platoBack.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@Validated
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void criarUsuario(UsuarioDto usuario) throws BadRequestException {
        Usuario u = usuarioRepository.findByNome(usuario.getNome())
                .orElse(null);

        if(u != null){
            throw new BadRequestException("Nome de usuário já cadastrado no banco");
        }

        usuarioRepository.save(Usuario.builder()
                .nome(usuario.getNome())
                .senha(usuario.getSenha())
                .build()
        );
    }

    @Transactional
    public void atualizarUsuario(Long id,UsuarioDto usuario) throws BadRequestException {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Nenhum usuário encontrado"));

        u.setNome(usuario.getNome());
        u.setSenha(usuario.getSenha());
        usuarioRepository.save(u);
    }

    public List<Usuario> chamaUsuarios() throws BadRequestException {
        List<Usuario> listaUsuarios = usuarioRepository.findAll();

        if(listaUsuarios == null|| listaUsuarios.isEmpty()) {
            throw new BadRequestException("Nenhum usuário encontrado");
        }
        return listaUsuarios;
    }

    @Transactional
    public void deletarUsuario(Long id){
        usuarioRepository.deleteById(id);
    }
}
