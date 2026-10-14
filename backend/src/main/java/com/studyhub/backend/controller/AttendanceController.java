package com.studyhub.backend.controller;

import com.studyhub.backend.model.AttendanceRecord;
import com.studyhub.backend.repository.AttendanceRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    @GetMapping
    public List<AttendanceRecord> getAllRecords() {
        return attendanceRecordRepository.findAll();
    }

    @GetMapping("/summary")
    public Map<String, Object> getAttendanceSummary() {
        List<AttendanceRecord> records = attendanceRecordRepository.findAll();
        int totalAttended = 0;
        int totalClasses = 0;

        for (AttendanceRecord r : records) {
            totalAttended += r.getAttendedClasses();
            totalClasses += r.getTotalClasses();
        }

        double overallPct = totalClasses > 0 ? (double) totalAttended / totalClasses * 100.0 : 100.0;
        double roundedPct = Math.round(overallPct * 10.0) / 10.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("overallPercentage", roundedPct);
        summary.put("totalAttended", totalAttended);
        summary.put("totalClasses", totalClasses);
        summary.put("status", roundedPct >= 75.0 ? "Safe" : "Warning");
        return summary;
    }

    @PostMapping
    public AttendanceRecord createRecord(@RequestBody AttendanceRecord record) {
        record.recalculate();
        return attendanceRecordRepository.save(record);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceRecord> updateRecord(@PathVariable Long id, @RequestBody AttendanceRecord updated) {
        return attendanceRecordRepository.findById(id).map(existing -> {
            if (updated.getSubjectName() != null) existing.setSubjectName(updated.getSubjectName());
            existing.setAttendedClasses(updated.getAttendedClasses());
            existing.setTotalClasses(updated.getTotalClasses());
            if (updated.getTargetPercentage() > 0) existing.setTargetPercentage(updated.getTargetPercentage());
            existing.recalculate();
            return ResponseEntity.ok(attendanceRecordRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/mark")
    public ResponseEntity<AttendanceRecord> markAttendance(@PathVariable Long id, @RequestParam boolean present) {
        return attendanceRecordRepository.findById(id).map(record -> {
            record.markAttendance(present);
            return ResponseEntity.ok(attendanceRecordRepository.save(record));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        if (!attendanceRecordRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        attendanceRecordRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
