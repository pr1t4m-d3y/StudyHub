package com.studyhub.backend.controller;

import com.studyhub.backend.model.AcademicRecord;
import com.studyhub.backend.repository.AcademicRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = "*")
public class AcademicRecordController {

    @Autowired
    private AcademicRecordRepository academicRecordRepository;

    @GetMapping
    public List<AcademicRecord> getAllRecords() {
        return academicRecordRepository.findAll();
    }

    @GetMapping("/summary")
    public Map<String, Object> getAcademicSummary() {
        List<AcademicRecord> records = academicRecordRepository.findAll();
        int totalCredits = 0;
        double totalWeightedPoints = 0;

        for (AcademicRecord r : records) {
            totalCredits += r.getCredits();
            totalWeightedPoints += (r.getCredits() * r.getGradePoints());
        }

        double gpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits) : 0.0;
        double roundedGpa = Math.round(gpa * 100.0) / 100.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCredits", totalCredits);
        summary.put("sgpa", roundedGpa);
        summary.put("cgpa", roundedGpa);
        summary.put("totalCourses", records.size());
        return summary;
    }

    @PostMapping
    public AcademicRecord createRecord(@RequestBody AcademicRecord record) {
        record.calculateGrade();
        return academicRecordRepository.save(record);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicRecord> updateRecord(@PathVariable Long id, @RequestBody AcademicRecord updated) {
        return academicRecordRepository.findById(id).map(rec -> {
            if (updated.getCourseName() != null) rec.setCourseName(updated.getCourseName());
            if (updated.getCourseCode() != null) rec.setCourseCode(updated.getCourseCode());
            if (updated.getSemester() > 0) rec.setSemester(updated.getSemester());
            if (updated.getCredits() > 0) rec.setCredits(updated.getCredits());
            rec.setInternalMarks(updated.getInternalMarks());
            rec.setExternalMarks(updated.getExternalMarks());
            rec.calculateGrade();
            return ResponseEntity.ok(academicRecordRepository.save(rec));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        if (!academicRecordRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        academicRecordRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
