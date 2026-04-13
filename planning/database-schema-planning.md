# DOTr-HRDD Learning Management Portal - Database Schema Planning

## Overview

This document outlines the complete database schema requirements for the DOTr-HRDD Learning Management Portal based on frontend architecture, user workflows, and data models. The system supports four user roles (Employee, Supervisor, HRDD Admin, Signatory) managing training nominations, evaluations, memo directives, travel orders, and post-training requirements.

---

## System Architecture Summary

### User Roles & Portals
1. **Employee** - Browse trainings, submit nominations, request MIS assistance, submit job analysis forms
2. **Supervisor** - Review and approve/reject employee nominations
3. **HRDD Admin** - Manage nominations, evaluations, memo directives, LTO database, training programs, employee accounts
4. **Signatory** - Review, sign, or disapprove batches of nomination memos; generate Local Travel Orders

### Core Business Workflow
1. **Training Registration** → Browse trainings → Check qualification → Register via nomination form
2. **Seminar Confirmation Sheet (SCS)** → Auto-generate form → Preview → Submit to O/S/O
3. **O/S/O Approval** → Approve (HRDD evaluation, generate travel order) OR Disapprove (notify pax)
4. **Memo Directive / LTO Process** → Generate MO (in-house/out-of-house) → Submit for approval → Notify pax
5. **LTO Process** → Notify pax to submit TORF → Fill TORF form → Submit for approval → Transmit to HRDD
6. **Post-Training Requirements** → Separate process → Update database

---

## Database Tables

### 1. `offices` - Office/Division Registry

**Purpose:** Central registry of all offices, divisions, and units within the organization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `name` | TEXT | NOT NULL, UNIQUE | Office/division name (e.g., "Human Resource Development Division") |
| `office_head` | TEXT | NULL | Name of the office head/supervisor |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_offices_name` on `name` (unique constraint)

**Sample Data:**
- "Human Resource Development Division" - Head: "Josefa B. Neri"
- "Information Systems and Security Division" - Head: NULL
- "Administrative Service" - Head: "Lourdes T. Aquino"
- "Office of the Assistant Secretary for Administration" - Head: "Marvin P. Hilario"
- "Planning Division" - Head: "Catherine M. Lim"

---

### 2. `users` - User Accounts & Profiles

**Purpose:** Stores all user account information including employees, supervisors, HRDD admins, and signatories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `username` | TEXT | NOT NULL, UNIQUE | Login username |
| `full_name` | TEXT | NOT NULL | Complete name of the user |
| `email` | TEXT | UNIQUE, NULL | Email address |
| `role` | TEXT | NOT NULL, CHECK | User role: 'employee', 'supervisor', 'hrdd_admin', 'signatory' |
| `office_id` | INTEGER | FK → offices(id), SET NULL, NULL | User's primary office |
| `position_title` | TEXT | NULL | Job position/title |
| `employee_id_number` | TEXT | UNIQUE, NULL | Official employee ID number |
| `supervisor_name` | TEXT | NULL | Name of direct supervisor |
| `employment_status` | TEXT | NULL | Status: 'permanent', 'cos', 'jo', 'casual', 'coterminous' |
| `salary_grade` | TEXT | NULL | Salary grade (e.g., "SG-18", "11") |
| `service_length` | TEXT | NULL | Years of service (e.g., "3 years, 2 months") |
| `contact_number` | TEXT | NULL | Phone/mobile number |
| `gender` | TEXT | NULL | Gender identification |
| `date_hired` | TEXT | NULL | Date of hiring (ISO format) |
| `is_active` | INTEGER | NOT NULL, DEFAULT 1, CHECK | Active status: 0 or 1 |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_users_username` on `username` (unique constraint)
- `idx_users_email` on `email` (unique constraint)
- `idx_users_employee_id` on `employee_id_number` (unique constraint)
- `idx_users_office_id` on `office_id`
- `idx_users_role` on `role`
- `idx_users_is_active` on `is_active`

**Relationships:**
- One-to-many with `applications` (user can submit multiple nominations)
- One-to-many with `job_analysis_forms` (user can submit multiple JAFs)
- One-to-one with `auth_accounts` (authentication credentials)

---

### 3. `auth_accounts` - Authentication Credentials

**Purpose:** Stores authentication credentials separately from user profile data for security.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `user_id` | INTEGER | NOT NULL, UNIQUE, FK → users(id), CASCADE | Reference to user account |
| `username` | TEXT | NOT NULL, UNIQUE | Login username (denormalized for auth lookup) |
| `password_hash` | TEXT | NOT NULL | Hashed password (bcrypt/argon2) |
| `password_hint` | TEXT | NULL | Password hint for demo/recovery |
| `last_login` | TEXT | NULL | Last successful login timestamp |
| `failed_attempts` | INTEGER | NOT NULL, DEFAULT 0 | Failed login attempts counter |
| `locked_until` | TEXT | NULL | Account lockout expiration timestamp |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- `idx_auth_username` on `username` (unique constraint, fast auth lookup)
- `idx_auth_user_id` on `user_id` (unique constraint)

**Security Notes:**
- Passwords must be hashed using bcrypt or argon2
- Implement account lockout after repeated failed attempts
- Session tokens stored separately in client-side localStorage

---

### 4. `training_programs` - Training Catalog

**Purpose:** Master catalog of all training programs (in-house, out-of-house, self-paced).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `code` | TEXT | NOT NULL, UNIQUE | Program code (e.g., "TR-001", "UX-INHOUSE-001") |
| `title` | TEXT | NOT NULL, UNIQUE | Training program title |
| `catalog_type` | TEXT | NOT NULL, CHECK | Type: 'in-house', 'out-of-house', 'self-paced' |
| `competency_type` | TEXT | CHECK | Competency category: 'core', 'functional', 'leadership' |
| `level` | TEXT | NULL | Difficulty/target level |
| `duration_text` | TEXT | NULL | Duration description (e.g., "3 days", "Self-Paced") |
| `description` | TEXT | NOT NULL | Full program description |
| `outline` | TEXT | NULL | Course outline/syllabus (HTML or markdown) |
| `target_audience` | TEXT | NULL | Target participant audience |
| `service_provider` | TEXT | NULL | Training provider name |
| `delivery_mode` | TEXT | NULL | Delivery: 'Virtual Training', 'In-Person', 'Online Learning', 'LMS' |
| `cost_text` | TEXT | NULL | Cost description (e.g., "Free", "₱5,000") |
| `contact_person` | TEXT | NULL | Program contact person |
| `deadline_text` | TEXT | NULL | Registration deadline text |
| `external_link` | TEXT | NULL | External registration/course URL |
| `image_url` | TEXT | NULL | Program image/thumbnail URL |
| `is_active` | INTEGER | NOT NULL, DEFAULT 1, CHECK | Active status: 0 or 1 |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_programs_code` on `code` (unique constraint)
- `idx_programs_title` on `title` (unique constraint)
- `idx_programs_catalog_type` on `catalog_type`
- `idx_programs_competency_type` on `competency_type`
- `idx_programs_is_active` on `is_active`

**Relationships:**
- One-to-many with `training_sessions` (program can have multiple sessions)
- One-to-many with `applications` (nominations reference programs)
- One-to-one with `self_paced_courses` (for self-paced type)

---

### 5. `training_sessions` - Specific Training Sessions/Schedules

**Purpose:** Individual session instances for training programs with specific dates, venues, and providers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `program_id` | INTEGER | NOT NULL, FK → training_programs(id), CASCADE | Reference to training program |
| `start_date` | TEXT | NULL | Session start date (ISO format) |
| `end_date` | TEXT | NULL | Session end date (ISO format) |
| `session_date_text` | TEXT | NULL | Human-readable date range |
| `venue` | TEXT | NULL | Training venue/location |
| `provider_name` | TEXT | NULL | Training provider/facilitator name |
| `memo_date` | TEXT | NULL | Date for memo directive |
| `memo_time_in` | TEXT | NULL | Memo time-in (e.g., "09:00") |
| `memo_time_out` | TEXT | NULL | Memo time-out (e.g., "17:00") |
| `max_participants` | INTEGER | NULL | Maximum capacity (optional) |
| `current_participants` | INTEGER | NOT NULL, DEFAULT 0 | Current enrollment count |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- `idx_sessions_program_id` on `program_id`
- `idx_sessions_start_date` on `start_date`
- `idx_sessions_venue` on `venue`
- `idx_sessions_unique` on `(program_id, session_date_text, venue)` (unique constraint)

**Relationships:**
- Many-to-one with `training_programs`
- One-to-many with `applications` (nominations reference specific sessions)

**Business Logic:**
- Unique constraint prevents duplicate sessions for same program/date/venue
- `current_participants` should be calculated from approved applications

---

### 6. `qualification_criteria` - Training Eligibility Rules

**Purpose:** Defines eligibility requirements for each training program (office, salary grade, employment status filters).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `program_id` | INTEGER | NOT NULL, FK → training_programs(id), CASCADE | Reference to training program |
| `target_level` | TEXT | NULL | Target employee level/seniority |
| `description` | TEXT | NULL | Human-readable criteria description |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- `idx_criteria_program_id` on `program_id`

**Relationships:**
- Many-to-one with `training_programs`
- One-to-many with `qualification_criteria_offices` (junction table)
- One-to-many with `qualification_criteria_salary_grades` (junction table)
- One-to-many with `qualification_criteria_employment_statuses` (junction table)

---

### 7. `qualification_criteria_offices` - Target Offices for Training

**Purpose:** Junction table linking qualification criteria to eligible offices.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `criteria_id` | INTEGER | NOT NULL, FK → qualification_criteria(id), CASCADE | Reference to criteria |
| `office_id` | INTEGER | NOT NULL, FK → offices(id), CASCADE | Reference to office |

**Indexes:**
- `idx_criteria_offices_unique` on `(criteria_id, office_id)` (unique constraint)
- `idx_criteria_offices_criteria` on `criteria_id`
- `idx_criteria_offices_office` on `office_id`

---

### 8. `qualification_criteria_salary_grades` - Target Salary Grades for Training

**Purpose:** Junction table linking qualification criteria to eligible salary grades.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `criteria_id` | INTEGER | NOT NULL, FK → qualification_criteria(id), CASCADE | Reference to criteria |
| `salary_grade` | TEXT | NOT NULL | Salary grade value (e.g., "SG-18", "11") |

**Indexes:**
- `idx_criteria_sg_unique` on `(criteria_id, salary_grade)` (unique constraint)
- `idx_criteria_sg_criteria` on `criteria_id`

---

### 9. `qualification_criteria_employment_statuses` - Target Employment Statuses for Training

**Purpose:** Junction table linking qualification criteria to eligible employment statuses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `criteria_id` | INTEGER | NOT NULL, FK → qualification_criteria(id), CASCADE | Reference to criteria |
| `employment_status` | TEXT | NOT NULL | Status: 'permanent', 'cos', 'jo', 'casual', 'coterminous' |

**Indexes:**
- `idx_criteria_es_unique` on `(criteria_id, employment_status)` (unique constraint)
- `idx_criteria_es_criteria` on `criteria_id`

---

### 10. `applications` - Nominations & Applications (Core Table)

**Purpose:** Central table for all training nominations, job analysis forms, and related applications. Tracks complete lifecycle from submission to final approval.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `application_number` | TEXT | NOT NULL, UNIQUE | Unique application number (e.g., "APP-2026-0001") |
| `applicant_user_id` | INTEGER | FK → users(id), SET NULL, NULL | Reference to applicant user |
| `office_id` | INTEGER | FK → offices(id), SET NULL, NULL | Applicant's office |
| `program_id` | INTEGER | FK → training_programs(id), SET NULL, NULL | Reference to training program |
| `session_id` | INTEGER | FK → training_sessions(id), SET NULL, NULL | Reference to specific session |
| `form_type` | TEXT | NOT NULL, DEFAULT 'nomination', CHECK | Type: 'nomination', 'jaf' (job analysis form) |
| `status` | TEXT | NOT NULL, CHECK | Status: 'Pending', 'Supervisor Approved', 'Finalized', 'Pending Signatory', 'Approved', 'Rejected', 'Signed' |
| `title` | TEXT | NOT NULL | Application/training title |
| `competency_type` | TEXT | CHECK | Competency: 'core', 'functional', 'leadership' |
| `date_submitted` | TEXT | NULL | Date application submitted |
| `date_filing` | TEXT | NULL | Date of filing |
| `date_course` | TEXT | NULL | Training/course date |
| `venue` | TEXT | NULL | Training venue |
| `applicant_name` | TEXT | NOT NULL | Full name of applicant |
| `applicant_username` | TEXT | NULL | Username for reference |
| `employee_id_number` | TEXT | NULL | Employee ID number |
| `email` | TEXT | NULL | Applicant email |
| `position_title` | TEXT | NULL | Applicant's position |
| `supervisor_name` | TEXT | NULL | Applicant's supervisor |
| `office_name` | TEXT | NOT NULL | Office name (denormalized for reporting) |
| `office_head` | TEXT | NULL | Office head name |
| `date_hired` | TEXT | NULL | Applicant's hire date |
| `employment_status` | TEXT | NULL | Employment status |
| `salary_grade` | TEXT | NULL | Salary grade |
| `service_length` | TEXT | NULL | Years of service |
| `contact_number` | TEXT | NULL | Contact number |
| `gender` | TEXT | NULL | Gender |
| `oic_name` | TEXT | NULL | Officer-in-charge name (if applicable) |
| `alternate_participant_json` | TEXT | NULL | JSON string of alternate participant info (ASP) |
| `justification` | TEXT | NULL | Nomination justification text |
| `user_signature_data_url` | TEXT | NULL | User's signature image (data URL) |
| `admin_signature_data_url` | TEXT | NULL | Admin/signatory signature image (data URL) |
| `memo_html` | TEXT | NULL | Generated memo directive HTML |
| `memo_pdf_data_url` | TEXT | NULL | Memo PDF data URL (if generated) |
| `memo_mode` | TEXT | NULL | Memo mode: 'In-Person', 'Virtual Training', 'Online Learning' |
| `memo_provider` | TEXT | NULL | Training provider for memo |
| `memo_date` | TEXT | NULL | Memo date |
| `memo_time_in` | TEXT | NULL | Memo time-in |
| `memo_time_out` | TEXT | NULL | Memo time-out |
| `is_read` | INTEGER | NOT NULL, DEFAULT 0, CHECK | Read status by user: 0 or 1 |
| `is_admin_read` | INTEGER | NOT NULL, DEFAULT 0, CHECK | Read status by admin: 0 or 1 |
| `scs_id` | INTEGER | FK → seminar_confirmation_sheets(id), NULL, NULL | Linked SCS document |
| `memo_directive_id` | INTEGER | FK → memo_directives(id), NULL, NULL | Linked memo directive |
| `lto_id` | INTEGER | FK → local_travel_orders(id), NULL, NULL | Linked LTO |
| `torf_id` | INTEGER | FK → travel_order_request_forms(id), NULL, NULL | Linked TORF |
| `hrdd_evaluation_id` | INTEGER | FK → hrdd_evaluations(id), NULL, NULL | Linked HRDD evaluation |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_applications_number` on `application_number` (unique constraint)
- `idx_applications_status` on `status`
- `idx_applications_title` on `title`
- `idx_applications_applicant_user_id` on `applicant_user_id`
- `idx_applications_office_id` on `office_id`
- `idx_applications_program_id` on `program_id`
- `idx_applications_session_id` on `session_id`
- `idx_applications_form_type_status` on `(form_type, status)` (composite)
- `idx_applications_date_submitted` on `date_submitted`
- `idx_applications_date_course` on `date_course`

**Relationships:**
- Many-to-one with `users` (applicant)
- Many-to-one with `offices`
- Many-to-one with `training_programs`
- Many-to-one with `training_sessions`
- One-to-one with `application_gedsi`
- One-to-one with `application_social_inclusion`
- One-to-many with `application_messages`
- One-to-one with `seminar_confirmation_sheets` (via scs_id)
- One-to-one with `memo_directives` (via memo_directive_id)
- One-to-one with `local_travel_orders` (via lto_id)
- One-to-one with `travel_order_request_forms` (via torf_id)
- One-to-one with `hrdd_evaluations` (via hrdd_evaluation_id)

**Status Workflow:**
```
Pending → Supervisor Approved → Finalized → Pending Signatory → Approved → Signed
                                                        ↓
                                                    Rejected (at any stage)
```

---

### 11. `application_messages` - Communication Thread on Applications

**Purpose:** Message thread/communication log for each application (HRDD remarks, supervisor comments, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `application_id` | INTEGER | NOT NULL, FK → applications(id), CASCADE | Reference to application |
| `sender_name` | TEXT | NOT NULL | Name of message sender |
| `sender_user_id` | INTEGER | FK → users(id), NULL, NULL | Reference to sender user (optional) |
| `message_text` | TEXT | NOT NULL | Message content |
| `is_read` | INTEGER | NOT NULL, DEFAULT 0, CHECK | Read status: 0 or 1 |
| `created_at` | TEXT | NOT NULL | Message timestamp |

**Indexes:**
- `idx_messages_application_id` on `application_id`
- `idx_messages_created_at` on `created_at`

**Relationships:**
- Many-to-one with `applications`
- Many-to-one with `users` (sender, optional)

---

### 12. `application_gedsi` - GEDSI Questionnaire Responses

**Purpose:** Gender Equality, Disability, Social Inclusion (GEDSI) questionnaire responses (8 yes/no questions).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `application_id` | INTEGER | PRIMARY KEY, FK → applications(id), CASCADE | Reference to application |
| `g1` | TEXT | CHECK | Question 1 answer: 'yes' or 'no' |
| `g2` | TEXT | CHECK | Question 2 answer: 'yes' or 'no' |
| `g3` | TEXT | CHECK | Question 3 answer: 'yes' or 'no' |
| `g4` | TEXT | CHECK | Question 4 answer: 'yes' or 'no' |
| `g5` | TEXT | CHECK | Question 5 answer: 'yes' or 'no' |
| `g6` | TEXT | CHECK | Question 6 answer: 'yes' or 'no' |
| `g7` | TEXT | CHECK | Question 7 answer: 'yes' or 'no' |
| `g8` | TEXT | CHECK | Question 8 answer: 'yes' or 'no' |

**Relationships:**
- One-to-one with `applications` (1:1 relationship, application is parent)

---

### 13. `application_social_inclusion` - Social Inclusion Data

**Purpose:** Additional social inclusion questionnaire responses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `application_id` | INTEGER | PRIMARY KEY, FK → applications(id), CASCADE | Reference to application |
| `s1` | TEXT | CHECK | Social inclusion question 1: 'yes' or 'no' |
| `s2` | TEXT | NULL | Social inclusion question 2: free text |

**Relationships:**
- One-to-one with `applications` (1:1 relationship, application is parent)

---

### 14. `seminar_confirmation_sheets` - SCS Documents

**Purpose:** Seminar Confirmation Sheet documents auto-generated from approved nominations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `scs_number` | TEXT | UNIQUE, NULL | SCS reference number |
| `application_id` | INTEGER | FK → applications(id), NULL, NULL | Source application |
| `program_id` | INTEGER | FK → training_programs(id), NULL, NULL | Training program |
| `session_id` | INTEGER | FK → training_sessions(id), NULL, NULL | Training session |
| `training_title` | TEXT | NOT NULL | Training title |
| `training_date` | TEXT | NOT NULL | Training date |
| `training_time_in` | TEXT | NULL | Training start time |
| `training_time_out` | TEXT | NULL | Training end time |
| `provider` | TEXT | NOT NULL | Training provider name |
| `venue` | TEXT | NOT NULL | Training venue |
| `status` | TEXT | NOT NULL, CHECK | Status: 'pending', 'approved', 'disapproved' |
| `submitted_by` | INTEGER | FK → users(id), NULL, NULL | User who submitted |
| `submitted_at` | TEXT | NULL | Submission timestamp |
| `approved_by` | TEXT | NULL | Approver name |
| `approved_at` | TEXT | NULL | Approval timestamp |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_scs_number` on `scs_number` (unique constraint)
- `idx_scs_application_id` on `application_id`
- `idx_scs_program_id` on `program_id`
- `idx_scs_status` on `status`

**Relationships:**
- Many-to-one with `applications`
- Many-to-one with `training_programs`
- Many-to-one with `training_sessions`
- One-to-many with `scs_participants`

---

### 15. `scs_participants` - SCS Participant List

**Purpose:** Individual participants listed on a Seminar Confirmation Sheet.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `scs_id` | INTEGER | NOT NULL, FK → seminar_confirmation_sheets(id), CASCADE | Reference to SCS |
| `full_name` | TEXT | NOT NULL | Participant full name |
| `id_number` | TEXT | NOT NULL | Employee ID number |
| `salary_grade` | TEXT | NOT NULL | Salary grade |
| `office` | TEXT | NOT NULL | Office/division |
| `position` | TEXT | NOT NULL | Position title |
| `contact_number` | TEXT | NULL | Contact number |
| `status` | TEXT | NOT NULL, CHECK | Status: 'pending', 'confirmed', 'declined' |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- `idx_scs_pax_scs_id` on `scs_id`
- `idx_scs_pax_id_number` on `id_number`

**Relationships:**
- Many-to-one with `seminar_confirmation_sheets`

---

### 16. `memo_directives` - Memo Directive Documents

**Purpose:** Memo Directive documents (both in-house and out-of-house) generated from approved nominations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `memo_number` | TEXT | UNIQUE, NULL | Memo reference number |
| `application_id` | INTEGER | FK → applications(id), NULL, NULL | Source application |
| `memo_type` | TEXT | NOT NULL, CHECK | Type: 'in-house', 'out-of-house' |
| `participant_name` | TEXT | NOT NULL | Participant full name |
| `participant_position` | TEXT | NOT NULL | Participant position |
| `participant_office` | TEXT | NOT NULL | Participant office |
| `training_title` | TEXT | NOT NULL | Training title |
| `training_date` | TEXT | NOT NULL | Training date |
| `training_time_in` | TEXT | NULL | Training start time |
| `training_time_out` | TEXT | NULL | Training end time |
| `provider` | TEXT | NOT NULL | Training provider |
| `venue` | TEXT | NOT NULL | Training venue |
| `objectives` | TEXT | NOT NULL | Memo objectives |
| `requirements` | TEXT | NULL | Requirements as JSON array |
| `submission_deadline` | TEXT | NULL | Submission deadline |
| `memo_date` | TEXT | NOT NULL | Memo date |
| `signature_data_url` | TEXT | NULL | Signature image (data URL) |
| `signed_by` | TEXT | NULL | Signatory name |
| `signed_date` | TEXT | NULL | Date signed |
| `status` | TEXT | NOT NULL, CHECK | Status: 'pending', 'approved', 'disapproved', 'signed' |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_memo_number` on `memo_number` (unique constraint)
- `idx_memo_application_id` on `application_id`
- `idx_memo_type` on `memo_type`
- `idx_memo_status` on `status`
- `idx_memo_date` on `memo_date`

**Relationships:**
- Many-to-one with `applications`
- One-to-one with `local_travel_orders`

---

### 17. `travel_order_request_forms` - TORF Documents

**Purpose:** Travel Order Request Form documents submitted by participants for LTO processing.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `memo_directive_id` | INTEGER | NOT NULL, FK → memo_directives(id), CASCADE | Reference to memo directive |
| `participant_name` | TEXT | NOT NULL | Participant full name |
| `participant_position` | TEXT | NOT NULL | Participant position |
| `participant_office` | TEXT | NOT NULL | Participant office |
| `employee_id` | TEXT | NOT NULL | Employee ID number |
| `salary_grade` | TEXT | NOT NULL | Salary grade |
| `purpose_of_travel` | TEXT | NOT NULL | Purpose of travel description |
| `destination` | TEXT | NOT NULL | Travel destination |
| `departure_date` | TEXT | NOT NULL | Departure date |
| `return_date` | TEXT | NOT NULL | Return date |
| `estimated_expenses` | TEXT | NULL | Estimated expenses description |
| `transportation_mode` | TEXT | NULL | Mode of transportation |
| `accommodation_needed` | INTEGER | NOT NULL, DEFAULT 0, CHECK | Accommodation required: 0 or 1 |
| `status` | TEXT | NOT NULL, CHECK | Status: 'pending', 'approved', 'disapproved' |
| `approved_by` | TEXT | NULL | Approver name |
| `approval_date` | TEXT | NULL | Approval date |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_torf_memo_id` on `memo_directive_id`
- `idx_torf_employee_id` on `employee_id`
- `idx_torf_status` on `status`

**Relationships:**
- Many-to-one with `memo_directives`
- One-to-one with `local_travel_orders`

---

### 18. `local_travel_orders` - LTO Documents

**Purpose:** Local Travel Order documents generated from approved TORFs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `lto_number` | TEXT | UNIQUE, NULL | LTO reference number |
| `memo_directive_id` | INTEGER | NOT NULL, FK → memo_directives(id), CASCADE | Reference to memo directive |
| `torf_id` | INTEGER | FK → travel_order_request_forms(id), NULL, NULL | Reference to TORF |
| `application_id` | INTEGER | FK → applications(id), NULL, NULL | Source application |
| `participant_name` | TEXT | NOT NULL | Participant full name |
| `participant_position` | TEXT | NOT NULL | Participant position |
| `participant_office` | TEXT | NOT NULL | Participant office |
| `training_title` | TEXT | NOT NULL | Training title |
| `training_date` | TEXT | NOT NULL | Training date |
| `venue` | TEXT | NOT NULL | Training venue |
| `torf_submitted` | INTEGER | NOT NULL, DEFAULT 0, CHECK | TORF submitted: 0 or 1 |
| `torf_approved` | INTEGER | NOT NULL, DEFAULT 0, CHECK | TORF approved: 0 or 1 |
| `status` | TEXT | NOT NULL, CHECK | Status: 'pending', 'approved', 'disapproved', 'generated' |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_lto_number` on `lto_number` (unique constraint)
- `idx_lto_memo_id` on `memo_directive_id`
- `idx_lto_torf_id` on `torf_id`
- `idx_lto_application_id` on `application_id`
- `idx_lto_status` on `status`

**Relationships:**
- Many-to-one with `memo_directives`
- Many-to-one with `travel_order_request_forms`
- Many-to-one with `applications`

---

### 19. `hrdd_evaluations` - HRDD Evaluation Records

**Purpose:** HRDD evaluation records for nominations (qualification review, document completeness, budget check).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `application_id` | INTEGER | NOT NULL, FK → applications(id), CASCADE | Reference to application |
| `evaluator_name` | TEXT | NOT NULL | Evaluator name |
| `evaluator_user_id` | INTEGER | FK → users(id), NULL, NULL | Reference to evaluator user |
| `evaluation_date` | TEXT | NOT NULL | Evaluation date |
| `qualification_review` | TEXT | NOT NULL, CHECK | Review result: 'passed' or 'failed' |
| `documents_complete` | INTEGER | NOT NULL, CHECK | Documents complete: 0 or 1 |
| `budget_available` | INTEGER | NOT NULL, CHECK | Budget available: 0 or 1 |
| `remarks` | TEXT | NULL | Evaluation remarks/notes |
| `status` | TEXT | NOT NULL, CHECK | Status: 'pending', 'passed', 'failed' |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- `idx_evaluations_application_id` on `application_id`
- `idx_evaluations_status` on `status`
- `idx_evaluations_date` on `evaluation_date`

**Relationships:**
- Many-to-one with `applications`
- Many-to-one with `users` (evaluator)

---

### 20. `post_training_requirements` - Post-Training Checklist

**Purpose:** Post-training requirements tracking (separate process after training completion).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `application_id` | INTEGER | NOT NULL, FK → applications(id), CASCADE | Reference to application |
| `training_title` | TEXT | NOT NULL | Training title |
| `participant_name` | TEXT | NOT NULL | Participant name |
| `completion_date` | TEXT | NULL | Overall completion date |
| `status` | TEXT | NOT NULL, CHECK | Status: 'pending', 'completed', 'not_applicable' |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_post_training_application_id` on `application_id`
- `idx_post_training_status` on `status`

**Relationships:**
- Many-to-one with `applications`
- One-to-many with `post_training_items`

---

### 21. `post_training_items` - Individual Post-Training Requirement Items

**Purpose:** Individual checklist items within post-training requirements.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `post_training_id` | INTEGER | NOT NULL, FK → post_training_requirements(id), CASCADE | Reference to post-training requirement |
| `item` | TEXT | NOT NULL | Requirement item name |
| `description` | TEXT | NOT NULL | Item description |
| `completed` | INTEGER | NOT NULL, DEFAULT 0, CHECK | Completion status: 0 or 1 |
| `completed_date` | TEXT | NULL | Date item completed |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- `idx_post_items_post_training_id` on `post_training_id`

**Relationships:**
- Many-to-one with `post_training_requirements`

---

### 22. `job_analysis_forms` - Job Analysis Form Submissions

**Purpose:** Job Analysis Form (JAF) submissions for competency mapping and succession planning.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `form_number` | TEXT | NOT NULL, UNIQUE | Unique form number (e.g., "JAF-2026-0001") |
| `submitter_user_id` | INTEGER | FK → users(id), SET NULL, NULL | Reference to submitter |
| `office_id` | INTEGER | FK → offices(id), SET NULL, NULL | Submitter's office |
| `fullname` | TEXT | NOT NULL | Full name of submitter |
| `position_title` | TEXT | NULL | Position title |
| `office_name` | TEXT | NULL | Office/division name |
| `section_name` | TEXT | NULL | Section/unit name |
| `alternate_position` | TEXT | NULL | Alternate position |
| `purpose` | TEXT | NULL | Job purpose statement |
| `main_duties` | TEXT | NULL | Main duties description |
| `tools_and_equipment` | TEXT | NULL | Tools and equipment used |
| `challenges` | TEXT | NULL | Challenges faced |
| `comments` | TEXT | NULL | Additional comments |
| `signature_data_url` | TEXT | NULL | Signature image (data URL) |
| `date_submitted` | TEXT | NULL | Submission date |
| `is_read` | INTEGER | NOT NULL, DEFAULT 0, CHECK | Read status: 0 or 1 |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_jaf_form_number` on `form_number` (unique constraint)
- `idx_jaf_submitter_user_id` on `submitter_user_id`
- `idx_jaf_office_id` on `office_id`
- `idx_jaf_date_submitted` on `date_submitted`

**Relationships:**
- Many-to-one with `users` (submitter)
- Many-to-one with `offices`
- One-to-many with `job_analysis_secondary_duties`
- One-to-many with `job_analysis_skills`
- One-to-many with `application_messages` (JAF can have messages too)

---

### 23. `job_analysis_secondary_duties` - JAF Secondary Duties

**Purpose:** Secondary duties list for Job Analysis Forms.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `job_analysis_form_id` | INTEGER | NOT NULL, FK → job_analysis_forms(id), CASCADE | Reference to JAF |
| `duty_text` | TEXT | NOT NULL | Duty description |
| `frequency_text` | TEXT | NULL | Frequency (e.g., "Daily", "Weekly") |
| `sort_order` | INTEGER | NOT NULL, DEFAULT 0 | Display order |

**Indexes:**
- `idx_jaf_duties_form_id` on `job_analysis_form_id`
- `idx_jaf_duties_sort_order` on `(job_analysis_form_id, sort_order)`

**Relationships:**
- Many-to-one with `job_analysis_forms`

---

### 24. `job_analysis_skills` - JAF Skills Inventory

**Purpose:** Skills inventory for Job Analysis Forms.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `job_analysis_form_id` | INTEGER | NOT NULL, FK → job_analysis_forms(id), CASCADE | Reference to JAF |
| `skill_name` | TEXT | NOT NULL | Skill name |
| `level_text` | TEXT | NULL | Proficiency level (e.g., "Beginner", "Intermediate", "Advanced") |
| `sort_order` | INTEGER | NOT NULL, DEFAULT 0 | Display order |

**Indexes:**
- `idx_jaf_skills_form_id` on `job_analysis_form_id`
- `idx_jaf_skills_sort_order` on `(job_analysis_form_id, sort_order)`

**Relationships:**
- Many-to-one with `job_analysis_forms`

---

### 25. `self_paced_courses` - Self-Paced Course Catalog

**Purpose:** Extended catalog data for self-paced courses (instructor info, outcomes, syllabus).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `program_id` | INTEGER | UNIQUE, FK → training_programs(id), SET NULL, NULL | Reference to training program |
| `slug` | TEXT | NOT NULL, UNIQUE | URL-friendly slug |
| `title` | TEXT | NOT NULL, UNIQUE | Course title |
| `category` | TEXT | NOT NULL | Course category |
| `level` | TEXT | NOT NULL | Difficulty level |
| `duration_text` | TEXT | NOT NULL | Duration description |
| `rating` | REAL | NOT NULL | Average rating (e.g., 4.5) |
| `reviews_text` | TEXT | NOT NULL | Review count text |
| `learners_text` | TEXT | NOT NULL | Learner count text |
| `price_text` | TEXT | NOT NULL | Price description |
| `badge` | TEXT | NULL | Badge/label (e.g., "Bestseller") |
| `image_url` | TEXT | NULL | Course image URL |
| `external_link` | TEXT | NULL | External course link |
| `instructor_name` | TEXT | NOT NULL | Instructor name |
| `instructor_role` | TEXT | NOT NULL | Instructor role/title |
| `instructor_bio` | TEXT | NOT NULL | Instructor biography |
| `outcomes_json` | TEXT | NOT NULL | Learning outcomes as JSON array |
| `syllabus_json` | TEXT | NOT NULL | Syllabus content as JSON array |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_self_paced_slug` on `slug` (unique constraint)
- `idx_self_paced_program_id` on `program_id` (unique constraint)
- `idx_self_paced_category` on `category`
- `idx_self_paced_level` on `level`

**Relationships:**
- One-to-one with `training_programs`

---

### 26. `mis_assistance_requests` - MIS Assistance Requests

**Purpose:** MIS (Management Information Systems) assistance requests for storage and manpower needs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `request_type` | TEXT | NOT NULL, CHECK | Type: 'storage', 'manpower' |
| `request_details` | TEXT | NOT NULL | Detailed request description |
| `priority` | TEXT | NOT NULL, CHECK | Priority: 'low', 'medium', 'high' |
| `status` | TEXT | NOT NULL, CHECK | Status: 'pending', 'processing', 'completed' |
| `requested_by` | TEXT | NOT NULL | Requestor name |
| `requested_by_user_id` | INTEGER | FK → users(id), NULL, NULL | Reference to requestor user |
| `requested_date` | TEXT | NOT NULL | Request submission date |
| `resolution_date` | TEXT | NULL | Date request resolved |
| `remarks` | TEXT | NULL | Resolution remarks/notes |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_mis_status` on `status`
- `idx_mis_priority` on `priority`
- `idx_mis_requested_by_user_id` on `requested_by_user_id`
- `idx_mis_requested_date` on `requested_date`

**Relationships:**
- Many-to-one with `users` (requestor)

---

### 27. `notifications` - User Notifications

**Purpose:** System notifications for users (nomination status changes, memo approvals, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `user_id` | INTEGER | NOT NULL, FK → users(id), CASCADE | Target user |
| `type` | TEXT | NOT NULL, CHECK | Type: 'nomination', 'memo', 'lto', 'ja', 'scs', 'hrdd', 'mis', 'system' |
| `title` | TEXT | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification message |
| `is_read` | INTEGER | NOT NULL, DEFAULT 0, CHECK | Read status: 0 or 1 |
| `related_id` | TEXT | NULL | Related entity ID (application number, memo number, etc.) |
| `related_type` | TEXT | NULL | Related entity type ('application', 'memo', 'lto', etc.) |
| `status` | TEXT | NULL | Related entity status |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Notification timestamp |

**Indexes:**
- `idx_notifications_user_id` on `user_id`
- `idx_notifications_type` on `type`
- `idx_notifications_is_read` on `is_read`
- `idx_notifications_created_at` on `created_at`
- `idx_notifications_user_unread` on `(user_id, is_read)` (composite for unread count)

**Relationships:**
- Many-to-one with `users`

---

### 28. `audit_logs` - System Audit Trail

**Purpose:** Audit trail for tracking all significant system actions (status changes, approvals, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `user_id` | INTEGER | FK → users(id), NULL, NULL | User who performed action |
| `action` | TEXT | NOT NULL | Action performed (e.g., 'application_submitted', 'status_changed') |
| `entity_type` | TEXT | NOT NULL | Entity type ('application', 'memo', 'lto', 'user', etc.) |
| `entity_id` | INTEGER | NULL | Entity ID |
| `old_value` | TEXT | NULL | Previous value (JSON) |
| `new_value` | TEXT | NULL | New value (JSON) |
| `ip_address` | TEXT | NULL | User's IP address |
| `user_agent` | TEXT | NULL | User's browser user agent |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Action timestamp |

**Indexes:**
- `idx_audit_user_id` on `user_id`
- `idx_audit_action` on `action`
- `idx_audit_entity` on `(entity_type, entity_id)` (composite)
- `idx_audit_created_at` on `created_at`

**Relationships:**
- Many-to-one with `users`

---

## Entity Relationship Diagram (Summary)

```
offices (1) ──── (M) users (1) ──── (M) applications (1) ──── (1) application_gedsi
                    │                       │
                    │                       ├── (1) application_social_inclusion
                    │                       │
                    │                       ├── (M) application_messages
                    │                       │
                    │                       ├── (1) seminar_confirmation_sheets (1) ──── (M) scs_participants
                    │                       │
                    │                       ├── (1) memo_directives (1) ──── (1) local_travel_orders
                    │                       │                          │
                    │                       │                          └── (1) travel_order_request_forms
                    │                       │
                    │                       ├── (1) hrdd_evaluations
                    │                       │
                    │                       └── (1) post_training_requirements (1) ──── (M) post_training_items
                    │
                    └─── (M) job_analysis_forms (1) ──── (M) job_analysis_secondary_duties
                                               │
                                               └─── (M) job_analysis_skills

training_programs (1) ──── (M) training_sessions
       │
       ├── (M) applications
       │
       ├── (1) qualification_criteria (1) ──── (M) qualification_criteria_offices
       │                                    ├── (M) qualification_criteria_salary_grades
       │                                    └── (M) qualification_criteria_employment_statuses
       │
       └─── (1) self_paced_courses

users (1) ──── (1) auth_accounts
users (1) ──── (M) notifications
users (1) ──── (M) mis_assistance_requests
users (1) ──── (M) audit_logs
```

---

## Key Business Rules & Constraints

### 1. Application Status Workflow
- **Pending** → Initial submission by employee
- **Supervisor Approved** → Supervisor approves nomination
- **Finalized** → HRDD reviews and finalizes
- **Pending Signatory** → Awaiting signatory approval
- **Approved** → Signatory approves
- **Signed** → Final signed state
- **Rejected** → Can occur at any approval stage

### 2. Qualification Checking
Before an employee can register for a training:
- Check if employee's office is in target offices list
- Check if employee's salary grade matches criteria
- Check if employee's employment status is eligible

### 3. Document Generation Flow
1. **Nomination Form** → Generated on application submission
2. **SCS** → Auto-generated from approved applications
3. **Memo Directive** → Generated from approved SCS (in-house or out-of-house)
4. **TORF** → Filled by participant after memo approval
5. **LTO** → Generated from approved TORF

### 4. Signature Management
- Users upload signature images (stored as data URLs or file paths)
- Signatories have master signatures used across documents
- Signatures embedded in generated HTML/PDF documents

### 5. Notification Triggers
- Application status changes
- Memo directive approvals/disapprovals
- LTO generation
- SCS submissions
- MIS request status updates
- System announcements

---

## Indexing Strategy

### High-Priority Indexes (for frequent queries)
- `applications.status` - Filtering by status across all portals
- `applications.applicant_user_id` - User's applications lookup
- `applications.office_id` - Office-level reporting
- `applications.date_submitted` - Date range queries
- `notifications.user_id + is_read` - Unread notification counts

### Medium-Priority Indexes (for reporting)
- `applications.form_type + status` - Composite for filtered views
- `training_programs.catalog_type` - Training catalog filtering
- `memo_directives.status + memo_type` - Memo reporting
- `job_analysis_forms.office_id` - Office-level JAF reporting

### Low-Priority Indexes (for audit/analytics)
- `audit_logs.created_at` - Time-series audit queries
- `audit_logs.entity_type + entity_id` - Entity-specific audit trails

---

## Data Migration Considerations

### From localStorage to Database
Current frontend stores data in localStorage under these keys:
- `DOTr_HRDD_DB` → PortalDatabase (applications, SCS, memos, LTOs, evaluations, etc.)
- `DOTr_HRDD_USER_DB` → UserDatabase (user applications, JAFs, profile, notifications)
- `dotr_auth_session` → Authentication session

Migration strategy:
1. Parse localStorage JSON structures
2. Map to relational schema
3. Handle denormalized fields (e.g., office_name stored in applications)
4. Create proper foreign key relationships
5. Validate data integrity post-migration

---

## Security & Compliance

### Password Storage
- Use bcrypt or argon2 for password hashing
- Never store plaintext passwords
- Implement password reset flow

### Sensitive Data
- Employee ID numbers (unique, indexed)
- Salary grades
- Contact information
- GEDSI responses (privacy considerations)
- Social inclusion data

### Access Control
- Row-level security based on user role
- Employees see only their own applications
- Supervisors see applications from their office
- HRDD admins see all applications
- Signatories see applications pending signature

### Audit Requirements
- All status changes logged
- Document generation tracked
- User actions recorded with timestamps
- IP address and user agent captured

---

## Future Enhancements (Tables to Consider)

### 1. `training_enrollments` - Waitlist & Enrollment Management
- Track enrollment beyond nominations
- Manage waitlists for full sessions
- Capacity tracking

### 2. `training_feedback` - Post-Training Feedback
- Participant feedback surveys
- Training effectiveness ratings
- Instructor evaluations

### 3. `training_certificates` - Certificate Generation
- Certificate templates
- Issuance tracking
- Verification codes

### 4. `budget_allocations` - Training Budget Management
- Office/department budgets
- Training cost tracking
- Budget approval workflows

### 5. `competency_frameworks` - Competency Mapping
- Competency definitions
- Role-based competency requirements
- Gap analysis

### 6. `succession_planning` - Succession Plans
- Position succession chains
- Readiness assessments
- Development plans

### 7. `reports_saved` - Saved Reports
- User-saved report configurations
- Scheduled report generation
- Report sharing

---

## Database Technology Recommendations

### Current: Turso (libSQL/SQLite)
- Already integrated via seed script
- Good for small-to-medium deployments
- Edge-friendly with Turso's distributed architecture

### Alternative Considerations
- **PostgreSQL**: Better for complex queries, full-text search, JSON operations
- **MySQL/MariaDB**: Widely supported, good tooling
- **Supabase**: PostgreSQL with built-in auth, real-time subscriptions

### ORM Recommendations
- **Prisma**: Type-safe, excellent TypeScript support
- **Drizzle**: Lightweight, SQL-first approach
- **Kysely**: Type-safe query builder

---

## Implementation Priority

### Phase 1: Core Tables (MVP)
1. `offices`
2. `users`
3. `auth_accounts`
4. `training_programs`
5. `training_sessions`
6. `applications`
7. `application_messages`
8. `application_gedsi`
9. `application_social_inclusion`

### Phase 2: Document Generation
10. `seminar_confirmation_sheets`
11. `scs_participants`
12. `memo_directives`
13. `travel_order_request_forms`
14. `local_travel_orders`
15. `hrdd_evaluations`

### Phase 3: Extended Features
16. `job_analysis_forms`
17. `job_analysis_secondary_duties`
18. `job_analysis_skills`
19. `post_training_requirements`
20. `post_training_items`
21. `mis_assistance_requests`
22. `self_paced_courses`
23. `qualification_criteria` (and junction tables)

### Phase 4: System Infrastructure
24. `notifications`
25. `audit_logs`

---

## Summary Statistics

| Category | Table Count | Purpose |
|----------|-------------|---------|
| **Core Entities** | 6 | offices, users, auth, programs, sessions, applications |
| **Application Support** | 3 | messages, gedsi, social_inclusion |
| **Document Flow** | 6 | scs, scs_participants, memos, torf, lto, evaluations |
| **Job Analysis** | 3 | jaf, secondary_duties, skills |
| **Post-Training** | 2 | requirements, items |
| **Training Catalog** | 5 | programs, sessions, self_paced, criteria (3 junction tables) |
| **Support Services** | 2 | mis_requests, notifications |
| **System** | 1 | audit_logs |
| **Total** | **28** | Complete schema |

---

## Notes & Assumptions

1. **Denormalization**: Some fields are intentionally denormalized (e.g., `office_name` in `applications`) for reporting performance and historical accuracy.

2. **JSON Fields**: Complex nested data (e.g., `alternate_participant_json`, `requirements`, `outcomes_json`) stored as JSON strings for flexibility.

3. **Signature Storage**: Signatures stored as data URLs in current implementation; consider migrating to file storage (S3, Cloudinary) with URL references.

4. **HTML Documents**: Generated documents (memo_html) stored as HTML; consider PDF generation service with file storage.

5. **Status Enums**: All status fields use CHECK constraints; application layer should validate against same enum values.

6. **Timestamps**: All timestamps in ISO 8601 format (e.g., "2026-03-18T08:00:00Z").

7. **Soft Deletes**: `is_active` flag in `users` and `training_programs` for soft deletes; consider adding `deleted_at` timestamp for audit trail.

8. **Multi-tenancy**: Current design assumes single organization; if multi-tenant support needed, add `organization_id` to all tables.

---

*Document generated on: April 14, 2026*
*Based on: DOTr-HRDD Learning Management Portal frontend codebase analysis*
