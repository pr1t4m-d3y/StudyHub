package com.skillhub.courseservice.controller;

import com.skillhub.courseservice.model.Course;
import com.skillhub.courseservice.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping({"/api/courses", "/api/subjects"})
    public List<Course> getCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping({"/api/courses/{id}", "/api/subjects/{id}"})
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping({"/api/courses", "/api/subjects"})
    public Course createCourse(@RequestBody Course course) {
        return courseService.saveCourse(course);
    }

    @PutMapping({"/api/courses/{id}", "/api/subjects/{id}"})
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course updated) {
        return courseService.getCourseById(id).map(existing -> {
            if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
            if (updated.getName() != null) existing.setName(updated.getName());
            if (updated.getCode() != null) existing.setCode(updated.getCode());
            if (updated.getCredits() > 0) existing.setCredits(updated.getCredits());
            if (updated.getProfessorName() != null) existing.setProfessorName(updated.getProfessorName());
            if (updated.getRoom() != null) existing.setRoom(updated.getRoom());
            if (updated.getSyllabus() != null) existing.setSyllabus(updated.getSyllabus());
            if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
            if (updated.getDuration() != null) existing.setDuration(updated.getDuration());
            return ResponseEntity.ok(courseService.saveCourse(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping({"/api/courses/{id}", "/api/subjects/{id}"})
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}

