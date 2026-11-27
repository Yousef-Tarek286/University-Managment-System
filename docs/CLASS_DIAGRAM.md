# 📐 UML Class Diagram Specification
**University Learning Management & Academic Portal**

This document provides the formal **UML Class Diagram** and relational attribute mappings for the system

---

## 1. Visual UML Class Diagram

```mermaid
classDiagram
    direction TB

    %% Enums
    class Role {
        <<enumeration>>
        STUDENT
        DOCTOR
        ADMIN
    }

    class CourseStatus {
        <<enumeration>>
        ACTIVE
        ARCHIVED
    }

    class EnrollmentStatus {
        <<enumeration>>
        ENROLLED
        DROPPED
        COMPLETED
    }

    class QuizStatus {
        <<enumeration>>
        DRAFT
        PUBLISHED
        CLOSED
    }

    class QuestionType {
        <<enumeration>>
        MCQ
        TRUE_FALSE
    }

    class AttemptStatus {
        <<enumeration>>
        IN_PROGRESS
        SUBMITTED
        GRADED
    }

    %% Classes
    class User {
        +Int id
        +String fullName
        +String email
        +String passwordHash
        +Role role
        +Boolean isActive
        +String department
        +String studentNumber
        +String employeeNumber
        +DateTime createdAt
        +DateTime updatedAt
        +login(email, password) Boolean
        +updateProfile(data) Boolean
        +changePassword(oldPass, newPass) Boolean
    }

    class Semester {
        +Int id
        +String name
        +DateTime startDate
        +DateTime endDate
        +Boolean isActive
        +Boolean registrationOpen
        +DateTime createdAt
        +DateTime updatedAt
        +activate() void
        +openRegistration() void
        +closeRegistration() void
    }

    class Course {
        +Int id
        +String courseName
        +String courseCode
        +String description
        +Int capacity
        +CourseStatus status
        +Int semesterId
        +Int doctorId
        +DateTime createdAt
        +DateTime updatedAt
        +isFull() Boolean
        +archive() void
        +assignDoctor(doctorId) void
    }

    class Enrollment {
        +Int id
        +Int studentId
        +Int courseId
        +EnrollmentStatus status
        +DateTime enrollmentDate
        +dropCourse() void
        +completeCourse() void
    }

    class CourseMaterial {
        +Int id
        +String title
        +String description
        +String fileName
        +String filePath
        +String fileType
        +Int fileSize
        +Int courseId
        +Int uploadedById
        +DateTime createdAt
        +DateTime updatedAt
        +download() FileStream
        +delete() Boolean
    }

    class Announcement {
        +Int id
        +String title
        +String content
        +Int courseId
        +Int createdById
        +DateTime createdAt
        +DateTime updatedAt
        +isSystemWide() Boolean
    }

    class Quiz {
        +Int id
        +String title
        +String description
        +Int durationMinutes
        +Float totalMarks
        +DateTime startDate
        +DateTime endDate
        +QuizStatus status
        +Int courseId
        +Int createdById
        +DateTime createdAt
        +DateTime updatedAt
        +isAvailable() Boolean
        +publish() void
        +close() void
    }

    class Question {
        +Int id
        +Int quizId
        +String questionText
        +QuestionType questionType
        +Float marks
        +Int orderIndex
        +validateAnswer(submission) Boolean
    }

    class QuestionOption {
        +Int id
        +Int questionId
        +String optionText
        +Boolean isCorrect
    }

    class QuizAttempt {
        +Int id
        +Int quizId
        +Int studentId
        +DateTime startedAt
        +DateTime submittedAt
        +Float score
        +AttemptStatus status
        +Boolean isReleased
        +calculateScore() Float
        +releaseResults() void
    }

    class StudentAnswer {
        +Int id
        +Int attemptId
        +Int questionId
        +Int selectedOptionId
        +String answerText
        +Boolean isCorrect
        +Float awardedMarks
        +evaluate() void
    }

    class Notification {
        +Int id
        +Int userId
        +String title
        +String message
        +String type
        +Int relatedEntityId
        +Boolean isRead
        +DateTime createdAt
        +markAsRead() void
    }

    %% Relationships and Multiplicities
    User "1" --> "0..*" Course : instructs
    Semester "1" --> "0..*" Course : contains
    
    User "1" --> "0..*" Enrollment : enrolls
    Course "1" --> "0..*" Enrollment : receives

    Course "1" *-- "0..*" CourseMaterial : contains
    User "1" --> "0..*" CourseMaterial : uploads

    Course "0..1" *-- "0..*" Announcement : belongs_to
    User "1" --> "0..*" Announcement : posts

    Course "1" *-- "0..*" Quiz : offers
    User "1" --> "0..*" Quiz : authors

    Quiz "1" *-- "1..*" Question : contains
    Question "1" *-- "2..*" QuestionOption : has_options

    Quiz "1" --> "0..*" QuizAttempt : tracks
    User "1" --> "0..*" QuizAttempt : undertakes

    QuizAttempt "1" *-- "1..*" StudentAnswer : records
    Question "1" --> "0..*" StudentAnswer : answers
    QuestionOption "0..1" --> "0..*" StudentAnswer : selects

    User "1" *-- "0..*" Notification : receives
```

---

## 2. Relational Attributes & Constraints Table

### 👤 `User`
| Attribute | Visibility | Data Type | Key / Constraint | Description |
| :--- | :---: | :--- | :--- | :--- |
| `id` | `+` | `Int` | **PK**, Auto-increment | Unique system identifier |
| `fullName` | `+` | `String` | Not Null | User's legal full name |
| `email` | `+` | `String` | **Unique**, Not Null | Login email address |
| `passwordHash` | `+` | `String` | Not Null | One-way bcrypt hash (60 chars) |
| `role` | `+` | `Role` | Default: `STUDENT` | Enum (`STUDENT`, `DOCTOR`, `ADMIN`) |
| `isActive` | `+` | `Boolean`| Default: `true` | Allows deactivating users |
| `department` | `+` | `String?`| Optional | E.g., "Computer Science" |
| `studentNumber` | `+` | `String?`| **Unique**, Optional | Unique student ID card number |
| `employeeNumber`| `+` | `String?`| **Unique**, Optional | Unique doctor/staff ID number |
| `createdAt` | `+` | `DateTime` | Default: `now()` | Registration audit timestamp |
| `updatedAt` | `+` | `DateTime` | Auto-updated | Profile last-modified timestamp |

---

### 📅 `Semester`
| Attribute | Visibility | Data Type | Key / Constraint | Description |
| :--- | :---: | :--- | :--- | :--- |
| `id` | `+` | `Int` | **PK**, Auto-increment | Unique semester identifier |
| `name` | `+` | `String` | Not Null | E.g. "Fall 2026", "Spring 2027" |
| `startDate` | `+` | `DateTime` | Not Null | Semester opening date |
| `endDate` | `+` | `DateTime` | Not Null | Semester closing date |
| `isActive` | `+` | `Boolean` | Default: `false` | Marks the current active term |
| `registrationOpen`| `+`| `Boolean` | Default: `false` | Controls whether registration is open |

---

### 📚 `Course`
| Attribute | Visibility | Data Type | Key / Constraint | Description |
| :--- | :---: | :--- | :--- | :--- |
| `id` | `+` | `Int` | **PK**, Auto-increment | Unique course record ID |
| `courseName` | `+` | `String` | Not Null | Title (e.g. "Software Engineering") |
| `courseCode` | `+` | `String` | **Unique**, Not Null | Catalog code (e.g. "CS301") |
| `description` | `+` | `String?` | Optional | Syllabus overview |
| `capacity` | `+` | `Int` | Default: `30` | Maximum student capacity |
| `status` | `+` | `CourseStatus`| Default: `ACTIVE`| `ACTIVE` or `ARCHIVED` |
| `semesterId` | `+` | `Int?` | **FK** $\rightarrow$ `Semester.id` | Academic semester assignment |
| `doctorId` | `+` | `Int?` | **FK** $\rightarrow$ `User.id` | Assigned instructor (`role=DOCTOR`) |

---

### 📝 `Enrollment` (Junction Entity)
| Attribute | Visibility | Data Type | Key / Constraint | Description |
| :--- | :---: | :--- | :--- | :--- |
| `id` | `+` | `Int` | **PK**, Auto-increment | Unique enrollment transaction ID |
| `studentId` | `+` | `Int` | **FK** $\rightarrow$ `User.id` | Enrolled student ID |
| `courseId` | `+` | `Int` | **FK** $\rightarrow$ `Course.id` | Registered course ID |
| `status` | `+` | `EnrollmentStatus`| Default: `ENROLLED` | `ENROLLED`, `DROPPED`, `COMPLETED` |
| `enrollmentDate`| `+`| `DateTime` | Default: `now()` | Timestamp of registration |
| *(Index)* | | | **Unique(`studentId`, `courseId`)** | Prevents duplicate enrollments |

---

### 📁 `CourseMaterial`
| Attribute | Visibility | Data Type | Key / Constraint | Description |
| :--- | :---: | :--- | :--- | :--- |
| `id` | `+` | `Int` | **PK**, Auto-increment | Unique material ID |
| `title` | `+` | `String` | Not Null | Display name (e.g. "Lecture 1: Intro") |
| `fileName` | `+` | `String` | Not Null | Actual disk/storage filename |
| `filePath` | `+` | `String` | Not Null | Storage path or cloud object key |
| `fileType` | `+` | `String` | Not Null | MIME type / extension (`pdf`, `pptx`) |
| `fileSize` | `+` | `Int` | Not Null | Size in bytes |
| `courseId` | `+` | `Int` | **FK** $\rightarrow$ `Course.id` | Associated course |
| `uploadedById`| `+` | `Int` | **FK** $\rightarrow$ `User.id` | Uploading instructor |

---

### 📢 `Announcement`
| Attribute | Visibility | Data Type | Key / Constraint | Description |
| :--- | :---: | :--- | :--- | :--- |
| `id` | `+` | `Int` | **PK**, Auto-increment | Unique announcement ID |
| `title` | `+` | `String` | Not Null | Headline |
| `content` | `+` | `String` | Not Null | Full announcement text |
| `courseId` | `+` | `Int?` | **FK** $\rightarrow$ `Course.id` (Nullable)| Null = University broadcast |
| `createdById` | `+` | `Int` | **FK** $\rightarrow$ `User.id` | Author user ID |

---

### ⏱️ Assessment Cluster (`Quiz`, `Question`, `Attempt`)

#### `Quiz`
| Attribute | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | **PK** | Unique quiz ID |
| `title` | `String` | Not Null | Quiz name (e.g. "Midterm Quiz 1") |
| `durationMinutes` | `Int` | Not Null | Countdown timer limit in minutes |
| `totalMarks` | `Float` | Default: `100` | Sum of all question marks |
| `startDate` | `DateTime` | Not Null | When students can start taking it |
| `endDate` | `DateTime` | Not Null | Hard submission deadline |
| `status` | `QuizStatus` | Default: `DRAFT` | `DRAFT`, `PUBLISHED`, `CLOSED` |
| `courseId` | `Int` | **FK** $\rightarrow$ `Course.id` | Associated course |
| `createdById` | `Int` | **FK** $\rightarrow$ `User.id` | Author doctor |

#### `Question`
| Attribute | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | **PK** | Unique question ID |
| `quizId` | `Int` | **FK** $\rightarrow$ `Quiz.id` | Parent quiz |
| `questionText` | `String` | Not Null | Prompt (e.g. "What is an index?") |
| `questionType` | `QuestionType` | Default: `MCQ` | `MCQ` or `TRUE_FALSE` |
| `marks` | `Float` | Default: `1` | Point weight for this question |
| `orderIndex` | `Int` | Default: `0` | Question display sequence |

#### `QuestionOption`
| Attribute | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | **PK** | Unique option ID |
| `questionId` | `Int` | **FK** $\rightarrow$ `Question.id` | Parent question |
| `optionText` | `String` | Not Null | Choice text |
| `isCorrect` | `Boolean` | Default: `false` | True for the correct answer |

#### `QuizAttempt`
| Attribute | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | **PK** | Unique attempt record |
| `quizId` | `Int` | **FK** $\rightarrow$ `Quiz.id` | Attempted assessment |
| `studentId` | `Int` | **FK** $\rightarrow$ `User.id` | Student taking the quiz |
| `startedAt` | `DateTime` | Default: `now()` | Attempt start timestamp |
| `submittedAt` | `DateTime?` | Optional | Completion timestamp |
| `score` | `Float?` | Optional | Auto-calculated score |
| `status` | `AttemptStatus`| Default: `IN_PROGRESS` | `IN_PROGRESS`, `SUBMITTED`, `GRADED` |
| `isReleased` | `Boolean` | Default: `false` | When true, student can view results |

#### `StudentAnswer`
| Attribute | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | **PK** | Answer record ID |
| `attemptId` | `Int` | **FK** $\rightarrow$ `QuizAttempt.id` | Parent attempt |
| `questionId` | `Int` | **FK** $\rightarrow$ `Question.id` | Question answered |
| `selectedOptionId`| `Int?` | **FK** $\rightarrow$ `QuestionOption.id`| Selected MCQ choice |
| `isCorrect` | `Boolean` | Default: `false` | Result of auto-grading |
| `awardedMarks` | `Float` | Default: `0` | Calculated points earned |
| *(Index)* | | **Unique(`attemptId`, `questionId`)** | One answer per question per attempt |

---

## 3. Relationship Multiplicities Summary

| Origin Entity | Multiplicity | Target Entity | Relationship Type | Meaning |
| :--- | :---: | :--- | :---: | :--- |
| `Semester` | `1` to `0..*` | `Course` | One-to-Many | A semester offers 0 or more courses. |
| `User (Doctor)` | `1` to `0..*` | `Course` | One-to-Many | A doctor instructs 0 or more courses. |
| `User (Student)` | `1` to `0..*` | `Enrollment` | One-to-Many | A student has multiple enrollment records. |
| `Course` | `1` to `0..*` | `Enrollment` | One-to-Many | A course has multiple enrolled students. |
| `Course` | `1` to `0..*` | `CourseMaterial`| Composition (`*--`) | Materials cannot exist without a course. |
| `Course` | `1` to `0..*` | `Quiz` | Composition (`*--`) | Quizzes belong strictly to a course. |
| `Quiz` | `1` to `1..*` | `Question` | Composition (`*--`) | A quiz contains 1 or more questions. |
| `Question` | `1` to `2..*` | `QuestionOption`| Composition (`*--`) | An MCQ question has 2 or more options. |
| `QuizAttempt` | `1` to `1..*` | `StudentAnswer` | Composition (`*--`) | An attempt records answers for questions. |
| `User` | `1` to `0..*` | `Notification` | Composition (`*--`) | Notifications are tied to a recipient user. |

