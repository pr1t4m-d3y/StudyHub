package com.studyhub.backend.controller;

import com.studyhub.backend.model.TimetableSlot;
import com.studyhub.backend.repository.TimetableSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*")
public class TimetableController {

    @Autowired
    private TimetableSlotRepository timetableSlotRepository;

    @GetMapping
    public List<TimetableSlot> getAllSlots() {
        return timetableSlotRepository.findAll();
    }

    @GetMapping("/day/{day}")
    public List<TimetableSlot> getSlotsByDay(@PathVariable String day) {
        return timetableSlotRepository.findByDayOfWeekIgnoreCase(day);
    }

    @PostMapping
    public TimetableSlot createSlot(@RequestBody TimetableSlot slot) {
        return timetableSlotRepository.save(slot);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimetableSlot> updateSlot(@PathVariable Long id, @RequestBody TimetableSlot updated) {
        return timetableSlotRepository.findById(id).map(slot -> {
            if (updated.getDayOfWeek() != null) slot.setDayOfWeek(updated.getDayOfWeek());
            if (updated.getStartTime() != null) slot.setStartTime(updated.getStartTime());
            if (updated.getEndTime() != null) slot.setEndTime(updated.getEndTime());
            if (updated.getSubjectName() != null) slot.setSubjectName(updated.getSubjectName());
            if (updated.getRoom() != null) slot.setRoom(updated.getRoom());
            if (updated.getType() != null) slot.setType(updated.getType());
            if (updated.getInstructor() != null) slot.setInstructor(updated.getInstructor());
            return ResponseEntity.ok(timetableSlotRepository.save(slot));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        if (!timetableSlotRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        timetableSlotRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
