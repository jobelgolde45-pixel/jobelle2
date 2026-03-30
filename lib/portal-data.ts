import type {
  FolderGroup,
  PortalApplication,
  PortalDatabase,
  PortalNotification,
  TrainingCatalogItem,
} from "@/types/portal";

export const DB_KEY = "DOTr_HRDD_DB";
export const THEME_KEY = "color-theme";

export const trainingCatalog: TrainingCatalogItem[] = [
  {
    title: "Human-Centered Leadership: Redefining Success with Well-Being in Mind",
    duration: "2 days",
    level: "All Employees",
    description:
      "This course empowers leaders to embrace a people-first approach to leadership by integrating well-being, empathy, and purpose into their management style. Participants will explore how human-centered leadership fosters trust, resilience, and sustainable performance.",
    details: {
      competencies: "Crafting and Nurturing High-Performing Organizations",
      cost: "Sponsored",
      mode: "Virtual Training",
      target: "All Employees",
    },
  },
  {
    title: "Team Building & Collaboration",
    duration: "1 day",
    level: "All Levels",
    description:
      "Strengthen team dynamics and enhance collaborative work environments through practical exercises and shared problem solving.",
    details: {
      competencies: "Teamwork",
      cost: "Internal",
      mode: "In-Person",
      target: "All Levels",
    },
  },
  {
    title: "Effective Communication Skills",
    duration: "3 days",
    level: "Beginner",
    description:
      "Master professional communication techniques for workplace success, including active listening and clear writing.",
    details: {
      competencies: "Communication",
      cost: "Internal",
      mode: "In-Person",
      target: "Beginner",
    },
  },
  {
    title: "Industry Conference 2025",
    duration: "3 days",
    level: "Advanced",
    description:
      "Network with industry leaders and gain insights into emerging trends impacting the transportation sector.",
    details: {
      competencies: "Technical",
      cost: "Php 15,000",
      mode: "Conference",
      target: "Senior Staff",
    },
  },
  {
    title: "Service Excellence: A Guide to RA 11032 Citizen's Charter",
    duration: "Self-Paced",
    level: "All Levels",
    description:
      "Master the protocols of the Ease of Doing Business Act to ensure efficient and transparent government service delivery.",
    details: {
      competencies: "Public Service",
      cost: "Free",
      mode: "Online",
      target: "All Levels",
    },
  },
  {
    title: "The Influence of Digitalization on Psychological Well-Being",
    duration: "Self-Paced",
    level: "All Levels",
    description:
      "Explore the impact of digital technology on mental health and learn strategies for maintaining digital well-being.",
    details: {
      competencies: "Digital Wellness",
      cost: "Free",
      mode: "Online",
      target: "All Levels",
    },
  },
];

const demoApplications: PortalApplication[] = [
  {
    id: 24001,
    competency: "leadership",
    date_course: "2026-04-10",
    date_filing: "2026-03-18",
    date_hired: "2018-09-03",
    date_submitted: "2026-03-18",
    email: "mia.delacruz@dotr.gov.ph",
    id_number: "DOTR-18419",
    justification:
      "The nominee leads cross-functional process improvement initiatives and requires practical well-being leadership frameworks for divisional rollout.",
    memo_date: "2026-03-29",
    memo_mode: "Virtual Training",
    memo_provider: "Civil Service Learning Institute",
    memo_time_in: "09:00",
    memo_time_out: "17:00",
    name: "Mia Dela Cruz",
    office: "Human Resource Development Division",
    office_head: "Josefa B. Neri",
    position: "Administrative Officer V",
    salary_grade: "SG-18",
    service_length: "7 years, 6 months",
    status: "Pending Signatory",
    supervisor: "Josefa B. Neri",
    title: "Human-Centered Leadership: Redefining Success with Well-Being in Mind",
    venue: "MS Teams",
  },
  {
    id: 24002,
    competency: "leadership",
    date_course: "2026-04-10",
    date_filing: "2026-03-20",
    date_hired: "2021-07-12",
    date_submitted: "2026-03-20",
    email: "renz.santos@dotr.gov.ph",
    id_number: "DOTR-22041",
    justification:
      "The nominee is being prepared for supervisory assignments and will apply the course output to team engagement planning.",
    memo_date: "2026-03-29",
    memo_mode: "Virtual Training",
    memo_provider: "Civil Service Learning Institute",
    memo_time_in: "09:00",
    memo_time_out: "17:00",
    name: "Renz Santos",
    office: "Administrative Service",
    office_head: "Lourdes T. Aquino",
    position: "Administrative Officer IV",
    salary_grade: "SG-15",
    service_length: "4 years, 8 months",
    status: "Finalized",
    supervisor: "Lourdes T. Aquino",
    title: "Human-Centered Leadership: Redefining Success with Well-Being in Mind",
    venue: "MS Teams",
  },
  {
    id: 24003,
    competency: "functional",
    date_course: "2026-05-02",
    date_filing: "2026-03-12",
    date_hired: "2016-02-01",
    date_submitted: "2026-03-12",
    email: "angelica.reyes@dotr.gov.ph",
    id_number: "DOTR-15109",
    justification:
      "The training directly supports document processing, frontline response times, and compliance with citizen charter standards.",
    memo_date: "2026-03-28",
    memo_mode: "Online Learning",
    memo_provider: "ARTA Academy",
    memo_time_in: "08:30",
    memo_time_out: "12:00",
    name: "Angelica Reyes",
    office: "Office of the Assistant Secretary for Administration",
    office_head: "Marvin P. Hilario",
    position: "Senior Administrative Assistant III",
    salary_grade: "SG-12",
    service_length: "10 years, 1 month",
    status: "Signed",
    supervisor: "Marvin P. Hilario",
    title: "Service Excellence: A Guide to RA 11032 Citizen's Charter",
    venue: "LMS Portal",
  },
  {
    id: 24004,
    competency: "core",
    date_course: "2026-04-21",
    date_filing: "2026-03-25",
    date_hired: "2019-11-19",
    date_submitted: "2026-03-25",
    email: "ian.garcia@dotr.gov.ph",
    id_number: "DOTR-19287",
    justification:
      "The nominee will cascade course outputs to the division and embed collaboration routines in current project delivery workstreams.",
    memo_date: "2026-03-29",
    memo_mode: "In-Person",
    memo_provider: "DOTr HRDD",
    memo_time_in: "08:00",
    memo_time_out: "17:00",
    name: "Ian Garcia",
    office: "Planning Division",
    office_head: "Catherine M. Lim",
    position: "Planning Officer III",
    salary_grade: "SG-18",
    service_length: "6 years, 4 months",
    status: "Pending Signatory",
    supervisor: "Catherine M. Lim",
    title: "Team Building & Collaboration",
    venue: "DOTr Multi-Purpose Hall",
  },
];

function cloneDemoDatabase(): PortalDatabase {
  return { applications: structuredClone(demoApplications) };
}

export function readPortalDatabase(): PortalDatabase {
  if (typeof window === "undefined") {
    return cloneDemoDatabase();
  }

  const raw = window.localStorage.getItem(DB_KEY);

  if (!raw) {
    const seeded = cloneDemoDatabase();
    writePortalDatabase(seeded);
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw) as PortalDatabase;
    return {
      applications: Array.isArray(parsed.applications) ? parsed.applications : [],
    };
  } catch {
    const seeded = cloneDemoDatabase();
    writePortalDatabase(seeded);
    return seeded;
  }
}

export function writePortalDatabase(database: PortalDatabase) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DB_KEY, JSON.stringify(database));
}

export function getTrainingInfo(title: string): TrainingCatalogItem {
  return (
    trainingCatalog.find((training) => training.title === title) ?? {
      title,
      duration: "N/A",
      level: "N/A",
      description: "No detailed description available in the current local dataset.",
      details: {
        competencies: "N/A",
        cost: "N/A",
        mode: "N/A",
        target: "N/A",
      },
    }
  );
}

export function formatClock(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
  });
}

export function formatHeaderDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    weekday: "short",
    year: "numeric",
  });
}

export function formatMemoDate(value?: string) {
  if (!value) {
    return "__________";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "__________";
  }

  const day = `${date.getDate()}`.padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatTime(value?: string) {
  if (!value) {
    return "__________";
  }

  const [rawHours, rawMinutes] = value.split(":");
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes ?? "0");

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return "__________";
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const adjusted = hours % 12 || 12;
  return `${adjusted}:${`${minutes}`.padStart(2, "0")} ${suffix}`;
}

export function buildFolderGroups(applications: PortalApplication[]): FolderGroup[] {
  const groups = new Map<string, PortalApplication[]>();

  [...applications].reverse().forEach((application) => {
    const key = application.title || "Uncategorized Trainings";
    groups.set(key, [...(groups.get(key) ?? []), application]);
  });

  return [...groups.entries()].map(([title, items]) => ({ items, title }));
}

export function getNotifications(database: PortalDatabase): PortalNotification[] {
  return (database.applications ?? [])
    .filter(
      (application) =>
        application.status === "Approved" || application.status === "Supervisor Approved",
    )
    .map((application) => ({
      date:
        application.date_submitted ??
        new Date().toISOString().slice(0, 10),
      id: application.id,
      isUnread: application.admin_read !== true,
      message: `Memo for ${application.name} (${application.title}) is ready for review.`,
      title: "Needs Signature",
      type: "nomination" as const,
    }))
    .sort((left, right) => right.id - left.id);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function fill(value?: string) {
  return escapeHtml(value?.trim() || "N/A");
}

export function buildNominationHtml(application: PortalApplication) {
  const competency = application.competency;
  const isCore = competency === "core" ? "X" : "";
  const isLeadership = competency === "leadership" ? "X" : "";
  const isFunctional = competency === "functional" ? "X" : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nomination Form - ${escapeHtml(application.name)}</title>
    <style>
      body { margin: 0; padding: 32px 0; background: #e2e8f0; font-family: "Book Antiqua", Georgia, serif; color: #000; }
      .page { width: 750px; margin: 0 auto; background: #fff; padding: 20px 30px; box-sizing: border-box; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
      td, th { border: 1px solid #000; padding: 5px 6px; vertical-align: top; text-align: left; }
      .logos { text-align: center; width: 160px; vertical-align: middle; white-space: nowrap; }
      .logos img { width: 60px; margin: 0 4px; vertical-align: middle; display: inline-block; }
      .header-text span { font-size: 13pt; display: block; }
      .header-text strong { font-size: 13pt; }
      .section-header { background: #ddd9c3; font-weight: 700; font-size: 10pt; }
      .nested-table td { border: none; padding: 2px 6px; }
      .nested-table .box { width: 15px; border: 1px solid #000; text-align: center; }
      .input-line { border-bottom: 1px solid #000; display: inline-block; min-height: 14px; width: 90%; }
      .yes-no { list-style: none; padding: 0; margin: 0; }
      .yes-no li { margin-bottom: 3px; }
      .signature { height: 50px; display: flex; align-items: end; justify-content: center; margin-top: 10px; }
      .signature img { max-height: 50px; max-width: 180px; object-fit: contain; }
      .terms-header { background: #808080; color: #fff; text-align: center; font-weight: 700; padding: 5px; border: 1px solid #000; margin-top: 20px; margin-bottom: 10px; }
      .footnote { font-size: 8pt; margin-top: 20px; }
      .footnote hr { border: 0; border-top: 1px solid #000; width: 33%; margin-left: 0; margin-bottom: 5px; }
      .actions { position: sticky; top: 0; display: flex; justify-content: center; gap: 12px; padding: 16px; background: rgba(226, 232, 240, 0.9); backdrop-filter: blur(8px); }
      .actions button { border: 0; border-radius: 999px; padding: 10px 16px; font: inherit; font-weight: 700; cursor: pointer; color: #fff; background: #0f172a; }
      @media print { body { background: #fff; padding: 0; } .actions { display: none; } .page { width: auto; margin: 0; box-shadow: none; } }
    </style>
  </head>
  <body>
    <div class="actions">
      <button onclick="window.print()">Print / Save as PDF</button>
      <button onclick="window.close()">Close</button>
    </div>
    <div class="page">
      <table>
        <tr>
          <td rowspan="3" class="logos">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png" alt="DOTr" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Bagong_Pilipinas_logo.png" alt="Bagong Pilipinas" />
          </td>
          <td colspan="3" class="header-text">
            <span>Republic of the Philippines</span>
            <strong>Department of Transportation</strong>
          </td>
        </tr>
        <tr>
          <td>Document No:<br />DOTr-HRDD-Forms-001</td>
          <td>Rev. No.: 005</td>
          <td>Effective Date: _______ 2025</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align:center;font-weight:700;">LEARNING AND DEVELOPMENT NOMINATION FORM</td>
        </tr>
      </table>
      <p><strong>INSTRUCTIONS:</strong> This form is used in nominating an employee to attend a Learning & Development Intervention (LDI). Fill out this form and attach the signed and scanned copy in the Online Nomination Form.</p>
      <table>
        <tr><td colspan="3" class="section-header">I. Training/Program Information</td></tr>
        <tr><td colspan="3"><strong>Title of Training/Course:</strong> <span class="input-line" style="width:80%;">${fill(application.title)}</span></td></tr>
        <tr>
          <td style="width:50%;"><strong>Date of Training/Course:</strong> <span class="input-line" style="width:50%;">${fill(application.date_course)}</span></td>
          <td colspan="2"><strong>Date of Filing:</strong> <span class="input-line" style="width:60%;">${fill(application.date_filing)}</span></td>
        </tr>
        <tr>
          <td>
            <strong>Type of Competency to be Addressed:</strong>
            <table class="nested-table">
              <tr><td class="box">${isCore}</td><td>Core Competency</td></tr>
              <tr><td class="box">${isLeadership}</td><td>Leadership Competency</td></tr>
              <tr><td class="box">${isFunctional}</td><td>Functional Competency</td></tr>
            </table>
          </td>
          <td colspan="2"><strong>Venue:</strong> <span class="input-line" style="width:80%;">${fill(application.venue)}</span></td>
        </tr>
        <tr><td colspan="3" class="section-header">II. Participant's Information</td></tr>
        <tr>
          <td colspan="2">
            <strong>Name of Personnel:</strong> <span class="input-line">${fill(application.name)}</span><br /><br />
            <strong>ID Number:</strong> <span class="input-line">${fill(application.id_number)}</span><br /><br />
            <strong>Email Address:</strong> <span class="input-line">${fill(application.email)}</span>
          </td>
          <td><strong>Office/Unit Head:</strong> <span class="input-line" style="width:95%;">${fill(application.office_head ?? application.office)}</span></td>
        </tr>
        <tr>
          <td colspan="2"><strong>Position Title:</strong> <span class="input-line">${fill(application.position)}</span></td>
          <td><strong>Immediate Supervisor:</strong> <span class="input-line" style="width:95%;">${fill(application.supervisor)}</span></td>
        </tr>
        <tr>
          <td colspan="2">
            <strong>Date Hired:</strong> <span class="input-line" style="width:60%;">${fill(application.date_hired)}</span><br /><br />
            <strong>Status of Employment:</strong> <span class="input-line" style="width:50%;">Regular</span><br /><br />
            <strong>Salary Grade:</strong> <span class="input-line" style="width:60%;">${fill(application.salary_grade)}</span><br /><br />
            <strong>Yrs./Months in DOTr Service:</strong> <span class="input-line" style="width:40%;">${fill(application.service_length)}</span><br /><br />
            <strong>Contact/Viber Number:</strong> <span class="input-line" style="width:50%;">${fill(application.contact)}</span><br /><br />
            <strong>Gender (Optional):</strong> <span class="input-line" style="width:50%;">${fill(application.gender)}</span>
          </td>
          <td>
            <strong>Name, Position and Office of the Designated Officer-in-Charge (for SG 24 and up):</strong><br />
            <span class="input-line" style="width:95%;">${fill(application.oic)}</span>
          </td>
        </tr>
        <tr><td colspan="3" class="section-header">III. Alternate/Substitute Participant's Information</td></tr>
        <tr>
          <td style="width:50%;">
            <strong>Name of Personnel:</strong> <span class="input-line"></span><br /><br />
            <strong>ID Number:</strong> <span class="input-line"></span><br /><br />
            <strong>Email Address:</strong> <span class="input-line"></span><br /><br />
            <strong>Position Title:</strong> <span class="input-line"></span><br /><br />
            <strong>Date Hired:</strong> <span class="input-line"></span>
          </td>
          <td colspan="2">
            <strong>Status of Employment:</strong> <span class="input-line" style="width:60%;"></span><br /><br />
            <strong>Salary Grade:</strong> <span class="input-line" style="width:70%;"></span><br /><br />
            <strong>Yrs./Months in DOTr Service:</strong> <span class="input-line" style="width:40%;"></span><br /><br />
            <strong>Contact/Viber Number:</strong> <span class="input-line" style="width:50%;"></span><br /><br />
            <strong>Gender (Optional):</strong> <span class="input-line" style="width:60%;"></span>
          </td>
        </tr>
        <tr><td colspan="3" class="section-header">IV. Justification of Nominee’s Attendance</td></tr>
        <tr><td colspan="3" style="min-height:50px;">${fill(application.justification)}</td></tr>
        <tr><td colspan="3" class="section-header">V. Gender Equality, Disability and Social Inclusion (GEDSI)</td></tr>
        <tr>
          <td colspan="2">
            <ol>
              <li>Do you have mobility problems? Like difficulty in walking and/or climbing stairs?</li>
              <li>Are you having an emotional/behavioural problem?</li>
              <li>Do you have difficulty in reading and identifying speech sounds?</li>
              <li>Do you have difficulty communicating?</li>
              <li>Do you have difficulty remembering or concentrating?</li>
              <li>Do you have difficulty in doing simple arithmetic calculations?</li>
              <li>Do you have difficulty in reading even with corrective lenses?</li>
              <li>Do you have any difficulty in hearing?</li>
            </ol>
          </td>
          <td>
            <ul class="yes-no">
              <li>___ Yes &nbsp;&nbsp; ___ No</li>
              <li>___ Yes &nbsp;&nbsp; ___ No</li>
              <li>___ Yes &nbsp;&nbsp; ___ No</li>
              <li>___ Yes &nbsp;&nbsp; ___ No</li>
              <li>___ Yes &nbsp;&nbsp; ___ No</li>
              <li>___ Yes &nbsp;&nbsp; ___ No</li>
              <li>___ Yes &nbsp;&nbsp; ___ No</li>
              <li>___ Yes &nbsp;&nbsp; ___ No</li>
            </ul>
          </td>
        </tr>
        <tr><td colspan="3" class="section-header">VI. Social Inclusion</td></tr>
        <tr>
          <td colspan="2">
            <ol>
              <li>Are you a solo parent?</li>
              <li>Are you part of the Indigenous People group? (Specify: __________)</li>
            </ol>
          </td>
          <td>
            <ul class="yes-no">
              <li>___ Yes &nbsp;&nbsp; ___ No</li>
              <li>___ Yes &nbsp;&nbsp; ___ No</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td colspan="3"><em><strong>This is to certify that I have briefed the nominees of the expected output, and we have agreed on how and when he/she will apply the new learning in the workplace.</strong></em></td>
        </tr>
        <tr>
          <td style="width:50%;">
            Signature of Primary Participant:
            <div class="signature">${application.user_signature ? `<img src="${application.user_signature}" alt="Primary participant signature" />` : ""}</div>
          </td>
          <td colspan="2">
            Signature of Office/Unit Head:
            <div class="signature">${application.admin_signature ? `<img src="${application.admin_signature}" alt="Office head signature" />` : ""}</div>
          </td>
        </tr>
      </table>
      <div style="page-break-before: always;">
        <div class="terms-header">TERMS AND CONDITIONS</div>
        <p>By submitting this Learning and Development Nomination Form, the parties agree to the following conditions regarding attendance and substitution:</p>
        <ol>
          <li><strong>ADVANCE NOTICE OF CANCELLATION.</strong> The Primary Participant shall notify the appropriate office at least three (3) days prior to the training if he/she will not pursue the scheduled Learning & Development Intervention (LDI).</li>
          <li><strong>FORMAL JUSTIFICATION AND SUBSTITUTION.</strong> The Primary Participant must provide a formal written justification for declining the training. Upon this formal notification, the Alternate/Substitute Participant (ASP) will be endorsed to attend the training.</li>
          <li><strong>SAME-DAY CANCELLATION.</strong> In cases in which the Primary Participant declines the training on the actual day of the event, the cancellation shall only be accepted if it is due to a major reason.</li>
          <li><strong>ACCEPTABLE MAJOR REASONS.</strong> Valid major reasons for same-day cancellation and the immediate endorsement of the Alternate/Substitute Participant (ASP) include illness, force majeure, death, and urgent official directives from the department.</li>
          <li><strong>RELEVANCE TO FUNCTIONS.</strong> The nomination to the LDI must be formally justified based on its relevance to the participant’s actual functions and specific development needs.</li>
          <li><strong>APPROVAL AND ENDORSEMENT.</strong> The nomination, including the designation of the ASP, is only considered valid and final upon the complete briefing of the nominee and the official signature of the Office/Unit Head.</li>
        </ol>
        <div class="footnote"><hr /><em>Revised Learning and Development Nomination Form</em>, DOTr-HRDD-Forms-001 | Rev. No.: 005, 2025</div>
      </div>
    </div>
  </body>
</html>`;
}

export function buildMemoHtml(
  application: PortalApplication,
  objectives: string,
  signature?: string,
) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Memo Directive - ${escapeHtml(application.name)}</title>
    <style>
      body { margin: 0; padding: 32px 0; background: #e2e8f0; font-family: "Book Antiqua", "Times New Roman", serif; color: #000; }
      .actions { position: sticky; top: 0; display: flex; justify-content: center; gap: 12px; padding: 16px; background: rgba(226, 232, 240, 0.9); backdrop-filter: blur(8px); }
      .actions button { border: 0; border-radius: 999px; padding: 10px 16px; font: inherit; font-weight: 700; cursor: pointer; color: #fff; background: #0f172a; }
      .page { width: 800px; margin: 0 auto; background: #fff; padding: 30px 40px; box-sizing: border-box; }
      .memo-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
      .logos { display: flex; gap: 10px; flex-shrink: 0; }
      .logos img { width: 80px; height: 80px; object-fit: contain; }
      .title p { margin: 0; line-height: 1.15; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12pt; }
      td, th { padding: 6px 0; vertical-align: top; }
      .grid-table { width: 95%; margin: 25px auto; font-size: 11pt; }
      .grid-table th, .grid-table td { border: 1px solid #000; padding: 10px; }
      .section { display: flex; margin-bottom: 20px; text-align: justify; line-height: 1.4; font-size: 12pt; }
      .index { width: 45px; flex-shrink: 0; }
      .signature { margin-top: 50px; font-size: 12pt; }
      .signature-box { position: relative; width: 300px; height: 90px; }
      .signature-box img { position: absolute; bottom: 10px; left: 0; max-height: 80px; max-width: 200px; object-fit: contain; }
      @media print { body { background: #fff; padding: 0; } .actions { display: none; } .page { width: auto; margin: 0; } }
    </style>
  </head>
  <body>
    <div class="actions">
      <button onclick="window.print()">Print / Save as PDF</button>
      <button onclick="window.close()">Close</button>
    </div>
    <div class="page">
      <div class="memo-header">
        <div class="logos">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png" alt="DOTr" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Bagong_Pilipinas_logo.png" alt="Bagong Pilipinas" />
        </div>
        <div class="title">
          <p style="font-size: 13pt;">Republic of the Philippines</p>
          <p style="font-size: 14pt; font-weight: bold; text-transform: uppercase;">Department of Transportation</p>
        </div>
      </div>
      <div style="font-size:16pt; font-weight:700; margin:40px 0 30px; text-transform:uppercase;">Memorandum</div>
      <table>
        <tr><td style="width:80px;">To</td><td style="width:20px; text-align:center;">:</td><td style="font-weight:700;">All Concerned Personnel</td></tr>
        <tr><td>From</td><td style="text-align:center;">:</td><td style="font-weight:700;">The Chief Administrative Officer<br /><span style="font-weight:400;">For Human Resource Development Division</span></td></tr>
        <tr><td>Subject</td><td style="text-align:center;">:</td><td style="font-weight:700; text-transform:uppercase;">Attendance to the ${escapeHtml(application.title)}</td></tr>
        <tr><td>Date</td><td style="text-align:center;">:</td><td style="font-weight:700;">${formatMemoDate(application.memo_date ?? new Date().toISOString())}</td></tr>
      </table>
      <hr style="border:0; border-top:2px solid #000; margin-bottom:25px;" />
      <div class="section">
        <div class="index">1.0</div>
        <div>This refers to the approved nominations of the listed personnel to the learning program entitled "<b>${escapeHtml(application.title)}</b>," set for <b>${fill(application.date_course)}</b> from <b>${formatTime(application.memo_time_in)}</b> to <b>${formatTime(application.memo_time_out)}</b>, to be conducted by the <b>${fill(application.memo_provider ?? "the Training Provider")}</b> via <b>${fill(application.memo_mode ?? "Learning Program")}</b>.</div>
      </div>
      <table class="grid-table">
        <thead>
          <tr><th colspan="2" style="text-align:center;">Nominated Participants</th></tr>
          <tr><th style="width:50%; text-align:center;">Name/Position</th><th style="width:50%; text-align:center;">Office/Division</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>${escapeHtml(application.name)}</b><br /><i>${escapeHtml(application.position)}</i></td>
            <td>${escapeHtml(application.office)}</td>
          </tr>
        </tbody>
      </table>
      <div class="section">
        <div class="index">2.0</div>
        <div>${escapeHtml(objectives)}</div>
      </div>
      <div class="section">
        <div class="index">3.0</div>
        <div>In view of this, the participants are hereby directed to attend the said training program. Further, for the Learning and Development program to be fully credited, they are required to submit all post-training requirements relative to the activity to the Human Resource Development Division (HRDD).</div>
      </div>
      <table class="grid-table">
        <thead>
          <tr><th style="text-align:center;">Training Requirement(s)</th><th style="text-align:center;">Date of Submission</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>1. Post-Training Evaluation Form &amp; Post-Training Report (PTR)</td>
            <td style="text-align:center;"><i>Within seven (7) days of the training&apos;s completion.</i><br /><br /><b style="color: blue; text-decoration: underline;">https://bit.ly/PTRL1-Evaluation</b></td>
          </tr>
          <tr>
            <td>2. Certificate of Completion/Attendance</td>
            <td style="text-align:center;"><i>Within three (3) days from receipt</i></td>
          </tr>
        </tbody>
      </table>
      <div class="section"><div class="index">4.0</div><div>All submissions shall be in electronic form, preferably via email, and with the use of digital signatures, if available.</div></div>
      <div class="section"><div class="index">5.0</div><div>In case of non-attendance, the participants are directed to submit a justification to the HRDD no later than seven (7) working days after the supposed L&amp;D activity.</div></div>
      <div class="section" style="margin-bottom:40px;"><div class="index">6.0</div><div>For information, guidance, and strict compliance.</div></div>
      <div class="signature">
        <div class="signature-box">
          ${signature ? `<img src="${signature}" alt="Authorized signatory signature" />` : ""}
          <div style="position:absolute; bottom:0; font-weight:700; text-transform:uppercase;">Mary Grace L. Escoto</div>
        </div>
        <div style="margin-top:5px;">Chief Administrative Officer</div>
      </div>
    </div>
  </body>
</html>`;
}
