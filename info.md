DOTr Learning Management System (DOTr-LMS)
Scope
The DOTr-LMS is an internally developed, web-based Learning Management System designed to manage, deliver, monitor, and evaluate all training programs for DOTr personnel. The system is aligned with the Civil Service Commission's PRIME-HRM framework and covers the entire training lifecycle — from request to certification.
System Features Summary
    • Role-Based Access Control (RBAC) with five (5) distinct user roles.
    • CSC PRIME-HRM aligned competency framework management.
    • Job Analysis Form integration with a three-tier validation workflow (Employee → Supervisor → HRDD).
    • Automated Memo Directives: System-generated training memos blasted to approved participants by the Authorized Signatory.
    • Final Signatory Approval: Digital signature integration for final training validation and certificates.
    • Individual Development Plan (IDP) with multi-level approval workflows.
    • CSC Exam Prep: Downloadable PDF item banks and interactive flashcard activities.
    • Auto-generated Digital Certificates with scannable QR verification.

Stakeholders and User Classes
User Role
Access Level
Responsibilities
System Administrator
Full Access
System configuration, user management, audit log review, Django admin panel.
HR / L&D Officer (HRDD)
High
Training management, enrollment management, IDP approval, Job Analysis Form final review, certificate issuance.
Authorized Signatory
High (Approval)
Final signer/approver of training programs; Issues and blasts Memo Directives to approved employees; Signs digital certificates.
Supervisor / Division Chief
Medium
Training request approval, team competency assessment, IDP endorsement, Job Analysis Form review.
Employee
Standard
Browse catalog, submit requests, draft Job Analysis Forms, take trainings, access CSC exam guides/flashcards, view IDP and certificates.

Functional Requirements
1. User Management & Workflow (FR-USR)
    • FR-USR-01: System shall support five distinct roles: Admin, HRDD, Authorized Signatory, Supervisor, and Employee.
    • FR-USR-02: System shall support supervisor-subordinate hierarchy for approval routing.
    • FR-USR-03: System shall maintain digital signature profiles for the Authorized Signatory.
2. Competency & Job Analysis (FR-COMP)
    • FR-COMP-01: System shall collate job descriptions through a Job Analysis Form.
    • FR-COMP-02: Workflow: Employee Draft -> Supervisor Review -> HRDD Review and Approval.
    • FR-COMP-03: System shall support IDP creation and gap analysis linked to PRIME-HRM.
3. Training Requests & Memo Directives (FR-REQ)
    • FR-REQ-01: System shall route training requests through the standard workflow.
    • FR-REQ-02: Final Approval: Upon HRDD recommendation, the Authorized Signatory shall provide the final approval for the conduct of training.
    • FR-REQ-03: Memo Blast: System shall allow the Authorized Signatory to trigger a "Memo Directive" email/notification to all approved participants, serving as a formal order to attend.
    • FR-REQ-04: System shall generate a PDF version of the Memo Directive with the Signatory’s digital signature.
4. e-Learning & Exam Prep (FR-LRN)
    • FR-LRN-01: System shall provide a repository for CSC exam guides (PDF downloads).
    • FR-LRN-02: System shall support interactive flashcard activities for exam practice.
    • FR-LRN-03: System shall track learner progress and auto-redirect to assessments.
5. Assessment & Certification (FR-CERT)
    • FR-CERT-01: System shall auto-issue certificates upon passing.
    • FR-CERT-02: All certificates must bear the automated digital signature of the Authorized Signatory.
    • FR-CERT-03: Certificates shall include a unique DOTR-XXXXXXXX number and a scannable QR code.

Non-Functional Requirements
    • Security: All approvals and memo blasts must be logged in the audit trail with timestamps and IP addresses.
    • Performance: Memo blasts to large groups (200+ employees) must be queued to prevent system timeouts.

Application Modules
    • accounts — User model, RBAC, Divisions, Digital Signatures.
    • competencies — Job Analysis Forms, IDP, validation workflows.
    • trainings — Program management, Memo Directive Blast Engine, CSC Exam repository.
    • assessments — Quizzes, scoring, Flashcard module.
    • certificates — Certificate generation and QR verification.
    • reports — Dashboard views and PRIME-HRM compliance logs.
