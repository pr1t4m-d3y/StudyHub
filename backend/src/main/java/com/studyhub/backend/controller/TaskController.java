package com.studyhub.backend.controller;

import com.studyhub.backend.model.TaskItem;
import com.studyhub.backend.repository.TaskItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskItemRepository taskItemRepository;

    @GetMapping
    public List<TaskItem> getAllTasks() {
        return taskItemRepository.findAll();
    }

    @PostMapping
    public TaskItem createTask(@RequestBody TaskItem task) {
        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Task title is required");
        }
        if (task.getPriority() == null) {
            task.setPriority("medium");
        }
        return taskItemRepository.save(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskItem> updateTask(@PathVariable Long id, @RequestBody TaskItem updated) {
        return taskItemRepository.findById(id).map(task -> {
            if (updated.getTitle() != null) task.setTitle(updated.getTitle());
            if (updated.getTimeBlock() != null) task.setTimeBlock(updated.getTimeBlock());
            if (updated.getPriority() != null) task.setPriority(updated.getPriority());
            task.setCompleted(updated.isCompleted());
            return ResponseEntity.ok(taskItemRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskItem> toggleTask(@PathVariable Long id) {
        return taskItemRepository.findById(id).map(task -> {
            task.setCompleted(!task.isCompleted());
            return ResponseEntity.ok(taskItemRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskItemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
