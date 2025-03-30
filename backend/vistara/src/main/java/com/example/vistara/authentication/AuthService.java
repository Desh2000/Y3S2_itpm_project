package com.example.vistara.authentication;

import com.example.vistara.config.JWTService;
import com.example.vistara.role.Role;
import com.example.vistara.user.User;
import com.example.vistara.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegRequest req) {
        User newUser = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(Role.USER)
                .build();

        userRepository.save(newUser);

        return AuthResponse.builder()
                .token(jwtService.generateToken(newUser))
                .build();
    }

    public AuthResponse auth(AuthRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()
                )
        );

        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();

        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .build();
    }
}
