package com.studyhub.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TaskItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String timeBlock;
    private String priority; // high, medium, low
    private boolean completed;

    public TaskItem() {}

    public TaskItem(String title, String timeBlock, String priority, boolean completed) {
        this.title = title;
        this.timeBlock = timeBlock;
        this.priority = priority;
        this.completed = completed;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTimeBlock() { return timeBlock; }
    public void setTimeBlock(String timeBlock) { this.timeBlock = timeBlock; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
