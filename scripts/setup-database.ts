import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Credentials from credentials.md
const CREDENTIALS = [
  { username: "cao_signatory", password: "dotr123", role: "signatory", name: "Mary Grace L. Escoto" },
  { username: "user", password: "password123", role: "employee", name: "Juan Dela Cruz" },
  { username: "supervisor", password: "password123", role: "employee", name: "Josefa B. Neri" },
  { username: "admin", password: "password123", role: "signatory", name: "System Admin" },
];

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_TOKEN;

if (!databaseUrl) {
  throw new Error("Missing TURSO_DATABASE_URL environment variable.");
}

const client = createClient({
  url: databaseUrl,
  authToken: authToken || undefined,
});

async function ensureSchema() {
  console.log("Creating database schema...");

  const statements = [
    // 1. offices
    `CREATE TABLE IF NOT EXISTS offices (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      office_head TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 2. users
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE,
      role TEXT NOT NULL CHECK (role IN ('employee', 'supervisor', 'hrdd_admin', 'signatory')),
      office_id INTEGER REFERENCES offices(id) ON DELETE SET NULL,
      position_title TEXT,
      employee_id_number TEXT UNIQUE,
      supervisor_name TEXT,
      employment_status TEXT,
      salary_grade TEXT,
      service_length TEXT,
      contact_number TEXT,
      gender TEXT,
      date_hired TEXT,
      is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 3. auth_accounts
    `CREATE TABLE IF NOT EXISTS auth_accounts (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_hint TEXT,
      last_login TEXT,
      failed_attempts INTEGER NOT NULL DEFAULT 0,
      locked_until TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 4. training_programs
    `CREATE TABLE IF NOT EXISTS training_programs (
      id INTEGER PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL UNIQUE,
      catalog_type TEXT NOT NULL CHECK (catalog_type IN ('in-house', 'out-of-house', 'self-paced')),
      competency_type TEXT CHECK (competency_type IN ('core', 'functional', 'leadership')),
      level TEXT,
      duration_text TEXT,
      description TEXT NOT NULL,
      outline TEXT,
      target_audience TEXT,
      service_provider TEXT,
      delivery_mode TEXT,
      cost_text TEXT,
      contact_person TEXT,
      deadline_text TEXT,
      external_link TEXT,
      image_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 5. training_sessions
    `CREATE TABLE IF NOT EXISTS training_sessions (
      id INTEGER PRIMARY KEY,
      program_id INTEGER NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
      start_date TEXT,
      end_date TEXT,
      session_date_text TEXT,
      venue TEXT,
      provider_name TEXT,
      memo_date TEXT,
      memo_time_in TEXT,
      memo_time_out TEXT,
      max_participants INTEGER,
      current_participants INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (program_id, session_date_text, venue)
    )`,

    // 6. qualification_criteria
    `CREATE TABLE IF NOT EXISTS qualification_criteria (
      id INTEGER PRIMARY KEY,
      program_id INTEGER NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
      target_level TEXT,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 7. qualification_criteria_offices
    `CREATE TABLE IF NOT EXISTS qualification_criteria_offices (
      id INTEGER PRIMARY KEY,
      criteria_id INTEGER NOT NULL REFERENCES qualification_criteria(id) ON DELETE CASCADE,
      office_id INTEGER NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
      UNIQUE (criteria_id, office_id)
    )`,

    // 8. qualification_criteria_salary_grades
    `CREATE TABLE IF NOT EXISTS qualification_criteria_salary_grades (
      id INTEGER PRIMARY KEY,
      criteria_id INTEGER NOT NULL REFERENCES qualification_criteria(id) ON DELETE CASCADE,
      salary_grade TEXT NOT NULL,
      UNIQUE (criteria_id, salary_grade)
    )`,

    // 9. qualification_criteria_employment_statuses
    `CREATE TABLE IF NOT EXISTS qualification_criteria_employment_statuses (
      id INTEGER PRIMARY KEY,
      criteria_id INTEGER NOT NULL REFERENCES qualification_criteria(id) ON DELETE CASCADE,
      employment_status TEXT NOT NULL,
      UNIQUE (criteria_id, employment_status)
    )`,

    // 10. applications
    `CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY,
      application_number TEXT NOT NULL UNIQUE,
      applicant_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      office_id INTEGER REFERENCES offices(id) ON DELETE SET NULL,
      program_id INTEGER REFERENCES training_programs(id) ON DELETE SET NULL,
      session_id INTEGER REFERENCES training_sessions(id) ON DELETE SET NULL,
      form_type TEXT NOT NULL DEFAULT 'nomination' CHECK (form_type IN ('nomination', 'jaf')),
      status TEXT NOT NULL CHECK (
        status IN ('Pending', 'Supervisor Approved', 'Finalized', 'Pending Signatory', 'Approved', 'Rejected', 'Signed')
      ),
      title TEXT NOT NULL,
      competency_type TEXT CHECK (competency_type IN ('core', 'functional', 'leadership')),
      date_submitted TEXT,
      date_filing TEXT,
      date_course TEXT,
      venue TEXT,
      applicant_name TEXT NOT NULL,
      applicant_username TEXT,
      employee_id_number TEXT,
      email TEXT,
      position_title TEXT,
      supervisor_name TEXT,
      office_name TEXT NOT NULL,
      office_head TEXT,
      date_hired TEXT,
      employment_status TEXT,
      salary_grade TEXT,
      service_length TEXT,
      contact_number TEXT,
      gender TEXT,
      oic_name TEXT,
      alternate_participant_json TEXT,
      justification TEXT,
      user_signature_data_url TEXT,
      admin_signature_data_url TEXT,
      memo_html TEXT,
      memo_pdf_data_url TEXT,
      memo_mode TEXT,
      memo_provider TEXT,
      memo_date TEXT,
      memo_time_in TEXT,
      memo_time_out TEXT,
      is_read INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
      is_admin_read INTEGER NOT NULL DEFAULT 0 CHECK (is_admin_read IN (0, 1)),
      scs_id INTEGER REFERENCES seminar_confirmation_sheets(id),
      memo_directive_id INTEGER REFERENCES memo_directives(id),
      lto_id INTEGER REFERENCES local_travel_orders(id),
      torf_id INTEGER REFERENCES travel_order_request_forms(id),
      hrdd_evaluation_id INTEGER REFERENCES hrdd_evaluations(id),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 11. application_messages
    `CREATE TABLE IF NOT EXISTS application_messages (
      id INTEGER PRIMARY KEY,
      application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      sender_name TEXT NOT NULL,
      sender_user_id INTEGER REFERENCES users(id),
      message_text TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
      created_at TEXT NOT NULL
    )`,

    // 12. application_gedsi
    `CREATE TABLE IF NOT EXISTS application_gedsi (
      application_id INTEGER PRIMARY KEY REFERENCES applications(id) ON DELETE CASCADE,
      g1 TEXT CHECK (g1 IN ('yes', 'no')),
      g2 TEXT CHECK (g2 IN ('yes', 'no')),
      g3 TEXT CHECK (g3 IN ('yes', 'no')),
      g4 TEXT CHECK (g4 IN ('yes', 'no')),
      g5 TEXT CHECK (g5 IN ('yes', 'no')),
      g6 TEXT CHECK (g6 IN ('yes', 'no')),
      g7 TEXT CHECK (g7 IN ('yes', 'no')),
      g8 TEXT CHECK (g8 IN ('yes', 'no'))
    )`,

    // 13. application_social_inclusion
    `CREATE TABLE IF NOT EXISTS application_social_inclusion (
      application_id INTEGER PRIMARY KEY REFERENCES applications(id) ON DELETE CASCADE,
      s1 TEXT CHECK (s1 IN ('yes', 'no')),
      s2 TEXT
    )`,

    // 14. seminar_confirmation_sheets
    `CREATE TABLE IF NOT EXISTS seminar_confirmation_sheets (
      id INTEGER PRIMARY KEY,
      scs_number TEXT UNIQUE,
      application_id INTEGER REFERENCES applications(id),
      program_id INTEGER REFERENCES training_programs(id),
      session_id INTEGER REFERENCES training_sessions(id),
      training_title TEXT NOT NULL,
      training_date TEXT NOT NULL,
      training_time_in TEXT,
      training_time_out TEXT,
      provider TEXT NOT NULL,
      venue TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'disapproved')),
      submitted_by INTEGER REFERENCES users(id),
      submitted_at TEXT,
      approved_by TEXT,
      approved_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 15. scs_participants
    `CREATE TABLE IF NOT EXISTS scs_participants (
      id INTEGER PRIMARY KEY,
      scs_id INTEGER NOT NULL REFERENCES seminar_confirmation_sheets(id) ON DELETE CASCADE,
      full_name TEXT NOT NULL,
      id_number TEXT NOT NULL,
      salary_grade TEXT NOT NULL,
      office TEXT NOT NULL,
      position TEXT NOT NULL,
      contact_number TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'declined')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 16. memo_directives
    `CREATE TABLE IF NOT EXISTS memo_directives (
      id INTEGER PRIMARY KEY,
      memo_number TEXT UNIQUE,
      application_id INTEGER REFERENCES applications(id),
      memo_type TEXT NOT NULL CHECK (memo_type IN ('in-house', 'out-of-house')),
      participant_name TEXT NOT NULL,
      participant_position TEXT NOT NULL,
      participant_office TEXT NOT NULL,
      training_title TEXT NOT NULL,
      training_date TEXT NOT NULL,
      training_time_in TEXT,
      training_time_out TEXT,
      provider TEXT NOT NULL,
      venue TEXT NOT NULL,
      objectives TEXT NOT NULL,
      requirements TEXT,
      submission_deadline TEXT,
      memo_date TEXT NOT NULL,
      signature_data_url TEXT,
      signed_by TEXT,
      signed_date TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'disapproved', 'signed')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 17. travel_order_request_forms
    `CREATE TABLE IF NOT EXISTS travel_order_request_forms (
      id INTEGER PRIMARY KEY,
      memo_directive_id INTEGER NOT NULL REFERENCES memo_directives(id) ON DELETE CASCADE,
      participant_name TEXT NOT NULL,
      participant_position TEXT NOT NULL,
      participant_office TEXT NOT NULL,
      employee_id TEXT NOT NULL,
      salary_grade TEXT NOT NULL,
      purpose_of_travel TEXT NOT NULL,
      destination TEXT NOT NULL,
      departure_date TEXT NOT NULL,
      return_date TEXT NOT NULL,
      estimated_expenses TEXT,
      transportation_mode TEXT,
      accommodation_needed INTEGER NOT NULL DEFAULT 0 CHECK (accommodation_needed IN (0, 1)),
      status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'disapproved')),
      approved_by TEXT,
      approval_date TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 18. local_travel_orders
    `CREATE TABLE IF NOT EXISTS local_travel_orders (
      id INTEGER PRIMARY KEY,
      lto_number TEXT UNIQUE,
      memo_directive_id INTEGER NOT NULL REFERENCES memo_directives(id) ON DELETE CASCADE,
      torf_id INTEGER REFERENCES travel_order_request_forms(id),
      application_id INTEGER REFERENCES applications(id),
      participant_name TEXT NOT NULL,
      participant_position TEXT NOT NULL,
      participant_office TEXT NOT NULL,
      training_title TEXT NOT NULL,
      training_date TEXT NOT NULL,
      venue TEXT NOT NULL,
      torf_submitted INTEGER NOT NULL DEFAULT 0 CHECK (torf_submitted IN (0, 1)),
      torf_approved INTEGER NOT NULL DEFAULT 0 CHECK (torf_approved IN (0, 1)),
      status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'disapproved', 'generated')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 19. hrdd_evaluations
    `CREATE TABLE IF NOT EXISTS hrdd_evaluations (
      id INTEGER PRIMARY KEY,
      application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      evaluator_name TEXT NOT NULL,
      evaluator_user_id INTEGER REFERENCES users(id),
      evaluation_date TEXT NOT NULL,
      qualification_review TEXT NOT NULL CHECK (qualification_review IN ('passed', 'failed')),
      documents_complete INTEGER NOT NULL CHECK (documents_complete IN (0, 1)),
      budget_available INTEGER NOT NULL CHECK (budget_available IN (0, 1)),
      remarks TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending', 'passed', 'failed')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 20. post_training_requirements
    `CREATE TABLE IF NOT EXISTS post_training_requirements (
      id INTEGER PRIMARY KEY,
      application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      training_title TEXT NOT NULL,
      participant_name TEXT NOT NULL,
      completion_date TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'not_applicable')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 21. post_training_items
    `CREATE TABLE IF NOT EXISTS post_training_items (
      id INTEGER PRIMARY KEY,
      post_training_id INTEGER NOT NULL REFERENCES post_training_requirements(id) ON DELETE CASCADE,
      item TEXT NOT NULL,
      description TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
      completed_date TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 22. job_analysis_forms
    `CREATE TABLE IF NOT EXISTS job_analysis_forms (
      id INTEGER PRIMARY KEY,
      form_number TEXT NOT NULL UNIQUE,
      submitter_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      office_id INTEGER REFERENCES offices(id) ON DELETE SET NULL,
      fullname TEXT NOT NULL,
      position_title TEXT,
      office_name TEXT,
      section_name TEXT,
      alternate_position TEXT,
      purpose TEXT,
      main_duties TEXT,
      tools_and_equipment TEXT,
      challenges TEXT,
      comments TEXT,
      signature_data_url TEXT,
      date_submitted TEXT,
      is_read INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 23. job_analysis_secondary_duties
    `CREATE TABLE IF NOT EXISTS job_analysis_secondary_duties (
      id INTEGER PRIMARY KEY,
      job_analysis_form_id INTEGER NOT NULL REFERENCES job_analysis_forms(id) ON DELETE CASCADE,
      duty_text TEXT NOT NULL,
      frequency_text TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`,

    // 24. job_analysis_skills
    `CREATE TABLE IF NOT EXISTS job_analysis_skills (
      id INTEGER PRIMARY KEY,
      job_analysis_form_id INTEGER NOT NULL REFERENCES job_analysis_forms(id) ON DELETE CASCADE,
      skill_name TEXT NOT NULL,
      level_text TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`,

    // 25. self_paced_courses
    `CREATE TABLE IF NOT EXISTS self_paced_courses (
      id INTEGER PRIMARY KEY,
      program_id INTEGER UNIQUE REFERENCES training_programs(id) ON DELETE SET NULL,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      level TEXT NOT NULL,
      duration_text TEXT NOT NULL,
      rating REAL NOT NULL,
      reviews_text TEXT NOT NULL,
      learners_text TEXT NOT NULL,
      price_text TEXT NOT NULL,
      badge TEXT,
      image_url TEXT,
      external_link TEXT,
      instructor_name TEXT NOT NULL,
      instructor_role TEXT NOT NULL,
      instructor_bio TEXT NOT NULL,
      outcomes_json TEXT NOT NULL,
      syllabus_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 26. mis_assistance_requests
    `CREATE TABLE IF NOT EXISTS mis_assistance_requests (
      id INTEGER PRIMARY KEY,
      request_type TEXT NOT NULL CHECK (request_type IN ('storage', 'manpower')),
      request_details TEXT NOT NULL,
      priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
      status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed')),
      requested_by TEXT NOT NULL,
      requested_by_user_id INTEGER REFERENCES users(id),
      requested_date TEXT NOT NULL,
      resolution_date TEXT,
      remarks TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 27. notifications
    `CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('nomination', 'memo', 'lto', 'ja', 'scs', 'hrdd', 'mis', 'system')),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
      related_id TEXT,
      related_type TEXT,
      status TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // 28. audit_logs
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      old_value TEXT,
      new_value TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    // Create indexes
    `CREATE INDEX IF NOT EXISTS idx_users_office_id ON users(office_id)`,
    `CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`,
    `CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)`,
    `CREATE INDEX IF NOT EXISTS idx_auth_username ON auth_accounts(username)`,
    `CREATE INDEX IF NOT EXISTS idx_programs_catalog_type ON training_programs(catalog_type)`,
    `CREATE INDEX IF NOT EXISTS idx_programs_competency_type ON training_programs(competency_type)`,
    `CREATE INDEX IF NOT EXISTS idx_programs_is_active ON training_programs(is_active)`,
    `CREATE INDEX IF NOT EXISTS idx_sessions_program_id ON training_sessions(program_id)`,
    `CREATE INDEX IF NOT EXISTS idx_sessions_start_date ON training_sessions(start_date)`,
    `CREATE INDEX IF NOT EXISTS idx_criteria_program_id ON qualification_criteria(program_id)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_applicant_user_id ON applications(applicant_user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_office_id ON applications(office_id)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_program_id ON applications(program_id)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_form_type_status ON applications(form_type, status)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_date_submitted ON applications(date_submitted)`,
    `CREATE INDEX IF NOT EXISTS idx_messages_application_id ON application_messages(application_id)`,
    `CREATE INDEX IF NOT EXISTS idx_scs_application_id ON seminar_confirmation_sheets(application_id)`,
    `CREATE INDEX IF NOT EXISTS idx_scs_status ON seminar_confirmation_sheets(status)`,
    `CREATE INDEX IF NOT EXISTS idx_memo_application_id ON memo_directives(application_id)`,
    `CREATE INDEX IF NOT EXISTS idx_memo_status ON memo_directives(status)`,
    `CREATE INDEX IF NOT EXISTS idx_lto_status ON local_travel_orders(status)`,
    `CREATE INDEX IF NOT EXISTS idx_evaluations_application_id ON hrdd_evaluations(application_id)`,
    `CREATE INDEX IF NOT EXISTS idx_post_training_application_id ON post_training_requirements(application_id)`,
    `CREATE INDEX IF NOT EXISTS idx_jaf_submitter_user_id ON job_analysis_forms(submitter_user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_jaf_office_id ON job_analysis_forms(office_id)`,
    `CREATE INDEX IF NOT EXISTS idx_mis_status ON mis_assistance_requests(status)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)`,
    `CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id)`,
    `CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at)`,
  ];

  for (const statement of statements) {
    await client.execute(statement);
  }

  console.log("✓ All tables and indexes created successfully");
}

async function seedCredentials() {
  console.log("\nSeeding credentials from credentials.md...");

  for (const cred of CREDENTIALS) {
    // Hash password with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(cred.password, saltRounds);

    // Determine role mapping
    let role: string;
    if (cred.role === "signatory") {
      role = "signatory";
    } else if (cred.username === "supervisor") {
      role = "supervisor";
    } else {
      role = "employee";
    }

    // Insert or update user
    const result = await client.execute({
      sql: `
        INSERT INTO users (username, full_name, role, is_active, updated_at)
        VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(username) DO UPDATE SET
          full_name = excluded.full_name,
          role = excluded.role,
          is_active = excluded.is_active,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      args: [cred.username, cred.name, role],
    });

    const userId = result.rows[0]?.id;

    if (userId) {
      // Insert or update auth account with hashed password
      await client.execute({
        sql: `
          INSERT INTO auth_accounts (user_id, username, password_hash, password_hint)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(username) DO UPDATE SET
            user_id = excluded.user_id,
            password_hash = excluded.password_hash,
            password_hint = excluded.password_hint
        `,
        args: [userId, cred.username, passwordHash, cred.password],
      });

      console.log(`✓ Seeded: ${cred.username} (${cred.name}) - Role: ${role}`);
    }
  }

  console.log("\n✓ All credentials seeded successfully");
}

async function verifySetup() {
  console.log("\nVerifying database setup...");

  const tables = [
    "offices",
    "users",
    "auth_accounts",
    "training_programs",
    "training_sessions",
    "qualification_criteria",
    "qualification_criteria_offices",
    "qualification_criteria_salary_grades",
    "qualification_criteria_employment_statuses",
    "applications",
    "application_messages",
    "application_gedsi",
    "application_social_inclusion",
    "seminar_confirmation_sheets",
    "scs_participants",
    "memo_directives",
    "travel_order_request_forms",
    "local_travel_orders",
    "hrdd_evaluations",
    "post_training_requirements",
    "post_training_items",
    "job_analysis_forms",
    "job_analysis_secondary_duties",
    "job_analysis_skills",
    "self_paced_courses",
    "mis_assistance_requests",
    "notifications",
    "audit_logs",
  ];

  for (const table of tables) {
    const result = await client.execute(`SELECT COUNT(*) as count FROM ${table}`);
    const count = Number(result.rows[0]?.count ?? 0);
    console.log(`  ${table}: ${count} records`);
  }

  // Verify users
  const usersResult = await client.execute(`
    SELECT u.username, u.full_name, u.role, a.password_hash IS NOT NULL as has_password
    FROM users u
    LEFT JOIN auth_accounts a ON u.id = a.user_id
    ORDER BY u.username
  `);

  console.log("\n✓ Users in database:");
  for (const row of usersResult.rows) {
    console.log(`  - ${row.username} (${row.full_name}) - Role: ${row.role}, Has Password: ${row.has_password ? "Yes" : "No"}`);
  }
}

async function main() {
  try {
    console.log("Starting database setup...\n");

    await ensureSchema();
    await seedCredentials();
    await verifySetup();

    console.log("\n✅ Database setup completed successfully!");
  } catch (error) {
    console.error("\n❌ Database setup failed:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
