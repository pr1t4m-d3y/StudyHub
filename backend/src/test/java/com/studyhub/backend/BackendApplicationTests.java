package com.studyhub.backend;

import com.studyhub.backend.model.Assignment;
import com.studyhub.backend.service.AssignmentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private AssignmentService assignmentService;

    @Test
    void testAssignmentValidationAndDefaultStatus() {
        // Test Case: Adding an assignment without specifying status
        Assignment assignment = new Assignment("OS Memory Management Lab", "Operating Systems", "2026-11-01", "high", null);
        
        Assignment saved = assignmentService.addAssignment(assignment);

        // Assertions verifying Business Rules 1 & 2
        assertNotNull(saved.getId(), "Assignment ID should be generated");
        assertEquals("pending", saved.getStatus(), "Status should default to 'pending'");
    }

    @Test
    void testEmptyTitleRejection() {
        // Test Case: Rejects invalid blank titles
        Assignment invalidAssignment = new Assignment("   ", "Operating Systems", "2026-11-01", "high", "pending");

        assertThrows(IllegalArgumentException.class, () -> {
            assignmentService.addAssignment(invalidAssignment);
        }, "Should throw IllegalArgumentException when title is blank");
    }
}