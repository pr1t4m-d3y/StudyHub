package com.studyhub.backend.controller;

import com.studyhub.backend.model.NoteItem;
import com.studyhub.backend.repository.NoteItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {

    @Autowired
    private NoteItemRepository noteItemRepository;

    @GetMapping
    public List<NoteItem> getAllNotes() {
        return noteItemRepository.findAll();
    }

    @PostMapping
    public NoteItem createNote(@RequestBody NoteItem note) {
        if (note.getIcon() == null || note.getIcon().isEmpty()) {
            note.setIcon("fa-file-lines");
        }
        if (note.getDateFormatted() == null || note.getDateFormatted().isEmpty()) {
            note.setDateFormatted("Just now");
        }
        return noteItemRepository.save(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteItem> updateNote(@PathVariable Long id, @RequestBody NoteItem updated) {
        return noteItemRepository.findById(id).map(note -> {
            if (updated.getTitle() != null) note.setTitle(updated.getTitle());
            if (updated.getSubject() != null) note.setSubject(updated.getSubject());
            if (updated.getContent() != null) note.setContent(updated.getContent());
            if (updated.getIcon() != null) note.setIcon(updated.getIcon());
            note.setDateFormatted("Updated recently");
            return ResponseEntity.ok(noteItemRepository.save(note));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        if (!noteItemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        noteItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
