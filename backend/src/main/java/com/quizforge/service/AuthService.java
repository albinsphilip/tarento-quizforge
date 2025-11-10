package com.quizforge.service;

import com.quizforge.dto.LoginRequest;
import com.quizforge.dto.LoginResponse;
import com.quizforge.model.User;
import com.quizforge.repository.UserRepository;
import com.quizforge.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        // Dummy authentication logic
        // admin@quizforge.com -> ADMIN role
        // any other email -> CANDIDATE role
        
        User.Role role;
        String name;
        
        if ("admin@quizforge.com".equals(request.email())) {
            role = User.Role.ADMIN;
            name = "Admin User";
        } else {
            role = User.Role.CANDIDATE;
            name = "Candidate User";
        }
        
        String token = jwtUtil.generateToken(request.email(), role.name());
        
        return new LoginResponse(token, request.email(), name, role.name());
    }
}
