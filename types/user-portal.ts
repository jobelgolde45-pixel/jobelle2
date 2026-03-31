export type UserStatus = "Pending" | "Approved" | "Supervisor Approved" | "Rejected" | "Signed";

export type ContentSection =
  | "trainings-main"
  | "trainings-interventions"
  | "trainings-request"
  | "nomination-form"
  | "comp-intro"
  | "comp-form"
  | "csc-main"
  | "csc-tips"
  | "csc-reviewers"
  | "csc-numerical"
  | "csc-grammar"
  | "csc-general"
  | "reports"
  | "reports-admin-finance"
  | "report-cash"
  | "notifications"
  | "logout";

export interface UserApplication {
  id: number;
  status: UserStatus;
  date_submitted?: string;
  title?: string;
  date_course?: string;
  date_filing?: string;
  venue?: string;
  competency?: "core" | "leadership" | "functional";
  name?: string;
  user_account?: string;
  id_num?: string;
  email?: string;
  office?: string;
  position?: string;
  supervisor?: string;
  date_hired?: string;
  emp_status?: string;
  sg?: string;
  service?: string;
  contact?: string;
  gender?: string;
  oic?: string;
  asp?: string;
  asp_info?: {
    name?: string;
    id?: string;
    email?: string;
    position?: string;
    hired?: string;
    status?: string;
    sg?: string;
    service?: string;
    contact?: string;
    gender?: string;
  };
  justification?: string;
  user_signature?: string;
  admin_signature?: string;
  gedsi?: {
    g1?: "yes" | "no";
    g2?: "yes" | "no";
    g3?: "yes" | "no";
    g4?: "yes" | "no";
    g5?: "yes" | "no";
    g6?: "yes" | "no";
    g7?: "yes" | "no";
    g8?: "yes" | "no";
  };
  social?: {
    s1?: "yes" | "no";
    s2?: string;
  };
  read?: boolean;
  messages?: UserMessage[];
}

export interface UserMessage {
  sender: string;
  text: string;
  timestamp: string;
  read?: boolean;
}

export interface JobAnalysisForm {
  id: number;
  fullname?: string;
  position?: string;
  office?: string;
  section?: string;
  alternate?: string;
  purpose?: string;
  main_duties?: string;
  secondary_duties?: Array<{ duty: string; frequency: string }>;
  skills?: Array<{ skill: string; level: string }>;
  tools?: string;
  challenges?: string;
  comments?: string;
  signature?: string;
  date_submitted?: string;
  read?: boolean;
  messages?: UserMessage[];
}

export interface UserNotification {
  id: number;
  type: "nomination" | "ja";
  title: string;
  message: string;
  status: UserStatus;
  date: string;
  isUnread: boolean;
}

export interface UserDatabase {
  submitted?: number;
  approved?: number;
  substitutions?: number;
  csc_users?: number;
  in_house?: number;
  out_house?: number;
  self_paced?: number;
  applications: UserApplication[];
  job_analysis_forms?: JobAnalysisForm[];
  userProfile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    bio?: string;
    social?: {
      facebook?: string;
      x?: string;
      linkedin?: string;
      instagram?: string;
      country?: string;
      city?: string;
      postal?: string;
      taxid?: string;
    };
  };
  notifications?: Array<{
    type: string;
    message: string;
    timestamp: number;
    status: string;
  }>;
}

export interface TrainingCatalogItem {
  title: string;
  duration: string;
  level: string;
  description: string;
  image?: string;
  buttonText?: string;
  link?: string;
  details?: {
    outline?: string;
    competencies?: string;
    targetOffices?: string;
    serviceProvider?: string;
    mode?: string;
    cost?: string;
    contact?: string;
    deadline?: string;
    competencyType?: string;
    trainingDate?: string;
  };
}
