export type NotificationType = "nomination" | "memo" | "lto" | "ja" | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string;
  status?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  positionTitle?: string;
  officeDivision?: string;
  salaryGrade?: string;
  employmentStatus?: string;
  contactNumber?: string;
  gender?: string;
  yearsOfService?: string;
  dateHired?: string;
  initials: string;
}
