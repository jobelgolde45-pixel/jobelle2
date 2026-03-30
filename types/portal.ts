export type PortalStatus =
  | "Approved"
  | "Finalized"
  | "Pending Signatory"
  | "Rejected"
  | "Signed"
  | "Supervisor Approved";

export type CompetencyType = "core" | "functional" | "leadership";
export type ActiveTab = "archive" | "dashboard";
export type ModalStage = "approve" | "closed" | "disapprove" | "idle";

export interface PortalMessage {
  read: boolean;
  sender: string;
  text: string;
  timestamp: string;
}

export interface TrainingDetails {
  competencies: string;
  cost: string;
  mode: string;
  target: string;
}

export interface TrainingCatalogItem {
  description: string;
  details: TrainingDetails;
  duration: string;
  level: string;
  title: string;
}

export interface PortalApplication {
  admin_read?: boolean;
  admin_signature?: string;
  competency?: CompetencyType;
  contact?: string;
  date_course?: string;
  date_filing?: string;
  date_hired?: string;
  date_submitted?: string;
  email?: string;
  formType?: string;
  gender?: string;
  id: number;
  id_number?: string;
  justification?: string;
  memoHtml?: string;
  memo_date?: string;
  memo_mode?: string;
  memo_pdf?: string;
  memo_provider?: string;
  memo_time_in?: string;
  memo_time_out?: string;
  messages?: PortalMessage[];
  name: string;
  office: string;
  office_head?: string;
  oic?: string;
  position: string;
  read?: boolean;
  salary_grade?: string;
  service_length?: string;
  status: PortalStatus;
  supervisor?: string;
  title: string;
  user_signature?: string;
  venue?: string;
}

export interface PortalDatabase {
  applications: PortalApplication[];
}

export interface FolderGroup {
  items: PortalApplication[];
  title: string;
}

export interface PortalNotification {
  date: string;
  id: number;
  isUnread: boolean;
  message: string;
  title: string;
  type: "nomination";
}
