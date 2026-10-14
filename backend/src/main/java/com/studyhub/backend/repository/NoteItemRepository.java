package com.studyhub.backend.repository;

import com.studyhub.backend.model.NoteItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteItemRepository extends JpaRepository<NoteItem, Long> {
    List<NoteItem> findBySubjectIgnoreCase(String subject);
}
