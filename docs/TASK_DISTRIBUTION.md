# 👥 Phase 1 Workload Division & Task Allocation
**University Learning Management & Academic Portal**

This document establishes the official workload distribution for Phase 1. 

Because the canonical database schema is already defined in `schema.prisma`, **all three team members can work simultaneously in parallel without blocking each other**.

---

## 🧭 High-Level Domain Mapping

| Team Member | Domain / Functional Area | Key Models | Branch Name |
| :--- | :--- | :--- | :--- |
| **Mohamed Osama** | Authentication, User Management & Profiles | `User`, `Notification` | `feature/auth-user-mgmt` |
| **Yousef Tarek** | Courses, Semesters & Student Enrollment | `Semester`, `Course`, `Enrollment` | `feature/courses-enrollment` |
| **Mohamed Ahmed** | Shared UI Shell, Materials & Announcements | `CourseMaterial`, `Announcement` | `feature/ui-materials-announcements` |

---

## 1. 👤 Mohamed Osama — Authentication, User Management & Profiles
**Primary Mission:** Secure access control, role authorization, and user administration.

### Task List (Sorted by Priority: P0 Critical $\rightarrow$ P2 Normal)

#### [P0] 1. JWT Authentication & Password Hashing (AUTH-01, AUTH-07)
* **Backend:**
  * Implement `POST /api/auth/login` accepting `email` and `password`.
  * Verify passwords using `bcrypt.compare()`.
  * Issue signed JWT token containing `{ id, email, role, fullName }`.
* **Frontend:**
  * Build the official `LoginPage` component.
  * Store JWT token and user info in `localStorage`.
  * Set up `AuthContext` to make current user data available globally.

#### [P0] 2. Role-Based Route Protection (AUTH-02)
* **Backend:**
  * Build `authenticateToken` middleware (checks `Bearer <token>`).
  * Build `authorizeRole(...roles)` middleware (e.g. `authorizeRole('ADMIN')`).
* **Frontend:**
  * Build a `<ProtectedRoute allowedRoles={['STUDENT']}>` wrapper in React Router to redirect unauthorized users.

#### [P1] 3. User Profile Management (AUTH-05, STU-01 header)
* **Backend:**
  * Implement `GET /api/auth/me` to return current user details.
  * Implement `PUT /api/users/profile` to update permitted details (phone, department).
* **Frontend:**
  * Build `ProfilePage` where users can view their academic information and change password.

#### [P1] 4. Admin User Management (AUTH-03, AUTH-04, ADM-02, ADM-03)
* **Backend:**
  * `GET /api/users` (with search by name/email and filter by role).
  * `POST /api/users` (Admin creates new student/doctor accounts with initial hashed password).
  * `PATCH /api/users/:id/status` (Deactivate/Activate accounts).
* **Frontend:**
  * Build `AdminUsersPage` with a search bar, user table, and an "Add New User" modal form.

#### [P2] 5. Logout & Session Invalidation (AUTH-06)
* Clear `localStorage`, wipe `AuthContext` state, and navigate to `/login`.

---

## 2. 📚 Yousef Tarek — Courses, Semesters & Student Enrollment
**Primary Mission:** Academic calendar, course creation, instructor assignment, and student registration.

### Task List (Sorted by Priority: P0 Critical $\rightarrow$ P2 Normal)

#### [P0] 1. Course Browsing & Catalog (STU-02, Milestone 1)
* **Backend:**
  * Implement `GET /api/courses` (returns course list with assigned doctor name, semester, capacity, and current enrolled student count).
* **Frontend:**
  * Build `AvailableCoursesPage` displaying courses as responsive cards.
  * Include a search bar (filter by course code or course name) and semester dropdown filter.

#### [P0] 2. Student Course Registration & Capacity Enforcement (STU-03, Rule 5.2)
* **Backend:**
  * Implement `POST /api/enrollments` (Student registers for a course).
  * **Business Rule Validation:**
    1. Check if course exists and is `ACTIVE`.
    2. Check if student is already enrolled (enforced by DB `@@unique([studentId, courseId])`).
    3. Check if enrollment count < `capacity`.
    4. Check if semester's `registrationOpen` is true.
* **Frontend:**
  * Add an "Enroll" button on course cards with real-time remaining seat counter (e.g., `28/30 seats available`).

#### [P1] 3. View Enrolled Courses (STU-04)
* **Backend:**
  * Implement `GET /api/enrollments/my-courses` (returns all courses the logged-in student is currently enrolled in).
* **Frontend:**
  * Build `MyCoursesPage` displaying the student’s active classes with a quick link to each course page.

#### [P1] 4. Admin Course & Semester Management (ADM-04, ADM-06, ADM-07, ADM-09)
* **Backend:**
  * `POST /api/semesters` & `GET /api/semesters` (Create and list terms).
  * `PATCH /api/semesters/:id/status` (Toggle `registrationOpen`).
  * `POST /api/courses` (Admin creates course with code, capacity, and assigns a doctor).
  * `PATCH /api/courses/:id/archive` (Archive completed courses).
* **Frontend:**
  * Build `AdminCoursesPage` with a table of all courses and an "Add Course" form.

#### [P2] 5. Doctor's Assigned Courses & Class Roster (DOC-02, DOC-03)
* **Backend:**
  * `GET /api/doctor/courses` (courses where `doctorId = req.user.id`).
  * `GET /api/courses/:id/students` (list of students enrolled in that specific course).
* **Frontend:**
  * Build `DoctorCoursesPage` showing enrolled student lists for each class.

---

## 3. 🎨 Mohamed Ahmed — Shared UI Shell, Materials & Announcements
**Primary Mission:** Unified user interface architecture, file repository, and academic communication.

### Task List (Sorted by Priority: P0 Critical $\rightarrow$ P2 Normal)

#### [P0] 1. Shared Layout & App Shell (STU-01, DOC-01, ADM-01)
* **Frontend:**
  * Build the main layout (`MainLayout.tsx`) featuring:
    * **Top Navbar:** University logo, portal title, current user info badge, and Logout button.
    * **Collapsible Sidebar:** Navigation links that change dynamically based on user role (`STUDENT`, `DOCTOR`, `ADMIN`).
  * Establish reusable design system components: `Button.tsx`, `Modal.tsx`, `Card.tsx`, `LoadingSpinner.tsx`.

#### [P0] 2. Course Details Page Foundation (STU-05)
* **Frontend:**
  * Build the central hub for any course: `CourseDetailsPage.tsx` (`/courses/:id`).
  * Tabbed navigation: **Materials** | **Announcements** | **Quizzes** (Quizzes placeholder for Phase 2).

#### [P1] 3. Course Materials Management (DOC-04, DOC-05, STU-06, STU-07)
* **Backend:**
  * Setup local upload storage (`backend/uploads/`) using `multer`.
  * `POST /api/courses/:id/materials` (Doctors upload PDF/PPT slides; checks that doctor is assigned to course).
  * `GET /api/courses/:id/materials` (Enrolled students and assigned doctors can view list).
  * `GET /api/materials/:id/download` (Streams file to browser; verifies enrollment before downloading).
* **Frontend:**
  * Build `MaterialList` component inside the course page.
  * Add "Upload File" modal for doctors with drag-and-drop.

#### [P1] 4. Announcements System (DOC-06, DOC-07, STU-08)
* **Backend:**
  * `POST /api/announcements` (Doctor posts to specific course; Admin posts system-wide).
  * `GET /api/courses/:id/announcements` (Announcements for a specific course).
  * `GET /api/announcements/feed` (Returns system-wide announcements + announcements for courses the student is in).
* **Frontend:**
  * Build `AnnouncementFeed` component displaying author, date, title, and body.
  * Add "New Announcement" composer for doctors and admins.

#### [P2] 5. Student & Doctor Dashboard Summaries (STU-01, DOC-01)
* **Frontend:**
  * Build `StudentDashboard` home view displaying welcome card, enrolled courses summary, and latest announcements feed.
  * Build `DoctorDashboard` displaying assigned courses overview and recent announcements.

---

## 🔄 Why Nobody is Blocked (Independence Strategy)

1. **Shared Database Models Already Exist:**
   * Mohamed Osama doesn't have to wait for Yousef to create the User model.
   * Mohamed Ahmed doesn't have to wait for anyone to create the CourseMaterial or Announcement tables.
2. **Preset Seed Data:**
   * Mohamed Ahmed can test file uploads on `CS101` immediately because `CS101` is already seeded in the database.
   * Yousef can test student enrollment using the seeded student `student@university.edu`.
   * Mohamed Osama can test authentication directly against the seeded accounts.
3. **Clear Git Feature Branches:**
   * Each developer works on their dedicated feature branch.
   * Pull requests are opened into `main` only when a feature passes testing.

