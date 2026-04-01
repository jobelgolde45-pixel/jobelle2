import { createClient } from "@libsql/client";
import { CREDENTIALS } from "../lib/auth-credentials";
import { trainingCatalog } from "../lib/portal-data";
import { courses } from "../lib/selfpaced-data";
import { OFFICES, TRAINING_CATALOG } from "../lib/user-portal-data";

type SeedUser = {
  username: string;
  fullName: string;
  role: "employee" | "signatory" | "admin";
  officeName?: string;
  email?: string;
  positionTitle?: string;
  employeeIdNumber?: string;
  supervisorName?: string;
  employmentStatus?: string;
  salaryGrade?: string;
  serviceLength?: string;
  contactNumber?: string;
  gender?: string;
  dateHired?: string;
  passwordHint: string;
};

type SeedApplication = {
  applicationNumber: string;
  applicantUsername: string;
  officeName: string;
  programCode: string;
  sessionKey?: string;
  formType: "nomination" | "jaf";
  status:
    | "Pending"
    | "Approved"
    | "Finalized"
    | "Pending Signatory"
    | "Rejected"
    | "Signed"
    | "Supervisor Approved";
  title: string;
  competencyType?: "core" | "functional" | "leadership";
  dateSubmitted?: string;
  dateFiling?: string;
  dateCourse?: string;
  venue?: string;
  applicantName: string;
  applicantUsernameDisplay?: string;
  employeeIdNumber?: string;
  email?: string;
  positionTitle?: string;
  supervisorName?: string;
  officeHead?: string;
  dateHired?: string;
  employmentStatus?: string;
  salaryGrade?: string;
  serviceLength?: string;
  contactNumber?: string;
  gender?: string;
  oicName?: string;
  alternateParticipantJson?: string;
  justification?: string;
  userSignatureDataUrl?: string;
  adminSignatureDataUrl?: string;
  memoHtml?: string;
  memoPdfDataUrl?: string;
  memoMode?: string;
  memoProvider?: string;
  memoDate?: string;
  memoTimeIn?: string;
  memoTimeOut?: string;
  isRead?: number;
  isAdminRead?: number;
  messages?: Array<{
    senderName: string;
    messageText: string;
    isRead?: number;
    createdAt: string;
  }>;
  gedsi?: Partial<Record<`g${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`, "yes" | "no">>;
  socialInclusion?: {
    s1?: "yes" | "no";
    s2?: string;
  };
};

type SeedJobAnalysisForm = {
  formNumber: string;
  submitterUsername: string;
  officeName: string;
  fullname: string;
  positionTitle: string;
  sectionName?: string;
  alternatePosition?: string;
  purpose?: string;
  mainDuties?: string;
  toolsAndEquipment?: string;
  challenges?: string;
  comments?: string;
  signatureDataUrl?: string;
  dateSubmitted?: string;
  isRead?: number;
  secondaryDuties: Array<{ dutyText: string; frequencyText?: string; sortOrder: number }>;
  skills: Array<{ skillName: string; levelText?: string; sortOrder: number }>;
};

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_TOKEN;

if (!databaseUrl) {
  throw new Error("Missing TURSO_DATABASE_URL.");
}

const client = createClient({
  url: databaseUrl,
  authToken: authToken || undefined,
});

const officeHeadByOfficeName = new Map(
  OFFICES.map((entry) => {
    const [name, officeHead] = entry.split(" - ");
    return [name, officeHead ?? null] as const;
  }),
);

const seededUsers: SeedUser[] = [
  {
    username: "cao_signatory",
    fullName: "Mary Grace L. Escoto",
    role: "signatory",
    officeName: "Human Resource Development Division",
    email: "marygrace.escoto@dotr.gov.ph",
    positionTitle: "Division Chief",
    passwordHint: "dotr123",
  },
  {
    username: "user",
    fullName: "Juan Dela Cruz",
    role: "employee",
    officeName: "Human Resource Development Division",
    email: "juan.delacruz@dotr.gov.ph",
    positionTitle: "Administrative Assistant III",
    employeeIdNumber: "DOTR-2026-1001",
    supervisorName: "Mary Grace L. Escoto",
    employmentStatus: "Permanent",
    salaryGrade: "11",
    serviceLength: "3 years, 2 months",
    contactNumber: "09171234567",
    gender: "Male",
    dateHired: "2023-02-06",
    passwordHint: "password123",
  },
  {
    username: "supervisor",
    fullName: "Josefa B. Neri",
    role: "employee",
    officeName: "Human Resource Development Division",
    email: "josefa.neri@dotr.gov.ph",
    positionTitle: "Administrative Officer V",
    employeeIdNumber: "DOTR-2018-1841",
    employmentStatus: "Permanent",
    salaryGrade: "18",
    serviceLength: "7 years, 6 months",
    contactNumber: "09179876543",
    gender: "Female",
    dateHired: "2018-09-03",
    passwordHint: "password123",
  },
  {
    username: "admin",
    fullName: "System Admin",
    role: "admin",
    officeName: "Information Systems and Security Division",
    email: "sysadmin@dotr.gov.ph",
    positionTitle: "Systems Administrator",
    passwordHint: "password123",
  },
  {
    username: "mia.delacruz",
    fullName: "Mia Dela Cruz",
    role: "employee",
    officeName: "Human Resource Development Division",
    email: "mia.delacruz@dotr.gov.ph",
    positionTitle: "Administrative Officer V",
    employeeIdNumber: "DOTR-18419",
    supervisorName: "Josefa B. Neri",
    employmentStatus: "Permanent",
    salaryGrade: "SG-18",
    serviceLength: "7 years, 6 months",
    contactNumber: "09170000001",
    gender: "Female",
    dateHired: "2018-09-03",
    passwordHint: "seeded-demo",
  },
  {
    username: "renz.santos",
    fullName: "Renz Santos",
    role: "employee",
    officeName: "Administrative Service",
    email: "renz.santos@dotr.gov.ph",
    positionTitle: "Administrative Officer IV",
    employeeIdNumber: "DOTR-22041",
    supervisorName: "Lourdes T. Aquino",
    employmentStatus: "Permanent",
    salaryGrade: "SG-15",
    serviceLength: "4 years, 8 months",
    contactNumber: "09170000002",
    gender: "Male",
    dateHired: "2021-07-12",
    passwordHint: "seeded-demo",
  },
  {
    username: "angelica.reyes",
    fullName: "Angelica Reyes",
    role: "employee",
    officeName: "Office of the Assistant Secretary for Administration",
    email: "angelica.reyes@dotr.gov.ph",
    positionTitle: "Senior Administrative Assistant III",
    employeeIdNumber: "DOTR-15109",
    supervisorName: "Marvin P. Hilario",
    employmentStatus: "Permanent",
    salaryGrade: "SG-12",
    serviceLength: "10 years, 1 month",
    contactNumber: "09170000003",
    gender: "Female",
    dateHired: "2016-02-01",
    passwordHint: "seeded-demo",
  },
  {
    username: "ian.garcia",
    fullName: "Ian Garcia",
    role: "employee",
    officeName: "Planning Division",
    email: "ian.garcia@dotr.gov.ph",
    positionTitle: "Planning Officer III",
    employeeIdNumber: "DOTR-19287",
    supervisorName: "Catherine M. Lim",
    employmentStatus: "Permanent",
    salaryGrade: "SG-18",
    serviceLength: "6 years, 4 months",
    contactNumber: "09170000004",
    gender: "Male",
    dateHired: "2019-11-19",
    passwordHint: "seeded-demo",
  },
];

const basePrograms = trainingCatalog.map((program, index) => ({
  code: `TR-${String(index + 1).padStart(3, "0")}`,
  title: program.title,
  catalogType:
    program.duration === "Self-Paced"
      ? "self-paced"
      : program.title === "Industry Conference 2025"
        ? "out-of-house"
        : "in-house",
  competencyType:
    program.details.competencies === "Crafting and Nurturing High-Performing Organizations"
      ? "leadership"
      : program.details.competencies === "Teamwork" ||
          program.details.competencies === "Communication"
        ? "core"
        : "functional",
  level: program.level,
  durationText: program.duration,
  description: program.description,
  outline: null,
  targetAudience: program.details.target,
  serviceProvider:
    program.title === "Service Excellence: A Guide to RA 11032 Citizen's Charter"
      ? "ARTA Academy"
      : program.title === "Industry Conference 2025"
        ? "Industry Association"
        : "DOTr HRDD",
  deliveryMode: program.details.mode,
  costText: program.details.cost,
  contactPerson: null,
  deadlineText: null,
  externalLink: courses.find((course) => course.title === program.title)?.link ?? null,
  imageUrl: courses.find((course) => course.title === program.title)?.image ?? null,
}));

const uxPrograms = Object.entries(TRAINING_CATALOG)
  .flatMap(([catalogType, items]) =>
    items.map((item, index) => ({
      code: `UX-${catalogType.toUpperCase().replaceAll("-", "")}-${String(index + 1).padStart(3, "0")}`,
      title: item.title,
      catalogType,
      competencyType:
        item.details?.competencyType === "core" ||
        item.details?.competencyType === "functional" ||
        item.details?.competencyType === "leadership"
          ? item.details.competencyType
          : null,
      level: item.level,
      durationText: item.duration,
      description: item.description,
      outline: item.details?.outline ?? null,
      targetAudience: item.details?.targetOffices ?? null,
      serviceProvider: item.details?.serviceProvider ?? null,
      deliveryMode: item.details?.mode ?? null,
      costText: item.details?.cost ?? null,
      contactPerson: item.details?.contact ?? null,
      deadlineText: item.details?.deadline ?? null,
      externalLink: item.link ?? null,
      imageUrl: item.image ?? null,
    })),
  )
  .filter(
    (program, index, items) =>
      items.findIndex((candidate) => candidate.title === program.title) === index &&
      !basePrograms.some((candidate) => candidate.title === program.title),
  );

const trainingPrograms = [...basePrograms, ...uxPrograms];

const trainingSessions = [
  {
    sessionKey: "TR-001-2026-04-10-MS-TEAMS",
    programCode: "TR-001",
    startDate: "2026-04-10",
    endDate: "2026-04-11",
    sessionDateText: "2026-04-10 to 2026-04-11",
    venue: "MS Teams",
    providerName: "Civil Service Learning Institute",
    memoDate: "2026-03-29",
    memoTimeIn: "09:00",
    memoTimeOut: "17:00",
  },
  {
    sessionKey: "TR-005-2026-LMS",
    programCode: "TR-005",
    startDate: "2026-05-02",
    endDate: "2026-05-02",
    sessionDateText: "2026-05-02",
    venue: "LMS Portal",
    providerName: "ARTA Academy",
    memoDate: "2026-03-28",
    memoTimeIn: "08:30",
    memoTimeOut: "12:00",
  },
  {
    sessionKey: "TR-002-2026-04-21-MPH",
    programCode: "TR-002",
    startDate: "2026-04-21",
    endDate: "2026-04-21",
    sessionDateText: "2026-04-21",
    venue: "DOTr Multi-Purpose Hall",
    providerName: "DOTr HRDD",
    memoDate: "2026-03-29",
    memoTimeIn: "08:00",
    memoTimeOut: "17:00",
  },
];

const seededApplications: SeedApplication[] = [
  {
    applicationNumber: "APP-2026-0001",
    applicantUsername: "mia.delacruz",
    officeName: "Human Resource Development Division",
    programCode: "TR-001",
    sessionKey: "TR-001-2026-04-10-MS-TEAMS",
    formType: "nomination",
    status: "Pending Signatory",
    title: "Human-Centered Leadership: Redefining Success with Well-Being in Mind",
    competencyType: "leadership",
    dateSubmitted: "2026-03-18",
    dateFiling: "2026-03-18",
    dateCourse: "2026-04-10",
    venue: "MS Teams",
    applicantName: "Mia Dela Cruz",
    applicantUsernameDisplay: "mia.delacruz",
    employeeIdNumber: "DOTR-18419",
    email: "mia.delacruz@dotr.gov.ph",
    positionTitle: "Administrative Officer V",
    supervisorName: "Josefa B. Neri",
    officeHead: "Josefa B. Neri",
    dateHired: "2018-09-03",
    employmentStatus: "Permanent",
    salaryGrade: "SG-18",
    serviceLength: "7 years, 6 months",
    contactNumber: "09170000001",
    gender: "Female",
    justification:
      "The nominee leads cross-functional process improvement initiatives and requires practical well-being leadership frameworks for divisional rollout.",
    memoMode: "Virtual Training",
    memoProvider: "Civil Service Learning Institute",
    memoDate: "2026-03-29",
    memoTimeIn: "09:00",
    memoTimeOut: "17:00",
    messages: [
      {
        senderName: "HRDD",
        messageText: "Nomination endorsed to the signatory queue.",
        createdAt: "2026-03-19T08:00:00Z",
      },
    ],
    gedsi: { g1: "no", g2: "no", g3: "no", g4: "no", g5: "no", g6: "no", g7: "no", g8: "no" },
    socialInclusion: { s1: "no", s2: "" },
  },
  {
    applicationNumber: "APP-2026-0002",
    applicantUsername: "renz.santos",
    officeName: "Administrative Service",
    programCode: "TR-001",
    sessionKey: "TR-001-2026-04-10-MS-TEAMS",
    formType: "nomination",
    status: "Finalized",
    title: "Human-Centered Leadership: Redefining Success with Well-Being in Mind",
    competencyType: "leadership",
    dateSubmitted: "2026-03-20",
    dateFiling: "2026-03-20",
    dateCourse: "2026-04-10",
    venue: "MS Teams",
    applicantName: "Renz Santos",
    applicantUsernameDisplay: "renz.santos",
    employeeIdNumber: "DOTR-22041",
    email: "renz.santos@dotr.gov.ph",
    positionTitle: "Administrative Officer IV",
    supervisorName: "Lourdes T. Aquino",
    officeHead: "Lourdes T. Aquino",
    dateHired: "2021-07-12",
    employmentStatus: "Permanent",
    salaryGrade: "SG-15",
    serviceLength: "4 years, 8 months",
    contactNumber: "09170000002",
    gender: "Male",
    justification:
      "The nominee is being prepared for supervisory assignments and will apply the course output to team engagement planning.",
    memoMode: "Virtual Training",
    memoProvider: "Civil Service Learning Institute",
    memoDate: "2026-03-29",
    memoTimeIn: "09:00",
    memoTimeOut: "17:00",
    isRead: 1,
  },
  {
    applicationNumber: "APP-2026-0003",
    applicantUsername: "angelica.reyes",
    officeName: "Office of the Assistant Secretary for Administration",
    programCode: "TR-005",
    sessionKey: "TR-005-2026-LMS",
    formType: "nomination",
    status: "Signed",
    title: "Service Excellence: A Guide to RA 11032 Citizen's Charter",
    competencyType: "functional",
    dateSubmitted: "2026-03-12",
    dateFiling: "2026-03-12",
    dateCourse: "2026-05-02",
    venue: "LMS Portal",
    applicantName: "Angelica Reyes",
    applicantUsernameDisplay: "angelica.reyes",
    employeeIdNumber: "DOTR-15109",
    email: "angelica.reyes@dotr.gov.ph",
    positionTitle: "Senior Administrative Assistant III",
    supervisorName: "Marvin P. Hilario",
    officeHead: "Marvin P. Hilario",
    dateHired: "2016-02-01",
    employmentStatus: "Permanent",
    salaryGrade: "SG-12",
    serviceLength: "10 years, 1 month",
    contactNumber: "09170000003",
    gender: "Female",
    justification:
      "The training directly supports document processing, frontline response times, and compliance with citizen charter standards.",
    memoMode: "Online Learning",
    memoProvider: "ARTA Academy",
    memoDate: "2026-03-28",
    memoTimeIn: "08:30",
    memoTimeOut: "12:00",
    isRead: 1,
    isAdminRead: 1,
  },
  {
    applicationNumber: "APP-2026-0004",
    applicantUsername: "ian.garcia",
    officeName: "Planning Division",
    programCode: "TR-002",
    sessionKey: "TR-002-2026-04-21-MPH",
    formType: "nomination",
    status: "Pending Signatory",
    title: "Team Building & Collaboration",
    competencyType: "core",
    dateSubmitted: "2026-03-25",
    dateFiling: "2026-03-25",
    dateCourse: "2026-04-21",
    venue: "DOTr Multi-Purpose Hall",
    applicantName: "Ian Garcia",
    applicantUsernameDisplay: "ian.garcia",
    employeeIdNumber: "DOTR-19287",
    email: "ian.garcia@dotr.gov.ph",
    positionTitle: "Planning Officer III",
    supervisorName: "Catherine M. Lim",
    officeHead: "Catherine M. Lim",
    dateHired: "2019-11-19",
    employmentStatus: "Permanent",
    salaryGrade: "SG-18",
    serviceLength: "6 years, 4 months",
    contactNumber: "09170000004",
    gender: "Male",
    justification:
      "The nominee will cascade course outputs to the division and embed collaboration routines in current project delivery workstreams.",
    memoMode: "In-Person",
    memoProvider: "DOTr HRDD",
    memoDate: "2026-03-29",
    memoTimeIn: "08:00",
    memoTimeOut: "17:00",
  },
  {
    applicationNumber: "APP-2026-0005",
    applicantUsername: "user",
    officeName: "Human Resource Development Division",
    programCode: "UX-INHOUSE-001",
    formType: "nomination",
    status: "Supervisor Approved",
    title: "Human-Centered Leadership: Redefining Success with Well-Being in Mind",
    competencyType: "leadership",
    dateSubmitted: "2026-03-30",
    dateFiling: "2026-03-30",
    dateCourse: "2026-12-04",
    venue: "Virtual Training",
    applicantName: "Juan Dela Cruz",
    applicantUsernameDisplay: "user",
    employeeIdNumber: "DOTR-2026-1001",
    email: "juan.delacruz@dotr.gov.ph",
    positionTitle: "Administrative Assistant III",
    supervisorName: "Mary Grace L. Escoto",
    officeHead: "Mary Grace L. Escoto",
    dateHired: "2023-02-06",
    employmentStatus: "Permanent",
    salaryGrade: "11",
    serviceLength: "3 years, 2 months",
    contactNumber: "09171234567",
    gender: "Male",
    justification:
      "The applicant needs structured leadership exposure before being assigned to cross-unit committee work.",
    messages: [
      {
        senderName: "Mary Grace L. Escoto",
        messageText: "Reviewed and endorsed for signatory action.",
        createdAt: "2026-03-31T02:30:00Z",
      },
    ],
  },
];

const seededJobAnalysisForms: SeedJobAnalysisForm[] = [
  {
    formNumber: "JAF-2026-0001",
    submitterUsername: "user",
    officeName: "Human Resource Development Division",
    fullname: "Juan Dela Cruz",
    positionTitle: "Administrative Assistant III",
    sectionName: "Learning and Development Unit",
    alternatePosition: "Administrative Assistant II",
    purpose:
      "Document current responsibilities to support competency mapping and succession planning.",
    mainDuties:
      "Coordinates training logistics, tracks employee nominations, and prepares summary reports for HRDD.",
    toolsAndEquipment: "Google Workspace, shared drive trackers, HRDD templates, office productivity tools",
    challenges:
      "Handling concurrent nomination cycles and late supporting documents from multiple offices.",
    comments: "Form seeded from inferred future workflow.",
    dateSubmitted: "2026-03-22",
    secondaryDuties: [
      { dutyText: "Prepare post-training attendance summaries", frequencyText: "Weekly", sortOrder: 1 },
      { dutyText: "Update training records archive", frequencyText: "Daily", sortOrder: 2 },
    ],
    skills: [
      { skillName: "Records management", levelText: "Intermediate", sortOrder: 1 },
      { skillName: "Stakeholder communication", levelText: "Intermediate", sortOrder: 2 },
    ],
  },
];

const selfPacedPrograms = courses.map((course) => ({
  course,
  programCode: trainingPrograms.find((program) => program.title === course.title)?.code ?? null,
}));

async function ensureSchema() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS offices (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      office_head TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE,
      role TEXT NOT NULL CHECK (role IN ('employee', 'signatory', 'admin')),
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
    `CREATE TABLE IF NOT EXISTS auth_accounts (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      username TEXT NOT NULL UNIQUE,
      password_hint TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
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
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (program_id, session_date_text, venue)
    )`,
    `CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY,
      application_number TEXT NOT NULL UNIQUE,
      applicant_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      office_id INTEGER REFERENCES offices(id) ON DELETE SET NULL,
      program_id INTEGER REFERENCES training_programs(id) ON DELETE SET NULL,
      session_id INTEGER REFERENCES training_sessions(id) ON DELETE SET NULL,
      form_type TEXT NOT NULL DEFAULT 'nomination' CHECK (form_type IN ('nomination', 'jaf')),
      status TEXT NOT NULL CHECK (
        status IN ('Pending', 'Approved', 'Finalized', 'Pending Signatory', 'Rejected', 'Signed', 'Supervisor Approved')
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
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS application_messages (
      id INTEGER PRIMARY KEY,
      application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      sender_name TEXT NOT NULL,
      message_text TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
      created_at TEXT NOT NULL
    )`,
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
    `CREATE TABLE IF NOT EXISTS application_social_inclusion (
      application_id INTEGER PRIMARY KEY REFERENCES applications(id) ON DELETE CASCADE,
      s1 TEXT CHECK (s1 IN ('yes', 'no')),
      s2 TEXT
    )`,
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
    `CREATE TABLE IF NOT EXISTS job_analysis_secondary_duties (
      id INTEGER PRIMARY KEY,
      job_analysis_form_id INTEGER NOT NULL REFERENCES job_analysis_forms(id) ON DELETE CASCADE,
      duty_text TEXT NOT NULL,
      frequency_text TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS job_analysis_skills (
      id INTEGER PRIMARY KEY,
      job_analysis_form_id INTEGER NOT NULL REFERENCES job_analysis_forms(id) ON DELETE CASCADE,
      skill_name TEXT NOT NULL,
      level_text TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`,
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
    `CREATE INDEX IF NOT EXISTS idx_users_office_id ON users(office_id)`,
    `CREATE INDEX IF NOT EXISTS idx_training_programs_catalog_type ON training_programs(catalog_type)`,
    `CREATE INDEX IF NOT EXISTS idx_training_sessions_program_id ON training_sessions(program_id)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_title ON applications(title)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_applicant_user_id ON applications(applicant_user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_office_id ON applications(office_id)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_form_type_status ON applications(form_type, status)`,
    `CREATE INDEX IF NOT EXISTS idx_applications_date_submitted ON applications(date_submitted)`,
    `CREATE INDEX IF NOT EXISTS idx_application_messages_application_id ON application_messages(application_id)`,
    `CREATE INDEX IF NOT EXISTS idx_job_analysis_forms_submitter_user_id ON job_analysis_forms(submitter_user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_job_analysis_forms_office_id ON job_analysis_forms(office_id)`,
    `CREATE INDEX IF NOT EXISTS idx_self_paced_courses_category ON self_paced_courses(category)`,
    `CREATE INDEX IF NOT EXISTS idx_self_paced_courses_level ON self_paced_courses(level)`,
  ];

  for (const statement of statements) {
    await client.execute(statement);
  }
}

async function lookupId(table: string, column: string, value: string) {
  const result = await client.execute({
    sql: `SELECT id FROM ${table} WHERE ${column} = ? LIMIT 1`,
    args: [value],
  });

  return result.rows[0] ? Number(result.rows[0].id) : null;
}

async function seedOffices() {
  const officeNames = new Set<string>();
  OFFICES.forEach((entry) => officeNames.add(entry.split(" - ")[0]));
  seededUsers.forEach((user) => user.officeName && officeNames.add(user.officeName));
  seededApplications.forEach((application) => officeNames.add(application.officeName));
  seededJobAnalysisForms.forEach((form) => officeNames.add(form.officeName));

  for (const officeName of officeNames) {
    await client.execute({
      sql: `
        INSERT INTO offices (name, office_head, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(name) DO UPDATE SET
          office_head = excluded.office_head,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [officeName, officeHeadByOfficeName.get(officeName) ?? null],
    });
  }
}

async function seedUsers() {
  for (const seedUser of seededUsers) {
    const officeId = seedUser.officeName
      ? await lookupId("offices", "name", seedUser.officeName)
      : null;

    await client.execute({
      sql: `
        INSERT INTO users (
          username, full_name, email, role, office_id, position_title, employee_id_number,
          supervisor_name, employment_status, salary_grade, service_length, contact_number,
          gender, date_hired, is_active, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(username) DO UPDATE SET
          full_name = excluded.full_name,
          email = excluded.email,
          role = excluded.role,
          office_id = excluded.office_id,
          position_title = excluded.position_title,
          employee_id_number = excluded.employee_id_number,
          supervisor_name = excluded.supervisor_name,
          employment_status = excluded.employment_status,
          salary_grade = excluded.salary_grade,
          service_length = excluded.service_length,
          contact_number = excluded.contact_number,
          gender = excluded.gender,
          date_hired = excluded.date_hired,
          is_active = excluded.is_active,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        seedUser.username,
        seedUser.fullName,
        seedUser.email ?? null,
        seedUser.role,
        officeId,
        seedUser.positionTitle ?? null,
        seedUser.employeeIdNumber ?? null,
        seedUser.supervisorName ?? null,
        seedUser.employmentStatus ?? null,
        seedUser.salaryGrade ?? null,
        seedUser.serviceLength ?? null,
        seedUser.contactNumber ?? null,
        seedUser.gender ?? null,
        seedUser.dateHired ?? null,
      ],
    });

    const userId = await lookupId("users", "username", seedUser.username);
    if (!userId) continue;

    await client.execute({
      sql: `
        INSERT INTO auth_accounts (user_id, username, password_hint)
        VALUES (?, ?, ?)
        ON CONFLICT(username) DO UPDATE SET
          user_id = excluded.user_id,
          password_hint = excluded.password_hint
      `,
      args: [userId, seedUser.username, seedUser.passwordHint],
    });
  }

  for (const credential of CREDENTIALS) {
    const userId = await lookupId("users", "username", credential.username);
    if (!userId) continue;

    await client.execute({
      sql: `
        INSERT INTO auth_accounts (user_id, username, password_hint)
        VALUES (?, ?, ?)
        ON CONFLICT(username) DO UPDATE SET
          user_id = excluded.user_id,
          password_hint = excluded.password_hint
      `,
      args: [userId, credential.username, credential.password],
    });
  }
}

async function seedTrainingPrograms() {
  for (const program of trainingPrograms) {
    await client.execute({
      sql: `
        INSERT INTO training_programs (
          code, title, catalog_type, competency_type, level, duration_text, description,
          outline, target_audience, service_provider, delivery_mode, cost_text,
          contact_person, deadline_text, external_link, image_url, is_active, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(code) DO UPDATE SET
          title = excluded.title,
          catalog_type = excluded.catalog_type,
          competency_type = excluded.competency_type,
          level = excluded.level,
          duration_text = excluded.duration_text,
          description = excluded.description,
          outline = excluded.outline,
          target_audience = excluded.target_audience,
          service_provider = excluded.service_provider,
          delivery_mode = excluded.delivery_mode,
          cost_text = excluded.cost_text,
          contact_person = excluded.contact_person,
          deadline_text = excluded.deadline_text,
          external_link = excluded.external_link,
          image_url = excluded.image_url,
          is_active = excluded.is_active,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        program.code,
        program.title,
        program.catalogType,
        program.competencyType,
        program.level,
        program.durationText,
        program.description,
        program.outline,
        program.targetAudience,
        program.serviceProvider,
        program.deliveryMode,
        program.costText,
        program.contactPerson,
        program.deadlineText,
        program.externalLink,
        program.imageUrl,
      ],
    });
  }
}

async function seedTrainingSessions() {
  for (const session of trainingSessions) {
    const programId = await lookupId("training_programs", "code", session.programCode);
    if (!programId) continue;

    await client.execute({
      sql: `
        INSERT INTO training_sessions (
          program_id, start_date, end_date, session_date_text, venue, provider_name,
          memo_date, memo_time_in, memo_time_out
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(program_id, session_date_text, venue) DO UPDATE SET
          start_date = excluded.start_date,
          end_date = excluded.end_date,
          provider_name = excluded.provider_name,
          memo_date = excluded.memo_date,
          memo_time_in = excluded.memo_time_in,
          memo_time_out = excluded.memo_time_out
      `,
      args: [
        programId,
        session.startDate,
        session.endDate,
        session.sessionDateText,
        session.venue,
        session.providerName,
        session.memoDate,
        session.memoTimeIn,
        session.memoTimeOut,
      ],
    });
  }
}

async function findSessionId(programCode: string, sessionKey?: string) {
  if (!sessionKey) return null;
  const session = trainingSessions.find((entry) => entry.sessionKey === sessionKey);
  if (!session) return null;

  const programId = await lookupId("training_programs", "code", programCode);
  if (!programId) return null;

  const result = await client.execute({
    sql: `
      SELECT id
      FROM training_sessions
      WHERE program_id = ? AND session_date_text = ? AND venue = ?
      LIMIT 1
    `,
    args: [programId, session.sessionDateText, session.venue],
  });

  return result.rows[0] ? Number(result.rows[0].id) : null;
}

async function seedApplications() {
  for (const application of seededApplications) {
    const applicantUserId = await lookupId("users", "username", application.applicantUsername);
    const officeId = await lookupId("offices", "name", application.officeName);
    const programId = await lookupId("training_programs", "code", application.programCode);
    const sessionId = await findSessionId(application.programCode, application.sessionKey);

    await client.execute({
      sql: `
        INSERT INTO applications (
          application_number, applicant_user_id, office_id, program_id, session_id, form_type,
          status, title, competency_type, date_submitted, date_filing, date_course, venue,
          applicant_name, applicant_username, employee_id_number, email, position_title,
          supervisor_name, office_name, office_head, date_hired, employment_status,
          salary_grade, service_length, contact_number, gender, oic_name,
          alternate_participant_json, justification, user_signature_data_url,
          admin_signature_data_url, memo_html, memo_pdf_data_url, memo_mode,
          memo_provider, memo_date, memo_time_in, memo_time_out, is_read,
          is_admin_read, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(application_number) DO UPDATE SET
          applicant_user_id = excluded.applicant_user_id,
          office_id = excluded.office_id,
          program_id = excluded.program_id,
          session_id = excluded.session_id,
          form_type = excluded.form_type,
          status = excluded.status,
          title = excluded.title,
          competency_type = excluded.competency_type,
          date_submitted = excluded.date_submitted,
          date_filing = excluded.date_filing,
          date_course = excluded.date_course,
          venue = excluded.venue,
          applicant_name = excluded.applicant_name,
          applicant_username = excluded.applicant_username,
          employee_id_number = excluded.employee_id_number,
          email = excluded.email,
          position_title = excluded.position_title,
          supervisor_name = excluded.supervisor_name,
          office_name = excluded.office_name,
          office_head = excluded.office_head,
          date_hired = excluded.date_hired,
          employment_status = excluded.employment_status,
          salary_grade = excluded.salary_grade,
          service_length = excluded.service_length,
          contact_number = excluded.contact_number,
          gender = excluded.gender,
          oic_name = excluded.oic_name,
          alternate_participant_json = excluded.alternate_participant_json,
          justification = excluded.justification,
          user_signature_data_url = excluded.user_signature_data_url,
          admin_signature_data_url = excluded.admin_signature_data_url,
          memo_html = excluded.memo_html,
          memo_pdf_data_url = excluded.memo_pdf_data_url,
          memo_mode = excluded.memo_mode,
          memo_provider = excluded.memo_provider,
          memo_date = excluded.memo_date,
          memo_time_in = excluded.memo_time_in,
          memo_time_out = excluded.memo_time_out,
          is_read = excluded.is_read,
          is_admin_read = excluded.is_admin_read,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        application.applicationNumber,
        applicantUserId,
        officeId,
        programId,
        sessionId,
        application.formType,
        application.status,
        application.title,
        application.competencyType ?? null,
        application.dateSubmitted ?? null,
        application.dateFiling ?? null,
        application.dateCourse ?? null,
        application.venue ?? null,
        application.applicantName,
        application.applicantUsernameDisplay ?? application.applicantUsername,
        application.employeeIdNumber ?? null,
        application.email ?? null,
        application.positionTitle ?? null,
        application.supervisorName ?? null,
        application.officeName,
        application.officeHead ?? null,
        application.dateHired ?? null,
        application.employmentStatus ?? null,
        application.salaryGrade ?? null,
        application.serviceLength ?? null,
        application.contactNumber ?? null,
        application.gender ?? null,
        application.oicName ?? null,
        application.alternateParticipantJson ?? null,
        application.justification ?? null,
        application.userSignatureDataUrl ?? null,
        application.adminSignatureDataUrl ?? null,
        application.memoHtml ?? null,
        application.memoPdfDataUrl ?? null,
        application.memoMode ?? null,
        application.memoProvider ?? null,
        application.memoDate ?? null,
        application.memoTimeIn ?? null,
        application.memoTimeOut ?? null,
        application.isRead ?? 0,
        application.isAdminRead ?? 0,
      ],
    });

    const applicationIdResult = await client.execute({
      sql: "SELECT id FROM applications WHERE application_number = ? LIMIT 1",
      args: [application.applicationNumber],
    });
    const applicationId = applicationIdResult.rows[0]
      ? Number(applicationIdResult.rows[0].id)
      : null;
    if (!applicationId) continue;

    await client.execute({
      sql: "DELETE FROM application_messages WHERE application_id = ?",
      args: [applicationId],
    });

    for (const message of application.messages ?? []) {
      await client.execute({
        sql: `
          INSERT INTO application_messages (application_id, sender_name, message_text, is_read, created_at)
          VALUES (?, ?, ?, ?, ?)
        `,
        args: [
          applicationId,
          message.senderName,
          message.messageText,
          message.isRead ?? 0,
          message.createdAt,
        ],
      });
    }

    await client.execute({
      sql: `
        INSERT INTO application_gedsi (application_id, g1, g2, g3, g4, g5, g6, g7, g8)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(application_id) DO UPDATE SET
          g1 = excluded.g1,
          g2 = excluded.g2,
          g3 = excluded.g3,
          g4 = excluded.g4,
          g5 = excluded.g5,
          g6 = excluded.g6,
          g7 = excluded.g7,
          g8 = excluded.g8
      `,
      args: [
        applicationId,
        application.gedsi?.g1 ?? null,
        application.gedsi?.g2 ?? null,
        application.gedsi?.g3 ?? null,
        application.gedsi?.g4 ?? null,
        application.gedsi?.g5 ?? null,
        application.gedsi?.g6 ?? null,
        application.gedsi?.g7 ?? null,
        application.gedsi?.g8 ?? null,
      ],
    });

    await client.execute({
      sql: `
        INSERT INTO application_social_inclusion (application_id, s1, s2)
        VALUES (?, ?, ?)
        ON CONFLICT(application_id) DO UPDATE SET
          s1 = excluded.s1,
          s2 = excluded.s2
      `,
      args: [
        applicationId,
        application.socialInclusion?.s1 ?? null,
        application.socialInclusion?.s2 ?? null,
      ],
    });
  }
}

async function seedJobAnalysisForms() {
  for (const form of seededJobAnalysisForms) {
    const submitterUserId = await lookupId("users", "username", form.submitterUsername);
    const officeId = await lookupId("offices", "name", form.officeName);

    await client.execute({
      sql: `
        INSERT INTO job_analysis_forms (
          form_number, submitter_user_id, office_id, fullname, position_title, office_name,
          section_name, alternate_position, purpose, main_duties, tools_and_equipment,
          challenges, comments, signature_data_url, date_submitted, is_read, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(form_number) DO UPDATE SET
          submitter_user_id = excluded.submitter_user_id,
          office_id = excluded.office_id,
          fullname = excluded.fullname,
          position_title = excluded.position_title,
          office_name = excluded.office_name,
          section_name = excluded.section_name,
          alternate_position = excluded.alternate_position,
          purpose = excluded.purpose,
          main_duties = excluded.main_duties,
          tools_and_equipment = excluded.tools_and_equipment,
          challenges = excluded.challenges,
          comments = excluded.comments,
          signature_data_url = excluded.signature_data_url,
          date_submitted = excluded.date_submitted,
          is_read = excluded.is_read,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        form.formNumber,
        submitterUserId,
        officeId,
        form.fullname,
        form.positionTitle,
        form.officeName,
        form.sectionName ?? null,
        form.alternatePosition ?? null,
        form.purpose ?? null,
        form.mainDuties ?? null,
        form.toolsAndEquipment ?? null,
        form.challenges ?? null,
        form.comments ?? null,
        form.signatureDataUrl ?? null,
        form.dateSubmitted ?? null,
        form.isRead ?? 0,
      ],
    });

    const formIdResult = await client.execute({
      sql: "SELECT id FROM job_analysis_forms WHERE form_number = ? LIMIT 1",
      args: [form.formNumber],
    });
    const formId = formIdResult.rows[0] ? Number(formIdResult.rows[0].id) : null;
    if (!formId) continue;

    await client.execute({
      sql: "DELETE FROM job_analysis_secondary_duties WHERE job_analysis_form_id = ?",
      args: [formId],
    });
    await client.execute({
      sql: "DELETE FROM job_analysis_skills WHERE job_analysis_form_id = ?",
      args: [formId],
    });

    for (const duty of form.secondaryDuties) {
      await client.execute({
        sql: `
          INSERT INTO job_analysis_secondary_duties (
            job_analysis_form_id, duty_text, frequency_text, sort_order
          )
          VALUES (?, ?, ?, ?)
        `,
        args: [formId, duty.dutyText, duty.frequencyText ?? null, duty.sortOrder],
      });
    }

    for (const skill of form.skills) {
      await client.execute({
        sql: `
          INSERT INTO job_analysis_skills (
            job_analysis_form_id, skill_name, level_text, sort_order
          )
          VALUES (?, ?, ?, ?)
        `,
        args: [formId, skill.skillName, skill.levelText ?? null, skill.sortOrder],
      });
    }
  }
}

async function seedSelfPacedCourses() {
  for (const { course, programCode } of selfPacedPrograms) {
    const programId = programCode
      ? await lookupId("training_programs", "code", programCode)
      : null;

    await client.execute({
      sql: `
        INSERT INTO self_paced_courses (
          program_id, slug, title, category, level, duration_text, rating, reviews_text,
          learners_text, price_text, badge, image_url, external_link, instructor_name,
          instructor_role, instructor_bio, outcomes_json, syllabus_json, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(slug) DO UPDATE SET
          program_id = excluded.program_id,
          title = excluded.title,
          category = excluded.category,
          level = excluded.level,
          duration_text = excluded.duration_text,
          rating = excluded.rating,
          reviews_text = excluded.reviews_text,
          learners_text = excluded.learners_text,
          price_text = excluded.price_text,
          badge = excluded.badge,
          image_url = excluded.image_url,
          external_link = excluded.external_link,
          instructor_name = excluded.instructor_name,
          instructor_role = excluded.instructor_role,
          instructor_bio = excluded.instructor_bio,
          outcomes_json = excluded.outcomes_json,
          syllabus_json = excluded.syllabus_json,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        programId,
        course.slug,
        course.title,
        course.category,
        course.level,
        course.duration,
        course.rating,
        course.reviews,
        course.learners,
        course.price,
        course.badge ?? null,
        course.image ?? null,
        course.link ?? null,
        course.instructor.name,
        course.instructor.role,
        course.instructor.bio,
        JSON.stringify(course.outcomes),
        JSON.stringify(course.syllabus),
      ],
    });
  }
}

async function summarize() {
  const [officesCount, usersCount, programsCount, sessionsCount, applicationsCount, jobAnalysisCount, selfPacedCount] =
    await Promise.all([
      client.execute("SELECT COUNT(*) AS count FROM offices"),
      client.execute("SELECT COUNT(*) AS count FROM users"),
      client.execute("SELECT COUNT(*) AS count FROM training_programs"),
      client.execute("SELECT COUNT(*) AS count FROM training_sessions"),
      client.execute("SELECT COUNT(*) AS count FROM applications"),
      client.execute("SELECT COUNT(*) AS count FROM job_analysis_forms"),
      client.execute("SELECT COUNT(*) AS count FROM self_paced_courses"),
    ]);

  return {
    offices: Number(officesCount.rows[0]?.count ?? 0),
    users: Number(usersCount.rows[0]?.count ?? 0),
    trainingPrograms: Number(programsCount.rows[0]?.count ?? 0),
    trainingSessions: Number(sessionsCount.rows[0]?.count ?? 0),
    applications: Number(applicationsCount.rows[0]?.count ?? 0),
    jobAnalysisForms: Number(jobAnalysisCount.rows[0]?.count ?? 0),
    selfPacedCourses: Number(selfPacedCount.rows[0]?.count ?? 0),
  };
}

async function main() {
  await ensureSchema();
  await seedOffices();
  await seedUsers();
  await seedTrainingPrograms();
  await seedTrainingSessions();
  await seedApplications();
  await seedJobAnalysisForms();
  await seedSelfPacedCourses();

  const summary = await summarize();
  console.log("Database schema ensured and seed completed.");
  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch((error) => {
    console.error("Database seed failed.");
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.close();
  });
