package com.studyhub.backend.service;

import com.studyhub.backend.model.Assignment;
import com.studyhub.backend.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }

    public Assignment addAssignment(Assignment assignment) {
        if (assignment.getTitle() == null || assignment.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Assignment title cannot be empty");
        }
        if (assignment.getStatus() == null || assignment.getStatus().trim().isEmpty()) {
            assignment.setStatus("pending");
        }
        if (assignment.getPriority() == null || assignment.getPriority().trim().isEmpty()) {
            assignment.setPriority("medium");
        }
        return assignmentRepository.save(assignment);
    }

    public Assignment updateAssignment(Long id, Assignment updated) {
        return assignmentRepository.findById(id).map(existing -> {
            if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
            if (updated.getSubject() != null) existing.setSubject(updated.getSubject());
            if (updated.getDueDate() != null) existing.setDueDate(updated.getDueDate());
            if (updated.getPriority() != null) existing.setPriority(updated.getPriority());
            if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
            if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
            return assignmentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Assignment not found with id: " + id));
    }

    public Assignment updateStatus(Long id, String status) {
        return assignmentRepository.findById(id).map(existing -> {
            existing.setStatus(status);
            return assignmentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Assignment not found with id: " + id));
    }

    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
}