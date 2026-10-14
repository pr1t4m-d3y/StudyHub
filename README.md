# 🎓 StudyHub — Full-Stack Student Academic & Productivity Platform

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Data JPA](https://img.shields.io/badge/Spring%20Data-JPA-blue.svg)](https://spring.io/projects/spring-data-jpa)
[![H2 Database](https://img.shields.io/badge/DBMS-H2%20In--Memory-yellow.svg)](https://www.h2database.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Maven](https://img.shields.io/badge/Build-Maven-red.svg)](https://maven.apache.org/)

StudyHub is an end-to-end, three-tier academic management and productivity platform designed for engineering university students. It combines a reactive frontend with a Spring Boot REST API and in-memory relational database (H2) to eliminate the friction of tracking courses, deadlines, attendance requirements, and GPA.

---

## 🌟 Key Features

### 1. 📋 Live Assignment Lifecycle Management
- Full CRUD operations synced directly with the Spring Boot backend.
- Mark assignments as `pending`, `submitted`, or `OVERDUE`.
- Filter assignments dynamically by status or keyword search.
- Modal forms with priority levels (`high`, `medium`, `low`) and due date pickers.

### 2. 📅 Interactive Weekly Timetable
- Multi-day weekly timetable grid covering Monday through Saturday.
- Single-click day filtering tabs with automatic highlighting for **Today's Classes**.
- Differentiates between Lectures, Practical Labs, and Tutorials.

### 3. 📊 Smart Attendance Tracker & Bunk Advisor
- Real-time attendance percentage tracking against the mandatory university **75% threshold**.
- Single-click **+ Present** and **- Absent** logging that immediately updates database records.
- **Smart Bunk Advisor**:
  - *If $\ge 75\%$*: Calculates exactly how many classes can be safely missed without falling below 75%.
  - *If $< 75\%$*: Calculates the exact number of consecutive classes required to recover to 75%.

### 4. 🏆 Dynamic Marks Ledger & CGPA Calculator
- Stores internal marks (/50), external marks (/50), and credit weights.
- Automatic grade evaluation (O, A+, A, B+, B, C, F) and grade points calculation.
- Backend summary endpoint (`/api/marks/summary`) calculates **SGPA** and **CGPA** dynamically from the database.

### 5. ⏱️ Integrated Pomodoro Study Timer
- Interactive interval timer supporting **Focus (25m)**, **Short Break (5m)**, and **Long Break (15m)**.
- Links directly to enrolled subjects to track study sessions and productivity metrics.

### 6. 📝 Engineering Notes Vault
- Centralized knowledge vault for quick revision notes, code snippets, and exam references.
- Modal preview to view full notes and single-click deletion.

### 7. 🔍 Global Search & Live Feedback
- Search bar filters whatever tab is currently active (assignments, subjects, notes, schedules).
- Toast notification alerts provide instant visual confirmation for all database operations.

---

## 🏛️ System Architecture

StudyHub strictly enforces the **Three-Tier Enterprise Architecture**:

```
┌────────────────────────────────────────────────────────┐
│            Presentation Layer (Client Tier)            │
│         React 18 SPA • Custom CSS Bento Design         │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON (REST APIs)
                            ▼
┌────────────────────────────────────────────────────────┐
│         Controller Tier (Spring Web MVC)               │
│      @RestController • CORS Enabled • Endpoints        │
└───────────────────────────┬────────────────────────────┘
                            │ Delegates
                            ▼
┌────────────────────────────────────────────────────────┐
│            Business Layer (Service Tier)               │
│     @Service • Validation Rules • Invariant Checks     │
└───────────────────────────┬────────────────────────────┘
                            │ CRUD Operations
                            ▼
┌────────────────────────────────────────────────────────┐
│         Data Access Layer (Repository Tier)            │
│      Spring Data JPA • Hibernate ORM • Proxies         │
└───────────────────────────┬────────────────────────────┘
                            │ SQL Queries & Auto DDL
                            ▼
┌────────────────────────────────────────────────────────┐
│               Database Tier (DBMS)                     │
│         H2 In-Memory Relational Database Engine        │
└────────────────────────────────────────────────────────┘
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/assignments` | Retrieve all assignments |
| `POST` | `/api/assignments` | Validate and create a new assignment |
| `PATCH` | `/api/assignments/{id}/status` | Update assignment status (`pending` / `submitted`) |
| `DELETE` | `/api/assignments/{id}` | Delete an assignment |
| `GET` | `/api/subjects` | Retrieve all registered courses |
| `POST` | `/api/subjects` | Add a new subject to curriculum |
| `GET` | `/api/timetable` | Retrieve all weekly schedule slots |
| `GET` | `/api/timetable/day/{day}` | Retrieve classes for a specific day |
| `POST` | `/api/timetable` | Add a class slot |
| `GET` | `/api/marks/summary` | Compute SGPA and CGPA live from records |
| `POST` | `/api/marks` | Add course marks with auto grade calculation |
| `GET` | `/api/attendance` | Retrieve all subject attendance records |
| `PATCH` | `/api/attendance/{id}/mark?present=true/false` | Record class attendance and update % |
| `GET` | `/api/tasks` | Retrieve planner tasks |
| `PATCH` | `/api/tasks/{id}/toggle` | Toggle task completion status |
| `GET` | `/api/notes` | Retrieve notes from vault |
| `GET` | `/api/profile` | Retrieve student profile |

---

## 🚀 Getting Started

### Prerequisites
- **Java 21** or later
- **Maven 3.8+** (or use the included `./mvnw` wrapper)
- **Python 3** (for serving the frontend) or any local static web server

### 1. Run the Spring Boot Backend
```bash
cd backend
./mvnw spring-boot:run
```
The backend starts on port `8080`.
- **H2 DBMS Web Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - **JDBC URL**: `jdbc:h2:mem:studyhubdb`
  - **Username**: `sa`
  - **Password**: *(leave blank)*

### 2. Run Automated JUnit Tests
```bash
cd backend
./mvnw test
```

### 3. Run the Frontend
In the root `StudyHub` directory:
```bash
python3 -m http.server 5500
```
Open **[http://localhost:5500](http://localhost:5500)** in any modern web browser.

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla CSS3 (Custom Bento-Grid design system, Glassmorphism, Micro-animations), React 18, Babel Standalone.
- **Backend**: Spring Boot 4.1.1, Spring Web MVC, Spring Data JPA, Hibernate.
- **Database**: H2 In-Memory Relational Database.
- **Testing**: JUnit 5, Spring Boot Test Framework, Mockito.
- **Build**: Apache Maven Wrapper.

---

## 👤 Author
- **Pritam Dey** (SRM Institute of Science and Technology)
- Registration Number: **RA241100301276**
