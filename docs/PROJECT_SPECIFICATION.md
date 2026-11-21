# University Management System

## Software Project Specification

**Project Type:** Full-Stack Web Application  
**Development Approach:** Feature-First Development  
**Frontend:** React + TypeScript  
**Backend:** Node.js + Express.js + TypeScript  
**Database:** PostgreSQL  
**ORM:** Prisma  
**Authentication:** JWT + bcrypt

---

# 1. Project Overview

The University Management System is a centralized web-based platform designed to manage academic activities and university operations.

The system provides separate interfaces and functionalities for three main user categories:

1. Students
2. Teachers / Doctors / Teaching Assistants (TAs)
3. Administrators

The primary objective is to provide students with a single platform where they can manage their academic activities, register for courses, access educational materials, submit assignments, take quizzes and exams, and monitor their academic progress.

Teachers, doctors, and teaching assistants will use the platform to manage their assigned courses, upload educational materials, publish grades, record attendance, communicate with students, and handle certain academic operations.

Administrators will manage users, courses, academic assignments, and the overall university system.

The system aims to reduce manual administrative work, centralize academic information, and improve communication between students, instructors, and university administration.

# 2. Project Objectives

The system should:

- Centralize university academic activities.
- Provide role-based access to different users.
- Allow students to manage their course registrations.
- Provide access to course materials and announcements.
- Support online assignments, document submissions, quizzes, and exams.
- Allow instructors to manage their courses and students.
- Support attendance management.
- Allow students to monitor their GPA, credit hours, schedules, and financial information.
- Allow administrators to manage university accounts and academic structures.
- Provide a simple, organized, and user-friendly interface.

# 3. User Roles and Permissions

The system has three main user categories.

## 3.1 Student

Students are users who access the system to manage their academic activities.

### Student Functionalities

**A. Account and Profile Management**

Students should be able to:

- Log in using their university credentials.
- View their personal account information.
- View their academic information.
- View their GPA.
- View their accumulated credit hours.
- View their academic schedule.
- View their financial information.
- Log out securely.

The student account should display relevant academic information, such as:

- Student name and ID.
- Department or major.
- Academic year or level.
- GPA.
- Completed credit hours.
- Registered credit hours.
- Financial balance or outstanding fees, if available.

**B. Course Registration**

Students should be able to:

- Browse available courses.
- View course information.
- Register for available courses.
- Drop previously registered courses.
- View their currently registered courses.
- View course capacity and availability.
- See whether a registration or dropping operation was successful.

The system should prevent invalid registrations, such as registering for a full course or registering for the same course twice.

Course registration rules, including registration periods and maximum credit hours, should be configurable or enforced according to university policies.

**C. Course Information**

Students should be able to:

- View their registered courses.
- View course descriptions.
- View assigned doctors or teaching assistants.
- View course materials.
- View course announcements.
- Access relevant course documents.

**D. Assignment and Document Submission**

Students should be able to:

- View assignments and document-submission requirements.
- Upload and submit documents.
- View submission deadlines.
- View submission status.
- View feedback or grades when published.

The system should store submission information and the uploaded file reference.

**E. Quizzes and Exams**

Students should be able to:

- View available quizzes and exams.
- View their instructions and deadlines.
- Start an available quiz or exam.
- Answer questions.
- Submit their answers.
- View results and grades when released.

The system should enforce quiz availability periods and submission deadlines.

**F. Academic Information**

Students should be able to view:

- Current GPA.
- Academic credit hours.
- Registered courses.
- Academic schedule.
- Published grades.
- Academic progress.

**G. Financial Information**

Students should be able to view their financial information, such as:

- Outstanding balances.
- Tuition or fee information.
- Payment status, if payment records are available.

The initial project scope is limited to displaying financial information. Actual payment processing is not required unless added as a future feature.

**H. Optional NotebookLM Integration**

An optional future feature may allow students to use NotebookLM-related functionality for studying and organizing learning materials.

This feature is not part of the initial implementation. Any integration would require separate investigation into available APIs, permissions, and technical feasibility.

---

## 3.2 Teacher / Doctor / Teaching Assistant (TA)

Teachers, doctors, and teaching assistants are academic staff members who manage educational activities.

They should only be able to access and manage the courses or students assigned to them, according to their permissions.

### Instructor Functionalities

**A. Account Management**

- Log in using university credentials.
- View personal account information.
- View assigned courses.
- Log out securely.

**B. Course Materials Management**

Instructors should be able to:

- Upload course materials.
- Upload lecture notes and educational documents.
- View uploaded materials.
- Update material information.
- Delete materials when authorized.

Students enrolled in the relevant course should be able to access available materials.

**C. Grade Management**

Instructors should be able to:

- Enter student grades.
- View grades for students in assigned courses.
- Update grades when authorized.
- Publish grades to students.
- View student academic performance in their courses.

The system must prevent unauthorized users from changing grades.

**D. Attendance Management**

Instructors should be able to:

- View the students enrolled in their courses.
- Record attendance.
- Mark students as present or absent.
- View attendance records.
- Review attendance history.

**E. Announcements and Communication**

Instructors should be able to:

- Create course announcements.
- Publish announcements.
- Edit announcements.
- Delete announcements when authorized.
- Communicate important course information to enrolled students.

**F. Schedule Management**

Instructors may be able to:

- View their teaching schedule.
- Submit schedule-related requests.
- Propose schedule changes.
- Approve schedules when authorized.

The exact approval workflow and the authority responsible for approving schedules must be determined before implementation.

---

## 3.3 Administrator

Administrators are responsible for managing the overall system and its academic structure.

Administrators have the highest level of system privileges.

### Administrator Functionalities

**A. Account Management**

Administrators should be able to:

- Create student accounts.
- Create doctor accounts.
- Create teaching assistant accounts.
- View user accounts.
- Edit user information.
- Deactivate accounts.
- Reactivate accounts.
- Delete accounts when permitted.

Account creation should include the appropriate role and relevant university information.

Public self-registration is not required in the initial design. Accounts are provisioned by administrators.

**B. Course Management**

Administrators should be able to:

- Create courses.
- Edit course information.
- Archive or deactivate courses.
- View all courses.
- Configure course capacity.
- Assign courses to academic semesters.
- Manage course availability.

**C. Student and TA Assignment**

Administrators should be able to:

- View students.
- View teaching assistants.
- Assign students to teaching assistants.
- Change student-to-TA assignments.
- View existing assignments.

The exact purpose of this assignment (for example, academic advising, tutorial groups, or teaching support) should be defined by university policy.

**D. Doctor-to-Course Assignment**

Administrators should be able to:

- View doctors.
- View courses.
- Assign doctors to courses.
- Change course assignments.
- View which doctors are responsible for each course.

**E. Academic Management**

Administrators should be able to:

- Manage semesters.
- Monitor course registrations.
- View enrollment information.
- Manage course capacity.
- Monitor student and instructor assignments.
- Manage academic settings.

**F. General System Management**

Administrators should be able to:

- View system users.
- Monitor general academic activities.
- Manage account statuses.
- Access administrative dashboards.
- Maintain the system's academic data.

---

# 4. Functional Requirements

The following requirements describe what the system shall provide.

## 4.1 Authentication and User Management

- AUTH-01: The system shall allow registered users to log in using their credentials.
- AUTH-02: The system shall identify the user's role after successful authentication.
- AUTH-03: The system shall restrict access according to the user's role.
- AUTH-04: The system shall allow administrators to create student accounts.
- AUTH-05: The system shall allow administrators to create doctor accounts.
- AUTH-06: The system shall allow administrators to create TA accounts.
- AUTH-07: The system shall allow authorized administrators to edit and deactivate accounts.
- AUTH-08: The system shall securely hash user passwords.
- AUTH-09: The system shall prevent inactive accounts from accessing protected functionality.
- AUTH-10: The system shall allow authenticated users to log out.

## 4.2 Student Requirements

- STU-01: The system shall provide students with a personal dashboard.
- STU-02: The system shall allow students to view available courses.
- STU-03: The system shall allow students to register for available courses.
- STU-04: The system shall allow students to drop registered courses, subject to university rules.
- STU-05: The system shall prevent duplicate course registrations.
- STU-06: The system shall allow students to view their registered courses.
- STU-07: The system shall allow students to view course details.
- STU-08: The system shall allow students to view course materials.
- STU-09: The system shall allow students to download available materials.
- STU-10: The system shall allow students to view course announcements.
- STU-11: The system shall allow students to submit documents.
- STU-12: The system shall allow students to view submission status.
- STU-13: The system shall allow students to take available quizzes and exams.
- STU-14: The system shall record quiz and exam submissions.
- STU-15: The system shall allow students to view published grades.
- STU-16: The system shall display students' GPA when academic data is available.
- STU-17: The system shall display students' accumulated and registered credit hours.
- STU-18: The system shall display students' academic schedules.
- STU-19: The system shall display students' financial information when available.

## 4.3 Instructor Requirements

- INS-01: The system shall provide instructors with a dashboard.
- INS-02: The system shall allow instructors to view assigned courses.
- INS-03: The system shall allow instructors to view students enrolled in their courses.
- INS-04: The system shall allow authorized instructors to upload course materials.
- INS-05: The system shall allow instructors to manage uploaded materials.
- INS-06: The system shall allow instructors to create course announcements.
- INS-07: The system shall allow instructors to edit and delete their announcements when authorized.
- INS-08: The system shall allow instructors to record student attendance.
- INS-09: The system shall allow instructors to view attendance records.
- INS-10: The system shall allow instructors to enter student grades.
- INS-11: The system shall allow authorized instructors to update grades.
- INS-12: The system shall allow instructors to publish grades.
- INS-13: The system shall allow instructors to create quizzes and exams.
- INS-14: The system shall allow instructors to view student submissions.
- INS-15: The system shall allow instructors to view their teaching schedules.
- INS-16: The system shall support schedule-related approval operations when the instructor has the required permission.

## 4.4 Administrator Requirements

- ADM-01: The system shall provide administrators with an administrative dashboard.
- ADM-02: The system shall allow administrators to create student accounts.
- ADM-03: The system shall allow administrators to create doctor accounts.
- ADM-04: The system shall allow administrators to create TA accounts.
- ADM-05: The system shall allow administrators to edit and deactivate accounts.
- ADM-06: The system shall allow administrators to create courses.
- ADM-07: The system shall allow administrators to edit and archive courses.
- ADM-08: The system shall allow administrators to assign doctors to courses.
- ADM-09: The system shall allow administrators to assign students to TAs.
- ADM-10: The system shall allow administrators to manage semesters.
- ADM-11: The system shall allow administrators to configure course capacity.
- ADM-12: The system shall allow administrators to monitor course registrations.
- ADM-13: The system shall allow administrators to view academic assignments.

## 4.5 General System Requirements

- SYS-01: The system shall validate user inputs.
- SYS-02: The system shall enforce role-based authorization.
- SYS-03: The system shall prevent unauthorized access to academic information.
- SYS-04: The system shall provide meaningful success and error messages.
- SYS-05: The system shall support searching and filtering where appropriate.
- SYS-06: The system shall protect uploaded documents from unauthorized access.
- SYS-07: The system shall maintain consistent academic records.

---

# 5. Business Rules

The system shall follow these general rules:

1. Every user must have an account to access protected functionality.
2. Every account must have an assigned role.
3. Administrators are responsible for creating and managing accounts.
4. Students can only view and manage their own academic information.
5. Students can only access materials and announcements belonging to courses they are permitted to access.
6. Students cannot modify grades or attendance records.
7. Instructors can only manage courses and students assigned to them.
8. Administrators can manage the academic structure.
9. A student cannot register for the same course more than once in the same academic offering.
10. A student cannot register for a course that has reached its capacity.
11. Course dropping must follow the applicable university rules.
12. Instructors cannot publish grades for courses they are not assigned to.
13. Instructors cannot change attendance records for courses they are not authorized to manage.
14. Uploaded documents must follow file type and size restrictions.
15. Sensitive information must only be accessible to authorized users.

---

# 6. Technology Stack

The project will use the following technologies.

## Frontend

- React: Building the user interface.
- TypeScript: Type-safe frontend development.
- Vite: Frontend development and build tooling.
- React Router: Navigation between pages.
- Axios: Communicating with the backend API.

## Backend

- Node.js: JavaScript runtime.
- Express.js: Backend framework.
- TypeScript: Type-safe backend development.
- JWT: Authentication.
- bcrypt: Password hashing.

## Database

- PostgreSQL: Relational database.
- Prisma: Object-relational mapping and database migrations.

## Development Tools

- Git: Version control.
- GitHub: Repository hosting and collaboration.
- GitHub Issues: Task tracking.
- GitHub Projects: Project management.
- Postman: API testing.
- VS Code: Development environment.

---

# 7. System Architecture

The application will follow a client-server architecture.

## 7.1 Frontend

The frontend is responsible for:

- Displaying the user interface.
- Providing separate dashboards based on roles.
- Collecting user input.
- Sending requests to backend APIs.
- Displaying retrieved information.
- Showing validation and error messages.

## 7.2 Backend

The backend is responsible for:

- Handling API requests.
- Authenticating users.
- Authorizing access based on roles and permissions.
- Enforcing business rules.
- Validating input.
- Interacting with PostgreSQL through Prisma.
- Handling file uploads and downloads.
- Returning structured API responses.

## 7.3 Database

PostgreSQL will store:

- User accounts.
- Student and instructor information.
- Courses.
- Semesters.
- Course registrations.
- Instructor assignments.
- Materials.
- Announcements.
- Assignments and submissions.
- Quizzes and exams.
- Grades.
- Attendance.
- Schedules.
- Financial records, if included.

---

# 8. Proposed Database Design

The database will use relational tables and explicit relationships.

The following entities represent the proposed starting design. The schema should be refined before creating the first migration.

## 8.1 User

Stores shared account information.

Fields:

- id
- fullName
- email
- passwordHash
- role
- isActive
- createdAt
- updatedAt

Role values:

- STUDENT
- DOCTOR
- TA
- ADMIN

## 8.2 Student

Stores student-specific information.

Fields:

- id
- userId
- studentNumber
- department
- academicYear
- GPA
- accumulatedCreditHours

## 8.3 Instructor

Stores information common to doctors and TAs where appropriate.

Fields:

- id
- userId
- employeeNumber
- department
- instructorType

The system may use separate Doctor and TA profile entities if their information or permissions require it.

## 8.4 Semester

Fields:

- id
- name
- startDate
- endDate
- isActive

## 8.5 Course

Fields:

- id
- courseName
- courseCode
- description
- creditHours
- capacity
- status
- semesterId
- createdAt
- updatedAt

## 8.6 Enrollment

Represents a student's registration in a course.

Fields:

- id
- studentId
- courseId
- enrollmentDate
- status

A student-course combination must not have duplicate active enrollments for the same course offering.

## 8.7 DoctorCourseAssignment

Connects doctors to courses.

Fields:

- id
- doctorId
- courseId

The design should allow multiple instructors per course if required.

## 8.8 StudentTAAssignment

Connects students to teaching assistants.

Fields:

- id
- studentId
- taId
- assignedAt

## 8.9 CourseMaterial

Fields:

- id
- title
- description
- fileName
- filePath
- fileType
- fileSize
- courseId
- uploadedBy
- createdAt

## 8.10 Announcement

Fields:

- id
- title
- content
- courseId
- createdBy
- createdAt
- updatedAt

Announcements may be course-specific or university-wide if that functionality is required.

## 8.11 Assignment

Fields:

- id
- title
- description
- courseId
- createdBy
- dueDate
- createdAt

## 8.12 Submission

Fields:

- id
- assignmentId
- studentId
- filePath
- submittedAt
- status
- grade
- feedback

## 8.13 Quiz

Fields:

- id
- title
- description
- courseId
- durationMinutes
- totalMarks
- startDate
- endDate
- status
- createdBy

## 8.14 Question

Fields:

- id
- quizId
- questionText
- questionType
- marks
- orderIndex

## 8.15 QuestionOption

Fields:

- id
- questionId
- optionText
- isCorrect

## 8.16 QuizAttempt

Fields:

- id
- quizId
- studentId
- startedAt
- submittedAt
- score
- status

## 8.17 StudentAnswer

Fields:

- id
- attemptId
- questionId
- selectedOptionId
- awardedMarks

## 8.18 Attendance

Fields:

- id
- studentId
- courseId
- recordedBy
- date
- status

Attendance status may include PRESENT, ABSENT, and other statuses approved by the university.

## 8.19 Schedule

Fields:

- id
- courseId
- dayOfWeek
- startTime
- endTime
- location
- semesterId

Additional schedule-request or approval entities may be introduced if schedule approvals are confirmed as a requirement.

## 8.20 FinancialRecord

Fields:

- id
- studentId
- description
- amount
- dueDate
- paymentStatus
- createdAt

This entity is for displaying financial information. Payment processing is outside the initial scope.

## 8.21 Notification

Fields:

- id
- userId
- title
- message
- type
- isRead
- createdAt

---

# 9. Proposed Frontend Pages

The application will provide different pages according to the authenticated user's role.

## 9.1 Shared Pages

- Login
- Profile
- Notifications
- Unauthorized Access
- Not Found

## 9.2 Student Pages

- Student Dashboard
- My Account
- Course Catalog
- Course Details
- My Registered Courses
- Course Materials
- Announcements
- Assignments
- Assignment Submission
- Quizzes and Exams
- Quiz Attempt
- Results and Grades
- Attendance
- Academic Schedule
- Financial Information

## 9.3 Doctor / TA Pages

- Instructor Dashboard
- Profile
- Assigned Courses
- Course Details
- Enrolled Students
- Course Materials Management
- Upload Materials
- Announcements Management
- Attendance Management
- Grade Management
- Assignment Management
- Quiz and Exam Management
- Student Submissions
- Teaching Schedule

Some pages and permissions may differ between doctors and TAs.

## 9.4 Administrator Pages

- Admin Dashboard
- User Management
- Create Student Account
- Create Doctor Account
- Create TA Account
- Course Management
- Create Course
- Semester Management
- Doctor-Course Assignment
- Student-TA Assignment
- Enrollment Management
- Academic Management

---

# 10. Proposed Backend Folder Structure

The backend should use a modular structure.

backend/
src/
config/
controllers/
middleware/
routes/
services/
validators/
utils/
types/
app.ts
server.ts

prisma/
schema.prisma
migrations/

Responsibilities:

- routes: Define API endpoints.
- controllers: Handle requests and responses.
- services: Implement business logic.
- middleware: Authentication, authorization, and error handling.
- validators: Validate incoming data.
- config: Database and application configuration.
- utils: Reusable helper functions.
- types: Shared backend TypeScript types.

Features should be organized consistently so team members can work on separate modules.

---

# 11. Proposed API Endpoints

These are proposed endpoints and should be implemented gradually.

## Authentication

- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout

## Users

- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- PATCH /api/users/:id/status

## Courses

- GET /api/courses
- GET /api/courses/:id
- POST /api/courses
- PUT /api/courses/:id
- PATCH /api/courses/:id/archive

## Enrollments

- GET /api/enrollments/my-courses
- POST /api/enrollments
- DELETE /api/enrollments/:id

## Instructor Assignments

- GET /api/courses/:id/instructors
- POST /api/courses/:id/instructors
- DELETE /api/courses/:id/instructors/:instructorId

## Student-TA Assignments

- GET /api/students/:id/ta
- POST /api/students/:id/ta
- DELETE /api/students/:id/ta

## Course Materials

- GET /api/courses/:id/materials
- POST /api/courses/:id/materials
- PUT /api/materials/:id
- DELETE /api/materials/:id
- GET /api/materials/:id/download

## Announcements

- GET /api/announcements
- GET /api/courses/:id/announcements
- POST /api/announcements
- PUT /api/announcements/:id
- DELETE /api/announcements/:id

## Assignments and Submissions

- GET /api/courses/:id/assignments
- POST /api/courses/:id/assignments
- PUT /api/assignments/:id
- DELETE /api/assignments/:id
- POST /api/assignments/:id/submissions
- GET /api/assignments/:id/submissions
- GET /api/submissions/:id

## Quizzes and Exams

- GET /api/courses/:id/quizzes
- POST /api/courses/:id/quizzes
- GET /api/quizzes/:id
- PUT /api/quizzes/:id
- POST /api/quizzes/:id/attempts
- POST /api/attempts/:id/submit
- GET /api/attempts/:id/results

## Grades

- GET /api/students/me/grades
- GET /api/courses/:id/grades
- POST /api/courses/:id/grades
- PATCH /api/grades/:id
- PATCH /api/grades/:id/publish

## Attendance

- GET /api/courses/:id/attendance
- POST /api/courses/:id/attendance
- PUT /api/attendance/:id

## Schedule

- GET /api/students/me/schedule
- GET /api/instructors/me/schedule
- POST /api/schedules
- PUT /api/schedules/:id

## Financial Information

- GET /api/students/me/finances
- GET /api/students/:id/finances

All endpoints must enforce authentication and resource-level permissions where necessary.

---

# 12. File Management

The system must support uploading and downloading educational files.

Examples:

- Lecture slides.
- PDF documents.
- Assignments.
- Student submissions.
- Other course-related documents.

During development, files may be stored locally.

The database should store file metadata and storage references rather than placing file contents directly in ordinary database text columns.

The backend must:

- Validate file types.
- Restrict file sizes.
- Generate safe filenames.
- Prevent unauthorized downloads.
- Ensure that students can only access files they are permitted to access.

Cloud storage may be considered later.

---

# 13. Security Requirements

The system must:

- Hash passwords using bcrypt.
- Authenticate users using JWT.
- Enforce role-based authorization on the backend.
- Validate incoming requests.
- Protect private environment variables.
- Prevent unauthorized modification of grades.
- Prevent students from accessing other students' private information.
- Restrict instructors to their assigned courses.
- Protect uploaded files.
- Avoid exposing correct quiz answers before the permitted release time.
- Prevent users from assigning themselves administrative permissions.

The frontend must never be treated as the only security boundary.

---

# 14. Non-Functional Requirements

## Performance

- Pages should load within a reasonable time.
- API requests should avoid unnecessary database operations.
- The system should support multiple users accessing the application.

## Reliability

- The system should handle invalid requests without crashing.
- Data should remain consistent.
- Important operations should provide clear success or failure feedback.

## Usability

- The interface should be simple and understandable.
- Each role should have an appropriate dashboard.
- Navigation should be consistent.
- Forms should provide validation messages.

## Maintainability

- Code should be modular and organized.
- TypeScript should be used throughout the application.
- Components and functions should be reusable.
- The team should follow consistent naming conventions.
- Important logic should be documented.

## Security

- Private data must be protected.
- Users must only access authorized functionality.
- Passwords and secrets must never be committed to GitHub.

---

# 15. Phase 1 Implementation Scope

The full system is the long-term vision. Phase 1 must remain much smaller.

The initial working demonstration should establish the frontend, backend, database, and team development workflow.

## Phase 1 Demo Features

1. Basic React frontend.
2. Basic Express backend.
3. PostgreSQL database connection.
4. Prisma database integration.
5. Course catalog.
6. Course details.
7. Add a course.

### Demo Workflow

1. Open the application.
2. View the available courses.
3. Select a course to see its details.
4. Add a new course.
5. Verify that the new course is stored in PostgreSQL.
6. Refresh the application and confirm that the course remains available.

The initial demo does not require authentication, quizzes, grades, attendance, or financial management.

## Phase 1 Team Contribution

Each team member must have meaningful code contributions visible through individual commits.

The proposed first feature assignments are:

**Yousef Tarek**

- Course Details feature.
- Retrieve an individual course from the backend.
- Display course information.

**Mohamed Osama**

- Course Catalog feature.
- Retrieve and display available courses.
- Implement basic course search.

**Mohamed Ahmed**

- Add Course feature.
- Create the course form.
- Submit course data to the backend.
- Save new courses in PostgreSQL.

These assignments apply to the initial demonstration, not the complete project.

---

# 16. Feature-First Development and GitHub Workflow

The team must follow feature-first development.

Each feature should have:

1. A GitHub Issue describing the feature.
2. A dedicated feature branch.
3. An implementation.
4. Appropriate testing.
5. A Pull Request.
6. Code review.
7. A merge into main after completion.

Example branches:

- feature/authentication
- feature/course-catalog
- feature/course-details
- feature/add-course
- feature/course-enrollment
- feature/attendance-management
- feature/quiz-management

The main branch should contain stable, integrated code.

Shared foundational work, such as repository setup and agreed database configuration, can be committed to main.

Team members should avoid editing the same shared files independently without coordination.

---

# 17. Development Roadmap

The system should be implemented incrementally.

## Stage 1: Project Foundation

- Repository setup.
- React initialization.
- Express initialization.
- TypeScript configuration.
- PostgreSQL setup.
- Prisma initialization.
- Shared database model.
- API conventions.

## Stage 2: Phase 1 Demonstration

- Course catalog.
- Course details.
- Add course.
- Frontend-backend integration.
- Testing and bug fixing.

## Stage 3: Authentication and Accounts

- Login.
- JWT authentication.
- Role-based authorization.
- Admin account management.
- Student and instructor profiles.

## Stage 4: Academic Management

- Course management.
- Semester management.
- Course registration.
- Course dropping.
- Doctor-course assignments.
- Student-TA assignments.

## Stage 5: Learning Management

- Course materials.
- Announcements.
- Assignments.
- Document submissions.
- Attendance.

## Stage 6: Assessments and Grades

- Quizzes.
- Exams.
- Questions and answers.
- Student attempts.
- Automatic grading for supported question types.
- Grade management and publication.

## Stage 7: Student Academic Services

- GPA display.
- Credit hours.
- Academic schedule.
- Financial information.
- Notifications.

## Stage 8: Testing, Documentation, and Deployment

- Automated testing.
- UML diagrams.
- Use case diagrams.
- Sequence diagrams.
- Class diagrams.
- Software Requirements Specification.
- GitHub Actions.
- Deployment.
- Final integration testing.

---

# 18. Project Development Instructions for Claude

Claude should treat this document as the overall project specification and source of truth.

The developers are third-year Computer Science students who are still learning full-stack development. The implementation must therefore be understandable, incremental, and educational.

## General Instructions

1. Use React and TypeScript for the frontend.
2. Use Node.js, Express.js, and TypeScript for the backend.
3. Use PostgreSQL and Prisma for database operations.
4. Use JWT and bcrypt for authentication when authentication is implemented.
5. Keep the code modular and maintainable.
6. Avoid using `any` unless absolutely necessary.
7. Follow consistent naming conventions.
8. Validate inputs on the backend.
9. Implement authorization on the backend.
10. Never store plain-text passwords.
11. Do not expose secrets or commit `.env` files.

## Feature Implementation Instructions

Do not generate the entire application at once.

For every feature:

1. Explain what the feature does.
2. Identify the frontend components required.
3. Identify the backend routes and endpoints required.
4. Identify the database models and relationships involved.
5. Explain the implementation steps.
6. Implement the feature in manageable stages.
7. Explain the code and important concepts.
8. Test the implementation.
9. Explain how to troubleshoot common errors.
10. Ensure that the feature integrates correctly with existing code.

## Collaboration Instructions

- Inspect the existing repository before making changes.
- Do not overwrite existing files without checking their contents.
- Respect the current branch and GitHub workflow.
- Do not modify unrelated features.
- Avoid changing shared database models without coordinating with the team.
- Do not introduce new technologies without discussing them first.
- Do not invent business rules when requirements are unclear.
- Ask for clarification before making major architectural decisions.

## Scope Instructions

The full system specification describes the long-term project vision.

The current implementation phase is Phase 1 only.

Do not start implementing all the long-term features immediately. Follow the current Phase 1 plan and implement the small working demonstration first.

---

# 19. Decisions Requiring Confirmation

The following details are not fully defined yet and must be discussed before the relevant features are implemented.

1. **Doctor and TA permissions:** Do doctors and TAs have identical permissions, or should TAs have more limited access?
2. **Student-to-TA assignment:** What is the purpose of assigning students to TAs? Academic advising, tutorial groups, or something else?
3. **Course registration:** Are there prerequisites, credit-hour limits, or registration periods?
4. **Course dropping:** What is the deadline and approval process for dropping a course?
5. **Course instructors:** Can a course have multiple doctors and TAs?
6. **Schedule approval:** Who approves a student's or instructor's schedule, and what exactly does approval mean?
7. **Grades:** Are grades entered manually, calculated from assignments and exams, or both?
8. **GPA:** What grading scale and GPA calculation rules does the university use?
9. **Finances:** Will the application only display financial information, or will payment functionality be required?
10. **Assignments and exams:** Which file types, question types, and submission rules should be supported?
11. **NotebookLM:** Is this merely an optional external tool students can use, or is an actual integration expected?

These decisions should be documented as the project evolves.

---

# 20. Final Project Vision

The final goal is to create a unified University Management System that allows:

- Students to manage their academic lives.
- Doctors and teaching assistants to manage educational activities.
- Administrators to manage university accounts and academic operations.

The system should provide a centralized environment for course registration, academic information, educational resources, assignments, assessments, grades, attendance, schedules, and student services.

Development must remain incremental, feature-first, and collaborative, with each team member contributing meaningful functionality and understanding the code they implement.
