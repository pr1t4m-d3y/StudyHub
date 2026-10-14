package com.studyhub.backend.controller;

import com.studyhub.backend.model.UserProfile;
import com.studyhub.backend.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @GetMapping
    public ResponseEntity<UserProfile> getProfile() {
        List<UserProfile> profiles = userProfileRepository.findAll();
        if (profiles.isEmpty()) {
            UserProfile defaultProfile = new UserProfile("Pritam Dey", "pritam@example.com", "RA241100301276", "B.Tech Computer Science & Engineering", "5th Semester", "SRM Institute of Science and Technology", "PD");
            return ResponseEntity.ok(userProfileRepository.save(defaultProfile));
        }
        return ResponseEntity.ok(profiles.get(0));
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UserProfile updated) {
        List<UserProfile> profiles = userProfileRepository.findAll();
        UserProfile target;
        if (profiles.isEmpty()) {
            target = new UserProfile();
        } else {
            target = profiles.get(0);
        }

        if (updated.getFullName() != null) target.setFullName(updated.getFullName());
        if (updated.getEmail() != null) target.setEmail(updated.getEmail());
        if (updated.getRegistrationNumber() != null) target.setRegistrationNumber(updated.getRegistrationNumber());
        if (updated.getProgram() != null) target.setProgram(updated.getProgram());
        if (updated.getSemester() != null) target.setSemester(updated.getSemester());
        if (updated.getInstitution() != null) target.setInstitution(updated.getInstitution());
        if (updated.getAvatarInitials() != null) target.setAvatarInitials(updated.getAvatarInitials());

        return ResponseEntity.ok(userProfileRepository.save(target));
    }
}
