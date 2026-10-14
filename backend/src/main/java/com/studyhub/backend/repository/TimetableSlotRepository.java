package com.studyhub.backend.repository;

import com.studyhub.backend.model.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, Long> {
    List<TimetableSlot> findByDayOfWeekIgnoreCase(String dayOfWeek);
}
