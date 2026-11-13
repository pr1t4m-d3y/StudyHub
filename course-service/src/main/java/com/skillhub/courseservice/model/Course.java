package com.skillhub.courseservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String category;
    private String duration;

    // StudyHub domain fields
    private String code;
    private String name;
    private int credits;
    private String professorName;
    private String room;
    private String syllabus;

    public Course() {}

    public Course(String title, String category, String duration) {
        this.title = title;
        this.category = category;
        this.duration = duration;
        this.name = title;
    }

    public Course(String code, String name, int credits, String professorName, String room, String syllabus) {
        this.code = code;
        this.name = name;
        this.title = name;
        this.credits = credits;
        this.professorName = professorName;
        this.room = room;
        this.syllabus = syllabus;
        this.category = "Engineering";
        this.duration = "Semester";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title != null ? title : name; }
    public void setTitle(String title) {
        this.title = title;
        if (this.name == null) this.name = title;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name != null ? name : title; }
    public void setName(String name) {
        this.name = name;
        if (this.title == null) this.title = name;
    }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public String getProfessorName() { return professorName; }
    public void setProfessorName(String professorName) { this.professorName = professorName; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getSyllabus() { return syllabus; }
    public void setSyllabus(String syllabus) { this.syllabus = syllabus; }
}

