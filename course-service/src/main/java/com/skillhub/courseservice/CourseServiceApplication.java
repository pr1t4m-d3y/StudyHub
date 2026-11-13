package com.skillhub.courseservice;

import com.skillhub.courseservice.model.Course;
import com.skillhub.courseservice.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CourseServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CourseServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner initCourses(CourseRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // Initial courses aligned with teacher doc
                repository.save(new Course("Full Stack Web Development", "Web Development", "12 Weeks"));
                repository.save(new Course("Artificial Intelligence", "AI", "10 Weeks"));
                repository.save(new Course("Data Science Fundamentals", "Data Science", "8 Weeks"));

                // Core StudyHub courses for rich functionality
                repository.save(new Course("CS301", "Database Management Systems", 4, "Dr. Rajesh Sharma", "Tech Park 401", "Relational algebra, SQL, Normalization, Concurrency"));
                repository.save(new Course("CS302", "Operating Systems", 3, "Prof. Ananya Sen", "Tech Park 202", "Process synchronization, Deadlocks, Memory paging"));
                repository.save(new Course("CS303", "Computer Networks", 4, "Dr. K. V. Raman", "UB 603", "OSI & TCP/IP stacks, Routing protocols, Transport layer"));
                repository.save(new Course("CS304", "Design and Analysis of Algorithms", 4, "Prof. Vikram Malhotra", "Tech Park 305", "Dynamic programming, Greedy heuristics, Graph traversal"));
            }
        };
    }
}

