package com.skillhub.userservice.service;

import com.skillhub.userservice.model.User;
import com.skillhub.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword() != null && userOpt.get().getPassword().equals(password)) {
            return userOpt;
        }
        return Optional.empty();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}

