import type {
  UserApplication,
  UserDatabase,
  TrainingCatalogItem,
} from "@/types/user-portal";

export const USER_DB_KEY = "DOTr_HRDD_USER_DB";

export const OFFICES = [
  "Human Resource Development Division - Mary Grace L. Escoto",
  "Asset Management Division - Jericho V. Cabacungan",
  "Cash Division - Ma. Jesusa M. Rebadulla",
  "Central Records Division - Imelda B. Bongon",
  "General Services Division - Philip Niño P. Topacio",
  "Human Resource Management Division - Arwonder-V C. Gismundo",
  "Computer and Network Systems Division - Edgar D. Fernando",
  "Information Systems and Security Division - Murffy P. Gopez",
  "BAC Secretariat Division - Armi Cecilia L. Dela Cruz",
  "Contract Management Division - Eric E. Evardone",
  "Procurement Planning and Management Division - Eugene R. Cecilio",
  "Management Division - Lilibeth M. Baldanzo",
  "Performance Monitoring and Evaluation Division - Annaleen L. Basquiña",
  "Accounting Division - Loida J. Marzo",
  "Budget Division - Aliza Marie Guilot- Salarda",
  "Internal Audit Division I - Evelyn S. Ordinario",
  "Internal Audit Division - Ma. Chelo E. Santos",
  "Contract Review and Documentation Division - Joseph Christian N. Alvarez",
  "Legal Affairs and Research Division - Amarra A. Robles-Fabro",
  "Legislative and Issuances Division - Princess Karina M. Marquez",
  "Information Division - Robert James T. De Roque",
  "Air Transportation Planning Division - Rodrigo C. De Vera",
  "Rail Transportation Planning Division - Marie Koreen C. Hidalgo",
  "Road Transportation Planning Division - Ivan Edward D. Francisco",
  "Water Transportation Planning Division - John Patrick A. Dayao",
  "International Cooperation Division - Jasmine Marie C. Uson",
];

export const SALARY_GRADES = Array.from({ length: 30 }, (_, i) => ({
  value: String(i + 1),
  label: `SG ${i + 1}`,
}));

export const EMPLOYMENT_STATUS = [
  "Permanent",
  "Contract of Service",
  "Job Order",
  "Casual",
  "Coterminous",
];

export const TRAINING_CATALOG: Record<string, TrainingCatalogItem[]> = {
  "in-house": [
    {
      title: "Human-Centered Leadership: Redefining Success with Well-Being in Mind",
      duration: "2 days",
      level: "All Employees",
      description:
        "Discover how to lead with empathy and purpose through human-centered leadership practices.",
      image: "https://lh3.googleusercontent.com/u/0/d/1IZx5PR_AUtS9NdIHSE14b1cOQqPc6PO6=w1000",
      details: {
        outline:
          "This course empowers leaders to embrace a people-first approach to leadership by integrating well-being, empathy, and purpose into their management style. Participants will explore how human-centered leadership fosters trust, resilience, and sustainable performance.",
        competencies: "Crafting and Nurturing High-Performing Organizations",
        targetOffices: "All Employees",
        serviceProvider: "Selected Learning Service Provider",
        mode: "Virtual Training",
        cost: "Sponsored",
        contact: "Jose Mari A. Hulleza",
        deadline: "03 DECEMBER 2025",
        competencyType: "leadership",
        trainingDate: "December 4-5, 2025",
      },
    },
    {
      title: "Team Building & Collaboration",
      duration: "1 day",
      level: "All Levels",
      description:
        "Strengthen team dynamics and enhance collaborative work environments.",
    },
    {
      title: "Effective Communication Skills",
      duration: "3 days",
      level: "Beginner",
      description:
        "Master professional communication techniques for workplace success.",
    },
  ],
  "out-of-house": [
    {
      title: "Industry Conference 2025",
      duration: "3 days",
      level: "Advanced",
      description:
        "Network with industry leaders and gain insights into emerging trends.",
    },
    {
      title: "Professional Development Seminar",
      duration: "2 days",
      level: "All Levels",
      description:
        "Enhance your career with cutting-edge professional development strategies.",
    },
  ],
  "self-paced": [
    {
      title: "Service Excellence: A Guide to RA 11032 Citizen's Charter",
      duration: "Self-Paced",
      level: "All Levels",
      description:
        "Master the protocols of the Ease of Doing Business Act to ensure efficient and transparent government service delivery.",
      image: "https://lh3.googleusercontent.com/d/1up9Yd6ztQT6QHmglkK_tLqyK4aPviOEb",
      buttonText: "Start Your Learning",
      link: "https://hrdd-ldu.github.io/dotr_citizen-s_charter/",
    },
    {
      title: "The Influence of Digitalization on Psychological Well-Being",
      duration: "Self-Paced",
      level: "All Levels",
      description:
        "Explore the impact of digital technology on mental health and learn strategies for maintaining digital well-being.",
      image: "https://lh3.googleusercontent.com/d/1kZ1xFHEQcAQu29gcwCawLRIjlSaNP7oU",
      buttonText: "Start Your Learning",
      link: "https://hrdd-ldu.github.io/dotr_digital_wellness/",
    },
  ],
};

export const TRAINING_COLORS = {
  "in-house": {
    gradient: "linear-gradient(145deg, #1e3a5f 0%, #0d1b2a 100%)",
    glow: "#4facfe",
    text: "#4facfe",
    button: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  "out-of-house": {
    gradient: "linear-gradient(145deg, #2d1b4e 0%, #1a0a2e 100%)",
    glow: "#a855f7",
    text: "#a855f7",
    button: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
  },
  "self-paced": {
    gradient: "linear-gradient(145deg, #1a3c34 0%, #0d1f1a 100%)",
    glow: "#10b981",
    text: "#10b981",
    button: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
  },
};

export function readUserDatabase(): UserDatabase {
  if (typeof window === "undefined") {
    return { applications: [] };
  }

  const raw = window.localStorage.getItem(USER_DB_KEY);

  if (!raw) {
    const initial: UserDatabase = {
      submitted: 0,
      approved: 0,
      substitutions: 0,
      csc_users: 0,
      in_house: 0,
      out_house: 0,
      self_paced: 0,
      applications: [],
    };
    writeUserDatabase(initial);
    return initial;
  }

  try {
    return JSON.parse(raw) as UserDatabase;
  } catch {
    return { applications: [] };
  }
}

export function writeUserDatabase(database: UserDatabase) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(USER_DB_KEY, JSON.stringify(database));
}

export function getUserNotifications(database: UserDatabase, userName: string) {
  const myApps = (database.applications || []).filter(
    (app) => app.name === userName || app.user_account === userName
  );
  const myJAForms = (database.job_analysis_forms || []).filter(
    (app) => app.fullname === userName
  );

  const notifications: Array<{
    id: number;
    type: "nomination" | "ja";
    title: string;
    status: string;
    date: string;
    isUnread: boolean;
  }> = [];

  myApps.forEach((app) => {
    notifications.push({
      id: app.id,
      type: "nomination",
      title: app.title || "Nomination",
      status: app.status,
      date: app.date_submitted || "",
      isUnread: app.read === false,
    });
  });

  myJAForms.forEach((app) => {
    notifications.push({
      id: app.id,
      type: "ja",
      title: `Job Analysis: ${app.position || "N/A"}`,
      status: "Submitted",
      date: app.date_submitted || "",
      isUnread: app.read === false,
    });
  });

  return notifications.sort((a, b) => b.id - a.id);
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
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}
