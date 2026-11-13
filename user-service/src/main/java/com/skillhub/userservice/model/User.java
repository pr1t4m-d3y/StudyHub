package com.skillhub.userservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    // Extended profile fields for StudyHub
    private String registrationNumber;
    private String program;
    private String semester;
    private String institution;
    private String avatarInitials;

    public User() {}

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatarInitials = generateInitials(name);
    }

    public User(String name, String email, String password, String registrationNumber, String program, String semester, String institution) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.registrationNumber = registrationNumber;
        this.program = program;
        this.semester = semester;
        this.institution = institution;
        this.avatarInitials = generateInitials(name);
    }

    private String generateInitials(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) return "SH";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        return ("" + parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFullName() { return name; }
    public void setFullName(String fullName) { this.name = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getAvatarInitials() { return avatarInitials != null ? avatarInitials : generateInitials(name); }
    public void setAvatarInitials(String avatarInitials) { this.avatarInitials = avatarInitials; }
}

