package com.studyhub.backend;

import com.studyhub.backend.model.*;
import com.studyhub.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final AssignmentRepository assignmentRepository;
    private final SubjectRepository subjectRepository;
    private final TimetableSlotRepository timetableRepository;
    private final AcademicRecordRepository academicRecordRepository;
    private final AttendanceRecordRepository attendanceRepository;
    private final TaskItemRepository taskRepository;
    private final NoteItemRepository noteRepository;
    private final UserProfileRepository profileRepository;

    public DataLoader(
            AssignmentRepository assignmentRepository,
            SubjectRepository subjectRepository,
            TimetableSlotRepository timetableRepository,
            AcademicRecordRepository academicRecordRepository,
            AttendanceRecordRepository attendanceRepository,
            TaskItemRepository taskRepository,
            NoteItemRepository noteRepository,
            UserProfileRepository profileRepository) {
        this.assignmentRepository = assignmentRepository;
        this.subjectRepository = subjectRepository;
        this.timetableRepository = timetableRepository;
        this.academicRecordRepository = academicRecordRepository;
        this.attendanceRepository = attendanceRepository;
        this.taskRepository = taskRepository;
        this.noteRepository = noteRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Subjects
        if (subjectRepository.count() == 0) {
            subjectRepository.save(new Subject("CS301", "Operating Systems", 4, "Dr. K. Sharma", "Tech Park 402", "Process synchronization, Semaphores, CPU scheduling, Paging, Virtual Memory, Deadlocks"));
            subjectRepository.save(new Subject("CS302", "Data Structures & Algorithms", 4, "Prof. Ananya Sen", "UB 601", "Graph algorithms, Dynamic Programming, Trees, Heaps, Amortized analysis"));
            subjectRepository.save(new Subject("CS303", "Database Management Systems", 4, "Dr. Rajesh Raman", "Tech Park 204", "Relational Algebra, SQL, Normalization 1NF-BCNF, Transactions, Concurrency & ACID"));
            subjectRepository.save(new Subject("CS304", "Computer Networks", 3, "Prof. Meera Nair", "UB 305", "OSI & TCP/IP layers, Routing algorithms, Congestion control, DNS, HTTP/3, Sockets"));
            subjectRepository.save(new Subject("CS305", "Software Engineering", 3, "Dr. Vikram Joshi", "Tech Park 505", "Agile Scrum, System Design, CI/CD pipelines, Design Patterns, Software Testing"));
        }

        // 2. Seed Assignments
        if (assignmentRepository.count() == 0) {
            assignmentRepository.save(new Assignment("OS Memory Management Simulation", "Operating Systems", "2026-10-28", "high", "pending", "Implement page replacement algorithms (FIFO, LRU, Optimal) in C/C++."));
            assignmentRepository.save(new Assignment("DBMS Normalization Case Study", "Database Management Systems", "2026-11-02", "medium", "pending", "Decompose the unnormalized hospital database up to BCNF and write SQL schemas."));
            assignmentRepository.save(new Assignment("Dijkstra & Prim's Visualizer", "Data Structures & Algorithms", "2026-10-18", "high", "pending", "Build interactive graph visualization demonstrating shortest path calculation."));
            assignmentRepository.save(new Assignment("Packet Sniffer with Scapy", "Computer Networks", "2026-10-10", "medium", "OVERDUE", "Capture and analyze live TCP/UDP traffic and plot protocol distributions."));
            assignmentRepository.save(new Assignment("Agile Sprint Backlog & Jira Board", "Software Engineering", "2026-09-30", "low", "submitted", "Create user stories, acceptance criteria, and burn-down charts for project alpha."));
        }

        // 3. Seed Timetable
        if (timetableRepository.count() == 0) {
            // Monday
            timetableRepository.save(new TimetableSlot("Monday", "09:00 AM", "10:00 AM", "Operating Systems", "TP 402", "Lecture", "Dr. K. Sharma"));
            timetableRepository.save(new TimetableSlot("Monday", "10:15 AM", "11:15 AM", "Data Structures & Algorithms", "UB 601", "Lecture", "Prof. Ananya Sen"));
            timetableRepository.save(new TimetableSlot("Monday", "01:30 PM", "03:30 PM", "OS & System Programming Lab", "Lab 3", "Lab", "Dr. K. Sharma"));

            // Tuesday
            timetableRepository.save(new TimetableSlot("Tuesday", "09:00 AM", "10:00 AM", "Database Management Systems", "TP 204", "Lecture", "Dr. Rajesh Raman"));
            timetableRepository.save(new TimetableSlot("Tuesday", "10:15 AM", "11:15 AM", "Computer Networks", "UB 305", "Lecture", "Prof. Meera Nair"));
            timetableRepository.save(new TimetableSlot("Tuesday", "11:30 AM", "12:30 PM", "Software Engineering", "TP 505", "Lecture", "Dr. Vikram Joshi"));

            // Wednesday
            timetableRepository.save(new TimetableSlot("Wednesday", "09:00 AM", "11:00 AM", "DBMS Practical & SQL Lab", "Database Lab 2", "Lab", "Dr. Rajesh Raman"));
            timetableRepository.save(new TimetableSlot("Wednesday", "11:30 AM", "12:30 PM", "Operating Systems", "TP 402", "Lecture", "Dr. K. Sharma"));
            timetableRepository.save(new TimetableSlot("Wednesday", "02:00 PM", "03:00 PM", "Data Structures & Algorithms", "UB 601", "Tutorial", "Prof. Ananya Sen"));

            // Thursday
            timetableRepository.save(new TimetableSlot("Thursday", "09:00 AM", "10:00 AM", "Computer Networks", "UB 305", "Lecture", "Prof. Meera Nair"));
            timetableRepository.save(new TimetableSlot("Thursday", "10:15 AM", "11:15 AM", "Software Engineering", "TP 505", "Lecture", "Dr. Vikram Joshi"));
            timetableRepository.save(new TimetableSlot("Thursday", "01:30 PM", "03:30 PM", "Networks & Socket Lab", "Networking Lab", "Lab", "Prof. Meera Nair"));

            // Friday
            timetableRepository.save(new TimetableSlot("Friday", "09:00 AM", "10:00 AM", "Data Structures & Algorithms", "UB 601", "Lecture", "Prof. Ananya Sen"));
            timetableRepository.save(new TimetableSlot("Friday", "10:15 AM", "11:15 AM", "Database Management Systems", "TP 204", "Lecture", "Dr. Rajesh Raman"));
            timetableRepository.save(new TimetableSlot("Friday", "01:30 PM", "02:30 PM", "Research Seminar & Mentorship", "Auditorium", "Seminar", "Faculty Team"));
        }

        // 4. Seed Academic Records (Marks & CGPA)
        if (academicRecordRepository.count() == 0) {
            academicRecordRepository.save(new AcademicRecord(5, "CS301", "Operating Systems", 4, 46, 45)); // 91 -> O (10)
            academicRecordRepository.save(new AcademicRecord(5, "CS302", "Data Structures & Algorithms", 4, 48, 47)); // 95 -> O (10)
            academicRecordRepository.save(new AcademicRecord(5, "CS303", "Database Management Systems", 4, 45, 46)); // 91 -> O (10)
            academicRecordRepository.save(new AcademicRecord(5, "CS304", "Computer Networks", 3, 41, 43)); // 84 -> A+ (9)
            academicRecordRepository.save(new AcademicRecord(5, "CS305", "Software Engineering", 3, 44, 44)); // 88 -> A+ (9)
            academicRecordRepository.save(new AcademicRecord(5, "MA301", "Discrete Mathematics", 4, 42, 40)); // 82 -> A+ (9)
        }

        // 5. Seed Attendance
        if (attendanceRepository.count() == 0) {
            attendanceRepository.save(new AttendanceRecord("Operating Systems", 33, 36));
            attendanceRepository.save(new AttendanceRecord("Data Structures & Algorithms", 35, 40));
            attendanceRepository.save(new AttendanceRecord("Database Management Systems", 29, 32));
            attendanceRepository.save(new AttendanceRecord("Computer Networks", 23, 30));
            attendanceRepository.save(new AttendanceRecord("Software Engineering", 26, 28));
        }

        // 6. Seed Tasks
        if (taskRepository.count() == 0) {
            taskRepository.save(new TaskItem("Revise OS Virtual Memory & Thrashing", "2 Hours Block", "high", false));
            taskRepository.save(new TaskItem("Complete SQL queries for BCNF schema", "Tonight 8:00 PM", "medium", false));
            taskRepository.save(new TaskItem("Practice LeetCode Daily Dynamic Programming", "1 Hour Block", "medium", true));
            taskRepository.save(new TaskItem("Read Computer Networks Chapter 4 (Routing)", "Weekend Plan", "low", false));
        }

        // 7. Seed Notes
        if (noteRepository.count() == 0) {
            noteRepository.save(new NoteItem("ACID Properties & Transactions", "DBMS", "Atomicity (all or nothing), Consistency (preserves invariants), Isolation (serializability with 2PL/MVCC), Durability (WAL write-ahead logging).", "2 hours ago", "fa-database"));
            noteRepository.save(new NoteItem("Process vs Thread Architecture", "Operating Systems", "Processes have separate virtual address spaces and PCB; threads share code, data, and open files within same process but have distinct stack and registers.", "Yesterday", "fa-microchip"));
            noteRepository.save(new NoteItem("TCP 3-Way Handshake & Teardown", "Computer Networks", "Connection: SYN -> SYN-ACK -> ACK. Termination: FIN -> ACK -> FIN -> ACK with TIME_WAIT state to prevent stale duplicate packets.", "3 days ago", "fa-network-wired"));
            noteRepository.save(new NoteItem("Spring Boot IoC & DI Principles", "Software Engineering", "Inversion of Control delegates object lifecycle to Spring Container. Dependency Injection wires beans via @Autowired or constructor injection.", "5 days ago", "fa-leaf"));
        }

        // 8. Seed User Profile
        if (profileRepository.count() == 0) {
            profileRepository.save(new UserProfile(
                    "Pritam Dey",
                    "pritam@srmist.edu.in",
                    "RA241100301276",
                    "B.Tech Computer Science & Engineering",
                    "5th Semester",
                    "SRM Institute of Science and Technology",
                    "PD"
            ));
        }
    }
}