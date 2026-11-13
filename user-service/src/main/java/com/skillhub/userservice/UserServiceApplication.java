package com.skillhub.userservice;

import com.skillhub.userservice.model.User;
import com.skillhub.userservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner initUsers(UserRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // Aligned with teacher Unit 5 test case
                repository.save(new User(
                    "Priya Sharma",
                    "priya@example.com",
                    "DemoPass456",
                    "RA241100301111",
                    "B.Tech Information Technology",
                    "5th Semester",
                    "SRM Institute of Science and Technology"
                ));

                // Primary user for StudyHub
                repository.save(new User(
                    "Pritam Dey",
                    "pritam@example.com",
                    "DemoPass456",
                    "RA241100301276",
                    "B.Tech Computer Science & Engineering",
                    "5th Semester",
                    "SRM Institute of Science and Technology"
                ));
            }
        };
    }
}

