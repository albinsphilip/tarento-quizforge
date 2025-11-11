package com.quizforge.config;

import com.quizforge.model.User;
import com.quizforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        System.out.println("🔧 Starting DataSeeder...");
        
        // Get all users
        List<User> users = userRepository.findAll();
        
        if (users.isEmpty()) {
            // If no users exist, create default admin and candidate
            createDefaultUsers();
        } else {
            // Fix passwords for existing users
            fixExistingPasswords(users);
        }
        
        System.out.println("✅ DataSeeder completed!");
    }
    
    private void createDefaultUsers() {
        System.out.println("📝 Creating default users...");
        
        // Create Admin user
        User admin = new User();
        admin.setEmail("admin@quizforge.com");
        admin.setName("Admin User");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        userRepository.save(admin);
        System.out.println("✅ Created admin: admin@quizforge.com / admin123");
        
        // Create Sample Candidate
        User candidate = new User();
        candidate.setEmail("candidate@example.com");
        candidate.setName("John Doe");
        candidate.setPassword(passwordEncoder.encode("candidate123"));
        candidate.setRole(User.Role.CANDIDATE);
        userRepository.save(candidate);
        System.out.println("✅ Created candidate: candidate@example.com / candidate123");
    }
    
    private void fixExistingPasswords(List<User> users) {
        System.out.println("🔐 RESETTING ALL PASSWORDS TO KNOWN VALUES...");
        
        for (User user : users) {
            // Reset password based on role - FORCE UPDATE
            String newPassword;
            
            if (user.getRole() == User.Role.ADMIN) {
                newPassword = "admin123";
            } else {
                newPassword = "candidate123";
            }
            
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            
            System.out.println("✅ Reset password for " + user.getEmail() + 
                             " (" + user.getRole() + ") → password: " + newPassword);
        }
        
        System.out.println("\n📋 LOGIN CREDENTIALS:");
        System.out.println("━".repeat(50));
        for (User user : users) {
            String pwd = user.getRole() == User.Role.ADMIN ? "admin123" : "candidate123";
            System.out.println("Email: " + user.getEmail());
            System.out.println("Password: " + pwd);
            System.out.println("Role: " + user.getRole());
            System.out.println("━".repeat(50));
        }
    }
}
