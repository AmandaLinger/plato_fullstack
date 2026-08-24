package com.plato.platoBack;

import com.plato.platoBack.entity.Usuario;
import com.plato.platoBack.enuns.NivelAcesso;
import com.plato.platoBack.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.core.annotation.Order;

@Component
@Order(2)
@RequiredArgsConstructor
public class RootUserInitializer implements ApplicationRunner {
    private final UsuarioRepository usuarioRepository;

    @Value("${app.root.username:root}")
    private String username;

    @Value("${app.root.password:change-root-password}")
    private String password;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (usuarioRepository.findByNomeAndRestauranteIsNullAndAtivoTrue(username).isPresent()) return;
        usuarioRepository.save(Usuario.builder()
                .nome(username)
                .senha(new BCryptPasswordEncoder(12).encode(password))
                .acesso(NivelAcesso.ROOT)
                .ativo(true)
                .restaurante(null)
                .build());
    }
}
