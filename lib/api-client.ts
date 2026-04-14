// API client utilities for frontend

const API_BASE = "";

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`);
  }

  return data;
}

// Training APIs
export async function fetchTrainings(filters?: {
  catalogType?: string;
  competencyType?: string;
  isActive?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters?.catalogType) params.set("catalogType", filters.catalogType);
  if (filters?.competencyType) params.set("competencyType", filters.competencyType);
  if (filters?.isActive !== undefined) params.set("isActive", filters.isActive ? "1" : "0");

  const queryString = params.toString();
  return apiFetch<{ success: boolean; data: any[] }>(
    `/api/trainings${queryString ? `?${queryString}` : ""}`
  );
}

// Nominations APIs
export async function fetchNominations(filters?: {
  status?: string;
  userId?: string;
  formType?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.userId) params.set("userId", filters.userId);
  if (filters?.formType) params.set("formType", filters.formType);

  const queryString = params.toString();
  return apiFetch<{ success: boolean; data: any[] }>(
    `/api/nominations${queryString ? `?${queryString}` : ""}`
  );
}

export async function createNomination(nomination: any) {
  return apiFetch<{ success: boolean }>("/api/nominations", {
    method: "POST",
    body: JSON.stringify(nomination),
  });
}

export async function updateNomination(update: any) {
  return apiFetch<{ success: boolean }>("/api/nominations", {
    method: "PATCH",
    body: JSON.stringify(update),
  });
}

// Messages APIs
export async function fetchMessages(applicationId: string) {
  return apiFetch<{ success: boolean; data: any[] }>(
    `/api/messages?applicationId=${applicationId}`
  );
}

export async function createMessage(applicationId: string, senderName: string, messageText: string) {
  return apiFetch<{ success: boolean }>("/api/messages", {
    method: "POST",
    body: JSON.stringify({ applicationId, senderName, messageText }),
  });
}

// GEDSI APIs
export async function saveGedsi(applicationId: string, gedsi: any, social: any) {
  return apiFetch<{ success: boolean }>("/api/gedsi", {
    method: "POST",
    body: JSON.stringify({ applicationId, gedsi, social }),
  });
}

// Job Analysis APIs
export async function fetchJobAnalysisForms(userId?: string) {
  const params = userId ? `?userId=${userId}` : "";
  return apiFetch<{ success: boolean; data: any[] }>(`/api/job-analysis${params}`);
}

export async function createJobAnalysisForm(form: any) {
  return apiFetch<{ success: boolean; formId: number }>("/api/job-analysis", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

// MIS Requests APIs
export async function fetchMisRequests(status?: string) {
  const params = status ? `?status=${status}` : "";
  return apiFetch<{ success: boolean; data: any[] }>(`/api/mis-requests${params}`);
}

export async function createMisRequest(request: any) {
  return apiFetch<{ success: boolean }>("/api/mis-requests", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updateMisRequest(update: any) {
  return apiFetch<{ success: boolean }>("/api/mis-requests", {
    method: "PATCH",
    body: JSON.stringify(update),
  });
}

// Users API
export async function fetchUsers(filters?: { role?: string; officeId?: string }) {
  const params = new URLSearchParams();
  if (filters?.role) params.set("role", filters.role);
  if (filters?.officeId) params.set("officeId", filters.officeId);

  const queryString = params.toString();
  return apiFetch<{ success: boolean; data: any[] }>(
    `/api/users${queryString ? `?${queryString}` : ""}`
  );
}

export async function createUser(user: any) {
  return apiFetch<{ success: boolean; userId: number }>("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

// Offices API
export async function fetchOffices() {
  return apiFetch<{ success: boolean; data: any[] }>("/api/offices");
}

// Certificates API
export async function fetchCertificates(userId?: string) {
  const params = userId ? `?userId=${userId}` : "";
  return apiFetch<{ success: boolean; data: any[] }>(`/api/certificates${params}`);
}

export async function createCertificate(cert: any) {
  return apiFetch<{ success: boolean; certNumber: string; id: number }>("/api/certificates", {
    method: "POST",
    body: JSON.stringify(cert),
  });
}

// IDP API
export async function fetchIdp(userId?: string) {
  const params = userId ? `?userId=${userId}` : "";
  return apiFetch<{ success: boolean; data: any[] }>(`/api/idp${params}`);
}

export async function createIdp(idp: any) {
  return apiFetch<{ success: boolean; id: number }>("/api/idp", {
    method: "POST",
    body: JSON.stringify(idp),
  });
}

export async function updateIdp(update: any) {
  return apiFetch<{ success: boolean }>("/api/idp", {
    method: "PATCH",
    body: JSON.stringify(update),
  });
}

// Assessments API
export async function fetchAssessments(type: string, category?: string) {
  const params = new URLSearchParams({ type });
  if (category) params.set("category", category);
  return apiFetch<{ success: boolean; data: any }>(`/api/assessments?${params}`);
}

export async function submitQuizResult(result: any) {
  return apiFetch<{ success: boolean; passed: boolean; id: number }>("/api/assessments", {
    method: "POST",
    body: JSON.stringify({ type: "quiz_result", ...result }),
  });
}

export async function saveAssessmentProgress(progress: any) {
  return apiFetch<{ success: boolean }>("/api/assessments", {
    method: "POST",
    body: JSON.stringify({ type: "progress", ...progress }),
  });
}

// Audit Logs API
export async function fetchAuditLogs(entityType?: string, limit?: number) {
  const params = new URLSearchParams();
  if (entityType) params.set("entityType", entityType);
  if (limit) params.set("limit", String(limit));
  return apiFetch<{ success: boolean; data: any[] }>(`/api/audit-logs?${params}`);
}

export async function createAuditLog(log: any) {
  return apiFetch<{ success: boolean }>("/api/audit-logs", {
    method: "POST",
    body: JSON.stringify(log),
  });
}
