export type NominationStatus =
  | "draft"
  | "pending_supervisor"
  | "pending_hrdd"
  | "pending_signatory"
  | "approved"
  | "disapproved"
  | "signed"
  | "Pending Signatory"
  | "Finalized"
  | "Signed"
  | "Rejected"
  | "Approved"
  | "Supervisor Approved";

export type CompetencyType = "core" | "leadership" | "functional";
export type TrainingMode = "in-house" | "out-of-house" | "self-paced";
export type EmploymentStatus = "permanent" | "cos" | "jo" | "casual" | "coterminous";
export type ActiveTab = "archive" | "dashboard";
export type ModalStage = "approve" | "closed" | "disapprove" | "idle";
export type TrainingType = "out-of-house" | "in-house";
export type OssoStatus = "pending" | "approved" | "disapproved";
export type HrddEvaluationStatus = "pending" | "passed" | "failed";
export type MemoStatus = "pending" | "approved" | "disapproved" | "signed";
export type LtoStatus = "pending" | "approved" | "disapproved" | "generated";
export type PostTrainingStatus = "pending" | "completed" | "not_applicable";

export interface NominationForm {
  id: string;
  userId: string;
  trainingId: string;
  trainingTitle: string;
  trainingDate: string;
  dateFiled: string;
  competencyType: CompetencyType;
  venue: string;
  participantName: string;
  participantIdNumber: string;
  participantEmail: string;
  participantPosition: string;
  participantOffice: string;
  participantSupervisor: string;
  participantSalaryGrade: string;
  participantYearsOfService: string;
  participantContact: string;
  participantGender: string;
  justification: string;
  userSignature?: string;
  supervisorRemarks?: string;
  hrddRemarks?: string;
  signatoryRemarks?: string;
  status: NominationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  mode: TrainingMode;
  trainingType: TrainingType;
  provider?: string;
  venue?: string;
  dateStart?: string;
  dateEnd?: string;
  competencyType: CompetencyType;
  cost?: string;
  targetAudience?: string;
  qualificationCriteria?: QualificationCriteria;
  isActive: boolean;
  createdAt: string;
}

export interface QualificationCriteria {
  offices?: string[];
  salaryGrades?: string[];
  employmentStatus?: EmploymentStatus[];
  targetLevel?: string;
  description?: string;
}

export interface SeminarConfirmationSheet {
  id: string;
  nominationId: string;
  trainingId: string;
  trainingTitle: string;
  trainingDate: string;
  trainingTimeIn?: string;
  trainingTimeOut?: string;
  provider: string;
  venue: string;
  participants: ScsParticipant[];
  scsNumber?: string;
  createdAt: string;
  status: OssoStatus;
}

export interface ScsParticipant {
  fullName: string;
  idNumber: string;
  salaryGrade: string;
  office: string;
  position: string;
  contactNumber?: string;
  status: "pending" | "confirmed" | "declined";
}

export interface JobAnalysisForm {
  id: string;
  userId: string;
  fullName: string;
  positionTitle: string;
  officeDivision: string;
  sectionUnit: string;
  alternatePosition: string;
  jobPurpose: string;
  mainDuties: string;
  toolsEquipment: string;
  challenges: string;
  additionalComments: string;
  status: NominationStatus;
  signature?: string;
  dateSubmitted: string;
  createdAt: string;
}

export interface MemoDirective {
  id: string;
  nominationId: string;
  memoType: "in-house" | "out-of-house";
  participantName: string;
  participantPosition: string;
  participantOffice: string;
  trainingTitle: string;
  trainingDate: string;
  trainingTimeIn?: string;
  trainingTimeOut?: string;
  provider: string;
  venue: string;
  objectives: string;
  requirements: string[];
  submissionDeadline: string;
  memoDate: string;
  memoNumber?: string;
  signature?: string;
  signedBy?: string;
  signedDate?: string;
  status: MemoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TravelOrderRequestForm {
  id: string;
  memoDirectiveId: string;
  participantName: string;
  participantPosition: string;
  participantOffice: string;
  employeeId: string;
  salaryGrade: string;
  purposeOfTravel: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  estimatedExpenses: string;
  transportationMode: string;
  accommodationNeeded: boolean;
  submitDate: string;
  status: OssoStatus;
  approvedBy?: string;
  approvalDate?: string;
  createdAt: string;
}

export interface LocalTravelOrder {
  id: string;
  memoDirectiveId: string;
  torfId?: string;
  participantName: string;
  participantPosition: string;
  participantOffice: string;
  trainingTitle: string;
  trainingDate: string;
  venue: string;
  ltoNumber?: string;
  torfSubmitted: boolean;
  torfApproved: boolean;
  status: LtoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HrddEvaluation {
  id: string;
  nominationId: string;
  evaluatorName: string;
  evaluationDate: string;
  qualificationReview: "passed" | "failed";
  documentsComplete: boolean;
  budgetAvailable: boolean;
  remarks?: string;
  status: HrddEvaluationStatus;
  createdAt: string;
}

export interface PostTrainingRequirement {
  id: string;
  nominationId: string;
  trainingTitle: string;
  participantName: string;
  requirements: PostTrainingItem[];
  completionDate?: string;
  status: PostTrainingStatus;
  createdAt: string;
}

export interface PostTrainingItem {
  item: string;
  description: string;
  completed: boolean;
  completedDate?: string;
}

export interface MisAssistanceRequest {
  id: string;
  requestType: "storage" | "manpower";
  requestDetails: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "processing" | "completed";
  requestedBy: string;
  requestedDate: string;
  resolutionDate?: string;
  remarks?: string;
}

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
  trainingType?: TrainingType;
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
  status: NominationStatus;
  supervisor?: string;
  title: string;
  user_signature?: string;
  venue?: string;
  scsId?: string;
  memoDirectiveId?: string;
  ltoId?: string;
  torfId?: string;
  hrddEvaluationId?: string;
  trainingType?: TrainingType;
  qualificationCriteria?: QualificationCriteria;
}

export interface PortalDatabase {
  applications: PortalApplication[];
  scsDocuments?: SeminarConfirmationSheet[];
  memoDirectives?: MemoDirective[];
  localTravelOrders?: LocalTravelOrder[];
  torfDocuments?: TravelOrderRequestForm[];
  hrddEvaluations?: HrddEvaluation[];
  postTrainingRequirements?: PostTrainingRequirement[];
  misRequests?: MisAssistanceRequest[];
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
  type: "nomination" | "scs" | "memo" | "lto" | "hrdd" | "mis";
}
