package com.studyhub.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String subjectName;
    private int attendedClasses;
    private int totalClasses;
    private double percentage;
    private int targetPercentage; // Usually 75%
    private String status; // 'Safe', 'Warning', 'Critical'

    public AttendanceRecord() {
        this.targetPercentage = 75;
    }

    public AttendanceRecord(String subjectName, int attendedClasses, int totalClasses) {
        this.subjectName = subjectName;
        this.attendedClasses = attendedClasses;
        this.totalClasses = totalClasses;
        this.targetPercentage = 75;
        recalculate();
    }

    public void recalculate() {
        if (totalClasses <= 0) {
            this.percentage = 100.0;
        } else {
            this.percentage = Math.round(((double) attendedClasses / totalClasses) * 1000.0) / 10.0;
        }

        if (this.percentage >= targetPercentage) {
            this.status = "Safe";
        } else if (this.percentage >= targetPercentage - 10) {
            this.status = "Warning";
        } else {
            this.status = "Critical";
        }
    }

    public void markAttendance(boolean present) {
        this.totalClasses += 1;
        if (present) {
            this.attendedClasses += 1;
        }
        recalculate();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public int getAttendedClasses() { return attendedClasses; }
    public void setAttendedClasses(int attendedClasses) {
        this.attendedClasses = attendedClasses;
        recalculate();
    }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) {
        this.totalClasses = totalClasses;
        recalculate();
    }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public int getTargetPercentage() { return targetPercentage; }
    public void setTargetPercentage(int targetPercentage) {
        this.targetPercentage = targetPercentage;
        recalculate();
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
