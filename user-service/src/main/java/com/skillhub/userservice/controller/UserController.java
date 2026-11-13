package com.skillhub.userservice.controller;

import com.skillhub.userservice.model.User;
import com.skillhub.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/api/users/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User created = userService.registerUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("id", created.getId());
            response.put("name", created.getName());
            response.put("email", created.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/api/users/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userService.authenticate(email, password);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("registrationNumber", user.getRegistrationNumber());
            response.put("program", user.getProgram());
            response.put("semester", user.getSemester());
            response.put("institution", user.getInstitution());
            response.put("avatarInitials", user.getAvatarInitials());
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // Profile compatibility endpoints for StudyHub UI
    @GetMapping({"/api/profile", "/api/users/profile"})
    public ResponseEntity<?> getProfile() {
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            User defaultUser = new User(
                "Pritam Dey",
                "pritam@example.com",
                "DemoPass456",
                "RA241100301276",
                "B.Tech Computer Science & Engineering",
                "5th Semester",
                "SRM Institute of Science and Technology"
            );
            return ResponseEntity.ok(userService.saveUser(defaultUser));
        }
        return ResponseEntity.ok(users.get(0));
    }

    @PutMapping({"/api/profile", "/api/users/profile"})
    public ResponseEntity<?> updateProfile(@RequestBody User updated) {
        List<User> users = userService.getAllUsers();
        User target = users.isEmpty() ? new User() : users.get(0);

        if (updated.getName() != null) target.setName(updated.getName());
        if (updated.getFullName() != null) target.setName(updated.getFullName());
        if (updated.getEmail() != null) target.setEmail(updated.getEmail());
        if (updated.getRegistrationNumber() != null) target.setRegistrationNumber(updated.getRegistrationNumber());
        if (updated.getProgram() != null) target.setProgram(updated.getProgram());
        if (updated.getSemester() != null) target.setSemester(updated.getSemester());
        if (updated.getInstitution() != null) target.setInstitution(updated.getInstitution());
        if (updated.getAvatarInitials() != null) target.setAvatarInitials(updated.getAvatarInitials());

        return ResponseEntity.ok(userService.saveUser(target));
    }
}

