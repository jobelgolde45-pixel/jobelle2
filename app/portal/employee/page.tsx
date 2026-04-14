"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, useClock } from "@/lib/hooks";
import { Card, CardHeader, CardTitle, CardContent, StatCard, Badge, Button, Modal } from "@/components/ui";
import { Input, Select, Textarea } from "@/components/ui";
import {
  BookOpen,
  ClipboardCheck,
  UserCircle,
  FileText,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Truck,
  Users,
  Calendar,
  MapPin,
  Target,
  AlertCircle,
  Award,
  Brain,
  GraduationCap,
  TrendingUp,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
  Star,
  ChevronLeft,
  Lightbulb,
} from "lucide-react";
import { fetchTrainings, fetchNominations, createNomination, createMisRequest, fetchCertificates, fetchIdp, createIdp, fetchAssessments, submitQuizResult } from "@/lib/api-client";
import type { TrainingProgram, NominationForm, TrainingType, QualificationCriteria } from "@/types/portal";
import { motion, AnimatePresence } from "framer-motion";

const OFFICES = [
  { value: "hrdd", label: "Human Resource Development Division" },
  { value: "admin", label: "Administrative Service" },
  { value: "finance", label: "Finance Service" },
  { value: "planning", label: "Planning Service" },
  { value: "asset", label: "Asset Management Division" },
  { value: "cash", label: "Cash Division" },
  { value: "records", label: "Central Records Division" },
];

const COMPETENCY_TYPES = [
  { value: "core", label: "Core Competency" },
  { value: "leadership", label: "Leadership Competency" },
  { value: "functional", label: "Functional Competency" },
];

const MIS_REQUEST_TYPES = [
  { value: "storage", label: "Storage Request" },
  { value: "manpower", label: "Manpower Request" },
];

const MIS_PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const DEMO_FLASHCARDS = [
  { id: 1, question: "What does CSC stand for?", answer: "Civil Service Commission — the central personnel agency of the Philippine government.", hint: "Think of the government body managing civil servants." },
  { id: 2, question: "What is PRIME-HRM?", answer: "Program to Institutionalize Meritocracy and Excellence in Human Resource Management — a CSC framework for assessing HRM maturity.", hint: "It's a CSC framework for HR excellence." },
  { id: 3, question: "What is RA 11032?", answer: "Ease of Doing Business and Efficient Government Service Delivery Act of 2018 — mandates the Citizen's Charter.", hint: "Related to the Citizen's Charter." },
  { id: 4, question: "What is an IDP?", answer: "Individual Development Plan — a document outlining an employee's competency gaps and planned learning activities.", hint: "It's a personal learning roadmap." },
  { id: 5, question: "What is the Citizen's Charter?", answer: "An official document that communicates, in simple terms, information on the services provided by a government agency.", hint: "It's a transparency document for government services." },
];

const DEMO_QUIZ = [
  { id: 1, question: "Which law mandates the Citizen's Charter for government agencies?", options_json: JSON.stringify(["RA 9485", "RA 11032", "RA 6713", "RA 7160"]), correct_answer: 1, explanation: "RA 11032 (Ease of Doing Business Act) mandates the Citizen's Charter." },
  { id: 2, question: "PRIME-HRM stands for:", options_json: JSON.stringify(["Program to Institutionalize Meritocracy and Excellence in HRM", "Philippine Reform Initiative for Merit-based HRM", "Public Resource Integration for Merit Excellence in HRM", "None of the above"]), correct_answer: 0, explanation: "PRIME-HRM stands for Program to Institutionalize Meritocracy and Excellence in Human Resource Management." },
  { id: 3, question: "The CSC is headed by a:", options_json: JSON.stringify(["Secretary", "Chairperson", "Director General", "Commissioner"]), correct_answer: 1, explanation: "The Civil Service Commission is headed by a Chairperson." },
  { id: 4, question: "An IDP is primarily used for:", options_json: JSON.stringify(["Payroll processing", "Competency gap analysis and learning planning", "Leave management", "Performance rating"]), correct_answer: 1, explanation: "An IDP identifies competency gaps and plans development activities." },
  { id: 5, question: "Under RA 6713, government employees must file a SALN:", options_json: JSON.stringify(["Every 5 years", "Only upon appointment", "Annually", "Upon retirement only"]), correct_answer: 2, explanation: "SALN must be filed annually under RA 6713 (Code of Conduct and Ethical Standards)." },
];

type Section = "dashboard" | "trainings" | "nomination" | "competency" | "mis-assistance" | "post-training" | "idp" | "certificates" | "csc-exam" | "assessments";

interface MisRequest {
  id: string;
  requestType: "storage" | "manpower";
  requestDetails: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "processing" | "completed";
  requestedDate: string;
}

interface PostTrainingItem {
  id: string;
  trainingTitle: string;
  requirements: Array<{ item: string; completed: boolean }>;
  status: "pending" | "completed";
}

export default function EmployeePortalPage() {
  const { user, logout, isLoggingOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { formatClock, formatDate } = useClock();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [showNominationModal, setShowNominationModal] = useState(false);
  const [showScsPreviewModal, setShowScsPreviewModal] = useState(false);
  const [showMisModal, setShowMisModal] = useState(false);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<TrainingProgram | null>(null);
  const [selectedQualification, setSelectedQualification] = useState<QualificationCriteria | null>(null);
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [nominations, setNominations] = useState<NominationForm[]>([]);
  const [misRequests, setMisRequests] = useState<MisRequest[]>([]);
  const [postTrainingItems, setPostTrainingItems] = useState<PostTrainingItem[]>([]);
  const [trainingFilter, setTrainingFilter] = useState<TrainingType | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  // New section states
  const [certificates, setCertificates] = useState<any[]>([]);
  const [idpList, setIdpList] = useState<any[]>([]);
  const [showIdpModal, setShowIdpModal] = useState(false);
  const [idpForm, setIdpForm] = useState({ currentCompetencies: "", targetCompetencies: "", developmentActivities: "", targetDate: "", remarks: "" });
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [examCategory, setExamCategory] = useState("Civil Service");
  const [assessmentMode, setAssessmentMode] = useState<"menu" | "flashcard" | "quiz">("menu");

  useEffect(() => {
    async function loadData() {
      try {
        const [trainingsResult, nominationsResult, certsResult, idpResult] = await Promise.all([
          fetchTrainings(),
          user?.id ? fetchNominations({ userId: user.id }) : Promise.resolve({ success: true, data: [] }),
          user?.id ? fetchCertificates(user.id) : Promise.resolve({ success: true, data: [] }),
          user?.id ? fetchIdp(user.id) : Promise.resolve({ success: true, data: [] }),
        ]);
        if (trainingsResult.success) setTrainings(trainingsResult.data);
        if (nominationsResult.success) setNominations(nominationsResult.data as NominationForm[]);
        if (certsResult.success) setCertificates(certsResult.data);
        if (idpResult.success) setIdpList(idpResult.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const filteredTrainings = trainingFilter === "all"
    ? trainings
    : trainings.filter(t => t.trainingType === trainingFilter);

  const handleRegisterTraining = (training: TrainingProgram) => {
    setSelectedTraining(training);
    setShowNominationModal(true);
  };

  const handleViewQualification = (criteria: QualificationCriteria) => {
    setSelectedQualification(criteria);
    setShowQualificationModal(true);
  };

  const handleSubmitNomination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const nomination: NominationForm = {
      id: `nom_${Date.now()}`,
      userId: user?.id || "",
      trainingId: selectedTraining?.id || "",
      trainingTitle: selectedTraining?.title || "",
      trainingDate: formData.get("trainingDate") as string,
      dateFiled: new Date().toISOString().split("T")[0],
      competencyType: formData.get("competencyType") as NominationForm["competencyType"],
      venue: formData.get("venue") as string,
      participantName: user?.name || "",
      participantIdNumber: formData.get("idNumber") as string,
      participantEmail: user?.email || "",
      participantPosition: formData.get("position") as string,
      participantOffice: formData.get("office") as string,
      participantSupervisor: formData.get("supervisor") as string,
      participantSalaryGrade: formData.get("salaryGrade") as string,
      participantYearsOfService: formData.get("yearsOfService") as string,
      participantContact: formData.get("contact") as string,
      participantGender: formData.get("gender") as string,
      justification: formData.get("justification") as string,
      status: "pending_supervisor",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await createNomination(nomination);
      setNominations((prev) => [...prev, nomination]);
      setShowNominationModal(false);
      setShowScsPreviewModal(true);
      setSelectedTraining(null);
    } catch (error) {
      console.error("Failed to submit nomination:", error);
      alert("Failed to submit nomination. Please try again.");
    }
  };

  const handleSubmitMisRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const request: MisRequest = {
      id: `mis_${Date.now()}`,
      requestType: formData.get("requestType") as "storage" | "manpower",
      requestDetails: formData.get("requestDetails") as string,
      priority: formData.get("priority") as "low" | "medium" | "high",
      status: "pending",
      requestedDate: new Date().toISOString().split("T")[0],
    };

    try {
      await createMisRequest(request);
      setMisRequests((prev) => [...prev, request]);
      setShowMisModal(false);
      alert("MIS Assistance Request submitted successfully!");
    } catch (error) {
      console.error("Failed to submit MIS request:", error);
      alert("Failed to submit MIS request. Please try again.");
    }
  };

  const getTrainingTypeBadge = (type?: TrainingType) => {
    switch (type) {
      case "out-of-house":
        return <Badge variant="info">Out-of-House</Badge>;
      case "in-house":
        return <Badge variant="success">In-House</Badge>;
      default:
        return <Badge variant="default">Training</Badge>;
    }
  };

  const handleSubmitIdp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createIdp({ userId: user?.id, ...idpForm });
      if (result.success) {
        const updated = await fetchIdp(user?.id);
        if (updated.success) setIdpList(updated.data);
        setShowIdpModal(false);
        setIdpForm({ currentCompetencies: "", targetCompetencies: "", developmentActivities: "", targetDate: "", remarks: "" });
      }
    } catch (e) {
      alert("Failed to submit IDP.");
    }
  };

  const handleLoadAssessments = async (mode: "flashcard" | "quiz") => {
    try {
      const result = await fetchAssessments(mode, examCategory);
      if (result.success) {
        if (mode === "flashcard") {
          setFlashcards(Array.isArray(result.data) ? result.data : []);
          setFlashcardIndex(0);
          setFlashcardFlipped(false);
        } else {
          setQuizQuestions(Array.isArray(result.data) ? result.data : []);
          setQuizAnswers({});
          setQuizSubmitted(false);
          setQuizScore(0);
        }
      }
      setAssessmentMode(mode);
    } catch (e) {
      // Use demo data if DB is empty
      if (mode === "flashcard") {
        setFlashcards(DEMO_FLASHCARDS);
        setFlashcardIndex(0);
        setFlashcardFlipped(false);
      } else {
        setQuizQuestions(DEMO_QUIZ);
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizScore(0);
      }
      setAssessmentMode(mode);
    }
  };

  const handleSubmitQuiz = async () => {
    const score = quizQuestions.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct_answer ? 1 : 0), 0);
    setQuizScore(score);
    setQuizSubmitted(true);
    try {
      await submitQuizResult({ userId: user?.id, category: examCategory, score, totalQuestions: quizQuestions.length, answers: Object.values(quizAnswers) });
      if (score >= quizQuestions.length * 0.75) {
        const updated = await fetchCertificates(user?.id);
        if (updated.success) setCertificates(updated.data);
      }
    } catch (e) { /* silent */ }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_supervisor":
        return <Badge variant="warning">Pending Supervisor</Badge>;
      case "pending_hrdd":
        return <Badge variant="info">Pending HRDD</Badge>;
      case "pending_signatory":
        return <Badge variant="info">Pending Signatory</Badge>;
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "disapproved":
        return <Badge variant="danger">Disapproved</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <aside className="fixed mt-16 lg:mt-0 top-0 left-0 h-screen w-[280px] bg-gradient-to-b from-white via-blue-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 dark:border-gray-700 border-r border-gray-200 px-5 py-8 z-40">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png"
              className="w-8 h-8"
              alt="Logo"
            />
            <div>
              <span className="block text-xl font-bold text-gray-900 dark:text-white">DOTr-HRDD</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Employee</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`menu-item ${activeSection === "dashboard" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveSection("trainings")}
              className={`menu-item ${activeSection === "trainings" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <ClipboardCheck className="h-5 w-5" />
              <span>Trainings</span>
            </button>
            <button
              onClick={() => setActiveSection("nomination")}
              className={`menu-item ${activeSection === "nomination" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <FileText className="h-5 w-5" />
              <span>My Nominations</span>
            </button>
            <button
              onClick={() => setActiveSection("post-training")}
              className={`menu-item ${activeSection === "post-training" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <Truck className="h-5 w-5" />
              <span>Post-Training</span>
            </button>
            <button
              onClick={() => setActiveSection("competency")}
              className={`menu-item ${activeSection === "competency" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <UserCircle className="h-5 w-5" />
              <span>Competency</span>
            </button>
            <button
              onClick={() => setActiveSection("mis-assistance")}
              className={`menu-item ${activeSection === "mis-assistance" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <HelpCircle className="h-5 w-5" />
              <span>MIS Assistance</span>
            </button>
            <button
              onClick={() => setActiveSection("idp")}
              className={`menu-item ${activeSection === "idp" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <TrendingUp className="h-5 w-5" />
              <span>My IDP</span>
            </button>
            <button
              onClick={() => setActiveSection("certificates")}
              className={`menu-item ${activeSection === "certificates" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <Award className="h-5 w-5" />
              <span>Certificates</span>
            </button>
            <button
              onClick={() => { setActiveSection("csc-exam"); setAssessmentMode("menu"); }}
              className={`menu-item ${activeSection === "csc-exam" || activeSection === "assessments" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <GraduationCap className="h-5 w-5" />
              <span>CSC Exam Prep</span>
            </button>
          </nav>

          <div className="absolute bottom-8 left-5 right-5">
            <button
              onClick={logout}
              disabled={isLoggingOut}
              className="w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              {isLoggingOut ? "Signing out…" : "Sign Out"}
            </button>
          </div>
        </aside>

        <main className="flex-1 ml-[280px] min-h-screen">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 dark:bg-gray-900 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {activeSection === "dashboard" && "Dashboard"}
                {activeSection === "trainings" && "Training Programs"}
                {activeSection === "nomination" && "My Nominations"}
                {activeSection === "competency" && "Competency Framework"}
                {activeSection === "mis-assistance" && "MIS Assistance"}
                {activeSection === "post-training" && "Post-Training Requirements"}
                {activeSection === "idp" && "Individual Development Plan"}
                {activeSection === "certificates" && "My Certificates"}
                {activeSection === "csc-exam" && "CSC Exam Prep"}
                {activeSection === "assessments" && "Assessments"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {user?.name}!
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden border-r border-gray-200 pr-4 text-right dark:border-gray-700 sm:block">
                <div className="font-bold text-gray-800 dark:text-white">{formatClock()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate()}</div>
              </div>

              <button
                onClick={toggleTheme}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                {isDark ? "☀️" : "🌙"}
              </button>

              <div className="flex h-11 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 dark:border-blue-900/70 dark:bg-blue-950/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                  {user?.initials}
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name}</span>
              </div>
            </div>
          </header>

          <div className="p-6">
            {activeSection === "dashboard" && (
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-4">
                  <StatCard label="Available Trainings" value={trainings.length} note="Active Programs" accentColor="bg-blue-100 dark:bg-blue-900/25" />
                  <StatCard label="My Nominations" value={nominations.length} note="Submitted" accentColor="bg-emerald-100 dark:bg-emerald-900/25" />
                  <StatCard label="Pending" value={nominations.filter((n) => n.status === "pending_supervisor").length} note="Awaiting Review" accentColor="bg-amber-100 dark:bg-amber-900/25" />
                  <StatCard label="Approved" value={nominations.filter((n) => n.status === "approved").length} note="Completed" isHighlight />
                </div>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    <button
                      onClick={() => setActiveSection("trainings")}
                      className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-blue-900/20"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Browse Trainings</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">View available programs</p>
                      </div>
                      <ChevronRight className="ml-auto h-5 w-5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveSection("mis-assistance")}
                      className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-purple-500 hover:bg-purple-50 dark:border-slate-700 dark:hover:bg-purple-900/20"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                        <HelpCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">MIS Assistance</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Storage & Manpower</p>
                      </div>
                      <ChevronRight className="ml-auto h-5 w-5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveSection("post-training")}
                      className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:hover:bg-emerald-900/20"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                        <Truck className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Post-Training</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Requirements & LTO</p>
                      </div>
                      <ChevronRight className="ml-auto h-5 w-5 text-slate-400" />
                    </button>
                  </CardContent>
                </Card>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Recent Trainings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {trainings.slice(0, 3).map((training) => (
                      <div key={training.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">{training.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{training.duration} • {getTrainingTypeBadge(training.trainingType)}</p>
                          </div>
                        </div>
                        <Badge variant={training.mode === "self-paced" ? "info" : "success"}>{training.mode}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "trainings" && (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTrainingFilter("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${trainingFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                  >
                    All Trainings
                  </button>
                  <button
                    onClick={() => setTrainingFilter("in-house")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${trainingFilter === "in-house" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                  >
                    In-House
                  </button>
                  <button
                    onClick={() => setTrainingFilter("out-of-house")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${trainingFilter === "out-of-house" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                  >
                    Out-of-House
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTrainings.map((training) => (
                    <Card key={training.id} variant="bordered" className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex gap-2">
                            {getTrainingTypeBadge(training.trainingType)}
                            <Badge variant={training.competencyType === "leadership" ? "info" : training.competencyType === "core" ? "success" : "warning"}>
                              {training.competencyType}
                            </Badge>
                          </div>
                          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {training.cost === "Sponsored" || training.cost === "Free" ? "FREE" : training.cost}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-bold text-slate-800 dark:text-white mb-2">{training.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">{training.description}</p>
                        <div className="space-y-2 text-xs text-slate-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{training.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{training.venue || "TBD"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{training.level}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {training.qualificationCriteria && (
                            <Button variant="outline" size="sm" onClick={() => handleViewQualification(training.qualificationCriteria!)} className="w-full">
                              <Target className="h-4 w-4" />
                              View Qualification Criteria
                            </Button>
                          )}
                          <Button onClick={() => handleRegisterTraining(training)} className="w-full">
                            Register Here
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "nomination" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>My Nominations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {nominations.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                        <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>No nominations yet.</p>
                        <Button onClick={() => setActiveSection("trainings")} variant="outline" className="mt-4">
                          Browse Trainings
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {nominations.map((nom) => (
                          <div key={nom.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-white">{nom.trainingTitle}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Filed: {nom.dateFiled}</p>
                            </div>
                            {getStatusBadge(nom.status)}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>O/S/O Approval Workflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">1</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">Submit Nomination</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Fill out the nomination form with qualification criteria</p>
                        </div>
                      </div>
                      <div className="ml-5 border-l-2 border-slate-200 dark:border-slate-700 h-8" />
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold">2</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">SCS Preview & O/S/O Submission</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Preview Seminar Confirmation Sheet before submitting</p>
                        </div>
                      </div>
                      <div className="ml-5 border-l-2 border-slate-200 dark:border-slate-700 h-8" />
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 font-bold">3</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">O/S/O Approval</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Head of Office approves or disapproves nomination</p>
                        </div>
                      </div>
                      <div className="ml-5 border-l-2 border-slate-200 dark:border-slate-700 h-8" />
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">4</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">HRDD Evaluation & Memo Directive</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">HRDD evaluates and generates memo directive/LTO</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "competency" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Competency Framework</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      The DOTr Competency Framework identifies, develops, and measures the competencies required for effective performance across all positions.
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
                        <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Core Competency</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Essential skills for all employees.</p>
                      </div>
                      <div className="rounded-xl bg-purple-50 p-6 dark:bg-purple-900/20">
                        <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-2">Leadership Competency</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Skills for supervisory roles.</p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 p-6 dark:bg-emerald-900/20">
                        <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2">Functional Competency</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Job-specific technical skills.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Job Analysis Form</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Document your job roles, responsibilities, and required competencies.
                    </p>
                    <Button variant="outline">
                      <FileText className="h-4 w-4" />
                      Download JA Form Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "mis-assistance" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">MIS Assistance Request</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Submit requests for storage and manpower assistance</p>
                  </div>
                  <Button onClick={() => setShowMisModal(true)}>
                    <HelpCircle className="h-4 w-4" />
                    New Request
                  </Button>
                </div>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Your Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {misRequests.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                        <HelpCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>No MIS assistance requests yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {misRequests.map((request) => (
                          <div key={request.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-white">
                                {request.requestType === "storage" ? "Storage Request" : "Manpower Request"}
                              </h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{request.requestDetails}</p>
                              <p className="text-xs text-slate-400 mt-1">Submitted: {request.requestedDate}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  request.priority === "high" ? "danger" :
                                  request.priority === "medium" ? "warning" : "default"
                                }
                              >
                                {request.priority}
                              </Badge>
                              <Badge
                                variant={
                                  request.status === "completed" ? "success" :
                                  request.status === "processing" ? "info" : "warning"
                                }
                              >
                                {request.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>What We Help With</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          <h4 className="font-bold text-blue-700 dark:text-blue-400">Storage Requests</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Request additional storage space, file management assistance, or document archiving services.
                        </p>
                      </div>
                      <div className="rounded-xl bg-purple-50 p-6 dark:bg-purple-900/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          <h4 className="font-bold text-purple-700 dark:text-purple-400">Manpower Requests</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Request additional personnel support for projects, events, or temporary workload assistance.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "post-training" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Post-Training Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      After completing out-of-house trainings, please submit the following requirements to HRDD.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 dark:text-white">Post-Training Evaluation Form & PTR</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Submit within 7 days of training completion</p>
                        </div>
                        <Badge variant="info">Required</Badge>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 dark:text-white">Certificate of Completion/Attendance</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Submit within 3 days from receipt</p>
                        </div>
                        <Badge variant="info">Required</Badge>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 dark:text-white">Local Travel Order (LTO)</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">For out-of-house trainings requiring travel</p>
                        </div>
                        <Badge variant="warning">As applicable</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Submission Portal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      All submissions shall be in electronic form, preferably via email, and with the use of digital signatures, if available.
                    </p>
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">In case of non-attendance</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                        Submit a justification to the HRDD no later than seven (7) working days after the supposed L&D activity.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* IDP Section */}
            {activeSection === "idp" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{idpList.length} IDP record(s)</p>
                  <Button onClick={() => setShowIdpModal(true)}>
                    <TrendingUp className="h-4 w-4" /> Create IDP
                  </Button>
                </div>
                {idpList.length === 0 ? (
                  <Card variant="bordered">
                    <CardContent className="py-16 text-center">
                      <TrendingUp className="mx-auto h-12 w-12 mb-4 text-slate-300" />
                      <p className="font-medium text-slate-600 dark:text-slate-300">No IDP submitted yet.</p>
                      <p className="text-sm text-slate-400 mt-1">Create your Individual Development Plan to track competency growth.</p>
                      <Button onClick={() => setShowIdpModal(true)} className="mt-4">Create My IDP</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {idpList.map((idp: any) => (
                      <motion.div key={idp.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <Card variant="bordered">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-semibold text-slate-800 dark:text-white">IDP #{idp.id}</p>
                                <p className="text-xs text-slate-400">{new Date(idp.created_at).toLocaleDateString()}</p>
                              </div>
                              <Badge variant={idp.status === "approved" ? "success" : idp.status === "disapproved" ? "danger" : idp.status === "pending_supervisor" ? "warning" : "default"}>
                                {idp.status?.replace(/_/g, " ")}
                              </Badge>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2 text-sm">
                              <div><p className="font-medium text-slate-600 dark:text-slate-400">Current Competencies</p><p className="text-slate-800 dark:text-white mt-1">{idp.current_competencies || "—"}</p></div>
                              <div><p className="font-medium text-slate-600 dark:text-slate-400">Target Competencies</p><p className="text-slate-800 dark:text-white mt-1">{idp.target_competencies || "—"}</p></div>
                              <div><p className="font-medium text-slate-600 dark:text-slate-400">Development Activities</p><p className="text-slate-800 dark:text-white mt-1">{idp.development_activities || "—"}</p></div>
                              <div><p className="font-medium text-slate-600 dark:text-slate-400">Target Date</p><p className="text-slate-800 dark:text-white mt-1">{idp.target_date || "—"}</p></div>
                            </div>
                            {idp.supervisor_remarks && <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-sm"><span className="font-medium text-amber-700 dark:text-amber-400">Supervisor: </span>{idp.supervisor_remarks}</div>}
                            {idp.hrdd_remarks && <div className="mt-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm"><span className="font-medium text-blue-700 dark:text-blue-400">HRDD: </span>{idp.hrdd_remarks}</div>}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Certificates Section */}
            {activeSection === "certificates" && (
              <div className="space-y-6">
                {certificates.length === 0 ? (
                  <Card variant="bordered">
                    <CardContent className="py-16 text-center">
                      <Award className="mx-auto h-12 w-12 mb-4 text-slate-300" />
                      <p className="font-medium text-slate-600 dark:text-slate-300">No certificates yet.</p>
                      <p className="text-sm text-slate-400 mt-1">Complete a training or pass a CSC Exam quiz to earn certificates.</p>
                      <Button onClick={() => setActiveSection("csc-exam")} variant="outline" className="mt-4">Go to CSC Exam Prep</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((cert: any) => (
                      <motion.div key={cert.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
                        <Card variant="bordered" className="overflow-hidden">
                          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                          <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                                <Award className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 dark:text-white text-sm">{cert.training_title}</p>
                                <p className="text-xs text-slate-400">{cert.cert_number}</p>
                              </div>
                            </div>
                            <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                              <p>Issued by: <span className="font-medium text-slate-700 dark:text-slate-300">{cert.issued_by}</span></p>
                              <p>Date: <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(cert.issued_at).toLocaleDateString()}</span></p>
                            </div>
                            <div className="mt-3"><Badge variant="success">Active</Badge></div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CSC Exam Prep Section */}
            {activeSection === "csc-exam" && (
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {assessmentMode === "menu" && (
                    <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer" onClick={() => handleLoadAssessments("flashcard")}>
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 mb-4">
                            <Brain className="h-6 w-6" />
                          </div>
                          <h3 className="font-bold text-slate-800 dark:text-white mb-1">Flashcard Review</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Study key concepts with interactive flip cards.</p>
                          <Button className="mt-4 w-full" onClick={() => handleLoadAssessments("flashcard")}>Start Flashcards</Button>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer" onClick={() => handleLoadAssessments("quiz")}>
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 mb-4">
                            <GraduationCap className="h-6 w-6" />
                          </div>
                          <h3 className="font-bold text-slate-800 dark:text-white mb-1">Practice Quiz</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Test your knowledge. Pass 75% to earn a certificate.</p>
                          <Button variant="outline" className="mt-4 w-full" onClick={() => handleLoadAssessments("quiz")}>Start Quiz</Button>
                        </div>
                      </div>
                      <Card variant="bordered">
                        <CardHeader><CardTitle>Downloadable Study Materials</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            { title: "CSC Professional Exam Reviewer", desc: "Comprehensive reviewer for Professional level", size: "PDF" },
                            { title: "RA 6713 — Code of Conduct", desc: "Full text with annotations", size: "PDF" },
                            { title: "RA 11032 — Ease of Doing Business", desc: "Full text with IRR", size: "PDF" },
                            { title: "PRIME-HRM Framework Guide", desc: "CSC official guide", size: "PDF" },
                          ].map((item) => (
                            <div key={item.title} className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 flex-shrink-0">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-800 dark:text-white text-sm">{item.title}</p>
                                <p className="text-xs text-slate-400">{item.desc}</p>
                              </div>
                              <Badge variant="default">{item.size}</Badge>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {assessmentMode === "flashcard" && (
                    <motion.div key="flashcard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => setAssessmentMode("menu")}><ChevronLeft className="h-4 w-4" /> Back</Button>
                        <span className="text-sm text-slate-500">{flashcardIndex + 1} / {flashcards.length}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <motion.div className="h-full bg-blue-500 rounded-full" animate={{ width: `${((flashcardIndex + 1) / flashcards.length) * 100}%` }} transition={{ duration: 0.3 }} />
                        </div>
                      </div>
                      {flashcards[flashcardIndex] && (
                        <div className="perspective-1000">
                          <motion.div
                            className="relative cursor-pointer rounded-2xl border-2 border-blue-200 dark:border-blue-800 min-h-[220px] flex items-center justify-center p-8 text-center"
                            style={{ background: flashcardFlipped ? "linear-gradient(135deg, #dbeafe, #eff6ff)" : "linear-gradient(135deg, #f0fdf4, #dcfce7)" }}
                            onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                            animate={{ rotateY: flashcardFlipped ? 180 : 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <AnimatePresence mode="wait">
                              {!flashcardFlipped ? (
                                <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">Question</p>
                                  <p className="text-lg font-bold text-slate-800">{flashcards[flashcardIndex].question}</p>
                                  {flashcards[flashcardIndex].hint && <p className="text-sm text-slate-400 mt-3 italic">Hint: {flashcards[flashcardIndex].hint}</p>}
                                  <p className="text-xs text-slate-400 mt-4">Click to reveal answer</p>
                                </motion.div>
                              ) : (
                                <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Answer</p>
                                  <p className="text-base text-slate-800">{flashcards[flashcardIndex].answer}</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      )}
                      <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => { setFlashcardIndex(Math.max(0, flashcardIndex - 1)); setFlashcardFlipped(false); }} disabled={flashcardIndex === 0}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" onClick={() => setFlashcardFlipped(!flashcardFlipped)}><RotateCcw className="h-4 w-4" /> Flip</Button>
                        <Button onClick={() => { setFlashcardIndex(Math.min(flashcards.length - 1, flashcardIndex + 1)); setFlashcardFlipped(false); }} disabled={flashcardIndex === flashcards.length - 1}><ChevronRight className="h-4 w-4" /></Button>
                      </div>
                    </motion.div>
                  )}

                  {assessmentMode === "quiz" && (
                    <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => setAssessmentMode("menu")}><ChevronLeft className="h-4 w-4" /> Back</Button>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{examCategory} Quiz — {quizQuestions.length} questions</span>
                      </div>
                      {!quizSubmitted ? (
                        <div className="space-y-4">
                          {quizQuestions.map((q: any, i: number) => {
                            const opts = typeof q.options_json === "string" ? JSON.parse(q.options_json) : q.options_json;
                            return (
                              <Card key={q.id} variant="bordered">
                                <CardContent className="p-5">
                                  <p className="font-semibold text-slate-800 dark:text-white mb-4"><span className="text-blue-600 mr-2">{i + 1}.</span>{q.question}</p>
                                  <div className="space-y-2">
                                    {opts.map((opt: string, j: number) => (
                                      <button key={j} onClick={() => setQuizAnswers((prev) => ({ ...prev, [i]: j }))}
                                        className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${quizAnswers[i] === j ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 font-medium text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"}`}>
                                        <span className="font-bold mr-2">{String.fromCharCode(65 + j)}.</span>{opt}
                                      </button>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                          <Button onClick={handleSubmitQuiz} disabled={Object.keys(quizAnswers).length < quizQuestions.length} className="w-full">
                            Submit Quiz ({Object.keys(quizAnswers).length}/{quizQuestions.length} answered)
                          </Button>
                        </div>
                      ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                          <Card variant="bordered">
                            <CardContent className="py-10 text-center">
                              <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${quizScore >= quizQuestions.length * 0.75 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                                {quizScore >= quizQuestions.length * 0.75 ? <CheckCircle className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
                              </div>
                              <p className="text-3xl font-bold text-slate-800 dark:text-white">{quizScore}/{quizQuestions.length}</p>
                              <p className="text-lg font-medium mt-1 text-slate-600 dark:text-slate-300">{Math.round((quizScore / quizQuestions.length) * 100)}%</p>
                              <p className={`mt-2 font-semibold ${quizScore >= quizQuestions.length * 0.75 ? "text-emerald-600" : "text-red-600"}`}>
                                {quizScore >= quizQuestions.length * 0.75 ? "🎉 Passed! Certificate issued." : "Not passed. 75% required."}
                              </p>
                            </CardContent>
                          </Card>
                          <div className="space-y-3">
                            {quizQuestions.map((q: any, i: number) => {
                              const opts = typeof q.options_json === "string" ? JSON.parse(q.options_json) : q.options_json;
                              const isCorrect = quizAnswers[i] === q.correct_answer;
                              return (
                                <Card key={q.id} variant="bordered" className={isCorrect ? "border-emerald-300 dark:border-emerald-700" : "border-red-300 dark:border-red-700"}>
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-2 mb-2">
                                      {isCorrect ? <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> : <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />}
                                      <p className="text-sm font-medium text-slate-800 dark:text-white">{q.question}</p>
                                    </div>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 ml-6">✓ {opts[q.correct_answer]}</p>
                                    {q.explanation && <p className="text-xs text-slate-400 ml-6 mt-1 italic">{q.explanation}</p>}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="flex-1"><RotateCcw className="h-4 w-4" /> Retry</Button>
                            {quizScore >= quizQuestions.length * 0.75 && <Button onClick={() => setActiveSection("certificates")} className="flex-1"><Award className="h-4 w-4" /> View Certificate</Button>}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* IDP Modal */}
      <Modal isOpen={showIdpModal} onClose={() => setShowIdpModal(false)} title="Create Individual Development Plan" size="lg">
        <form onSubmit={handleSubmitIdp} className="space-y-4">
          <Textarea label="Current Competencies" value={idpForm.currentCompetencies} onChange={(e) => setIdpForm((p) => ({ ...p, currentCompetencies: e.target.value }))} rows={3} placeholder="Describe your current skills and competencies..." required />
          <Textarea label="Target Competencies" value={idpForm.targetCompetencies} onChange={(e) => setIdpForm((p) => ({ ...p, targetCompetencies: e.target.value }))} rows={3} placeholder="What competencies do you want to develop?" required />
          <Textarea label="Development Activities" value={idpForm.developmentActivities} onChange={(e) => setIdpForm((p) => ({ ...p, developmentActivities: e.target.value }))} rows={3} placeholder="List planned trainings, readings, or activities..." required />
          <Input label="Target Completion Date" type="date" value={idpForm.targetDate} onChange={(e) => setIdpForm((p) => ({ ...p, targetDate: e.target.value }))} />
          <Textarea label="Remarks (Optional)" value={idpForm.remarks} onChange={(e) => setIdpForm((p) => ({ ...p, remarks: e.target.value }))} rows={2} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowIdpModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Submit IDP</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showNominationModal}
        onClose={() => setShowNominationModal(false)}
        title="Nomination Form"
        size="xl"
      >
        <form onSubmit={handleSubmitNomination} className="space-y-6">
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-blue-700 dark:text-blue-400">{selectedTraining?.title}</h4>
              {getTrainingTypeBadge(selectedTraining?.trainingType)}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{selectedTraining?.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input name="trainingDate" label="Training Date" type="date" required />
            <Select name="competencyType" label="Competency Type" options={COMPETENCY_TYPES} placeholder="Select type" required />
          </div>

          <Textarea name="venue" label="Venue" rows={2} />

          <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <h4 className="font-bold text-slate-800 dark:text-white mb-4">Participant Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="idNumber" label="ID Number" required />
              <Input name="position" label="Position Title" required />
              <Select name="office" label="Office/Unit" options={OFFICES} placeholder="Select office" required />
              <Input name="supervisor" label="Immediate Supervisor" required />
              <Input name="salaryGrade" label="Salary Grade" required />
              <Input name="yearsOfService" label="Years/Months in Service" required />
              <Input name="contact" label="Contact Number" required />
              <Input name="gender" label="Gender (Optional)" />
            </div>
          </div>

          <Textarea name="justification" label="Justification for Attendance" rows={4} required />

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowNominationModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Nomination
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showScsPreviewModal}
        onClose={() => setShowScsPreviewModal(false)}
        title="Seminar Confirmation Sheet (SCS) Preview"
        size="lg"
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-emerald-700 dark:text-emerald-300 text-center">
              Your nomination has been submitted successfully!
            </p>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-center">
            Your Seminar Confirmation Sheet (SCS) will be generated and sent to your supervisor for approval.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-white mb-2">Next Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Your supervisor will review and approve/disapprove the nomination</li>
              <li>If approved, HRDD will evaluate and generate the Memo Directive</li>
              <li>You will be notified of the final decision</li>
            </ol>
          </div>
          <Button onClick={() => setShowScsPreviewModal(false)} className="w-full">
            Close
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showQualificationModal}
        onClose={() => setShowQualificationModal(false)}
        title="Qualification Criteria"
        size="md"
      >
        {selectedQualification && (
          <div className="space-y-4">
            {selectedQualification.offices && (
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">Target Offices</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300">
                  {selectedQualification.offices.map((office, i) => (
                    <li key={i}>{office}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedQualification.salaryGrades && (
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">Salary Grades</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  SG {selectedQualification.salaryGrades.join(", ")}
                </p>
              </div>
            )}
            {selectedQualification.targetLevel && (
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">Target Level</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {selectedQualification.targetLevel}
                </p>
              </div>
            )}
            {selectedQualification.description && (
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">Description</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {selectedQualification.description}
                </p>
              </div>
            )}
            <Button onClick={() => setShowQualificationModal(false)} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showMisModal}
        onClose={() => setShowMisModal(false)}
        title="MIS Assistance Request"
        size="md"
      >
        <form onSubmit={handleSubmitMisRequest} className="space-y-4">
          <Select
            name="requestType"
            label="Request Type"
            options={MIS_REQUEST_TYPES}
            placeholder="Select type"
            required
          />
          <Select
            name="priority"
            label="Priority"
            options={MIS_PRIORITIES}
            placeholder="Select priority"
            required
          />
          <Textarea
            name="requestDetails"
            label="Request Details"
            rows={4}
            placeholder="Please describe your request..."
            required
          />
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowMisModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
