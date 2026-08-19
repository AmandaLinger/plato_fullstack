package com.plato.platoBack.service;

import com.plato.platoBack.dto.UsuarioDto;
import com.plato.platoBack.entity.Usuario;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import com.plato.platoBack.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@Validated
public class UsuarioService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

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
                .senha(encodeSenha(usuario.getSenha()))
                .build()
        );
    }

    @Transactional
    public void atualizarUsuario(Long id,UsuarioDto usuario) throws BadRequestException {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Nenhum usuário encontrado"));

        if (usuarioRepository.existsByNomeAndIdNot(usuario.getNome(), id)) {
            throw new BadRequestException("Nome de usuário já cadastrado no banco");
        }

        u.setNome(usuario.getNome());
        if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) {
            u.setSenha(encodeSenha(usuario.getSenha()));
        }
        usuarioRepository.save(u);
    }

    public Usuario autenticar(String nome, String senha) throws BadRequestException {
        Usuario usuario = usuarioRepository.findByNome(nome)
                .orElseThrow(() -> new BadRequestException("Login ou senha inválidos"));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new BadRequestException("Login ou senha inválidos");
        }

        return usuario;
    }

    public Usuario buscarPorId(Long id) throws BadRequestException {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Nenhum usuário encontrado"));
    }

    private String encodeSenha(String senha) throws BadRequestException {
        if (senha == null || senha.length() < 8 || senha.length() > 72) {
            throw new BadRequestException("A senha deve ter entre 8 e 72 caracteres");
        }
        return passwordEncoder.encode(senha);
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
