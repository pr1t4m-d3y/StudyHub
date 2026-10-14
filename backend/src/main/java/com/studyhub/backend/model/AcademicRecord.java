package com.studyhub.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class AcademicRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int semester;
    private String courseCode;
    private String courseName;
    private int credits;
    private int internalMarks; // out of 50
    private int externalMarks; // out of 50
    private int totalMarks;    // out of 100
    private String grade;      // O, A+, A, B+, B, C, F
    private double gradePoints; // 10.0, 9.0, 8.0, etc.

    public AcademicRecord() {}

    public AcademicRecord(int semester, String courseCode, String courseName, int credits, int internalMarks, int externalMarks) {
        this.semester = semester;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.credits = credits;
        this.internalMarks = internalMarks;
        this.externalMarks = externalMarks;
        this.totalMarks = internalMarks + externalMarks;
        calculateGrade();
    }

    public void calculateGrade() {
        this.totalMarks = this.internalMarks + this.externalMarks;
        if (totalMarks >= 90) {
            this.grade = "O";
            this.gradePoints = 10.0;
        } else if (totalMarks >= 80) {
            this.grade = "A+";
            this.gradePoints = 9.0;
        } else if (totalMarks >= 70) {
            this.grade = "A";
            this.gradePoints = 8.0;
        } else if (totalMarks >= 60) {
            this.grade = "B+";
            this.gradePoints = 7.0;
        } else if (totalMarks >= 50) {
            this.grade = "B";
            this.gradePoints = 6.0;
        } else if (totalMarks >= 40) {
            this.grade = "C";
            this.gradePoints = 5.0;
        } else {
            this.grade = "F";
            this.gradePoints = 0.0;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public int getInternalMarks() { return internalMarks; }
    public void setInternalMarks(int internalMarks) {
        this.internalMarks = internalMarks;
        calculateGrade();
    }

    public int getExternalMarks() { return externalMarks; }
    public void setExternalMarks(int externalMarks) {
        this.externalMarks = externalMarks;
        calculateGrade();
    }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public double getGradePoints() { return gradePoints; }
    public void setGradePoints(double gradePoints) { this.gradePoints = gradePoints; }
}
