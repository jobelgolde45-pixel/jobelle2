"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, useClock } from "@/lib/hooks";
import { Card, CardHeader, CardTitle, CardContent, StatCard, Badge, Button, Modal } from "@/components/ui";
import { Input, Textarea, Select } from "@/components/ui";
import {
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  Plus,
  Calendar,
  Truck,
  Database,
  UserPlus,
  Shield,
  Eye,
  Download,
} from "lucide-react";
import { fetchTrainings, fetchNominations, createNomination, updateNomination, fetchUsers, createUser } from "@/lib/api-client";
import type { NominationForm, TrainingProgram, LocalTravelOrder, MemoDirective, TrainingType } from "@/types/portal";

interface EmployeeAccount {
  id: string;
  name: string;
  email: string;
  position: string;
  office: string;
  role: "employee" | "supervisor";
  status: "active" | "inactive";
  createdAt: string;
}

const OFFICES = [
  { value: "hrdd", label: "Human Resource Development Division" },
  { value: "planning", label: "Planning Division" },
  { value: "admin", label: "Administrative Service" },
  { value: "finance", label: "Finance Service" },
  { value: "asset", label: "Asset Management Division" },
];

type Section = "dashboard" | "nominations" | "trainings" | "accounts" | "evaluations" | "lto-database";

export default function HRDDAdminPortalPage() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { formatClock, formatDate } = useClock();
  const [nominations, setNominations] = useState<NominationForm[]>([]);
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [accounts, setAccounts] = useState<EmployeeAccount[]>([]);
  const [ltos, setLtos] = useState<LocalTravelOrder[]>([]);
  const [memos, setMemos] = useState<MemoDirective[]>([]);
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [showCreateTraining, setShowCreateTraining] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [selectedNomination, setSelectedNomination] = useState<NominationForm | null>(null);
  const [evaluationRemarks, setEvaluationRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [newTraining, setNewTraining] = useState<Partial<TrainingProgram>>({
    title: "",
    description: "",
    duration: "",
    level: "All Levels",
    mode: "in-house",
    trainingType: "in-house",
    competencyType: "core",
    cost: "",
    isActive: true,
  });

  const [newAccount, setNewAccount] = useState<Partial<EmployeeAccount>>({
    name: "",
    email: "",
    position: "",
    office: "",
    role: "employee",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [nominationsResult, trainingsResult, usersResult] = await Promise.all([
          fetchNominations(),
          fetchTrainings(),
          fetchUsers(),
        ]);
        if (nominationsResult.success) {
          setNominations(nominationsResult.data as NominationForm[]);
        }
        if (trainingsResult.success) {
          setTrainings(trainingsResult.data);
        }
        if (usersResult.success) {
          setAccounts(usersResult.data as EmployeeAccount[]);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingNominations = nominations.filter((n) => n.status === "pending_hrdd");
  const approvedNominations = nominations.filter((n) => n.status === "approved");
  const evaluations = nominations.filter((n) => n.status === "pending_hrdd" || n.status === "approved");

  const handleApprove = async (id: string) => {
    try {
      await updateNomination({ id, status: "approved", updatedAt: new Date().toISOString() });
      setNominations((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: "approved" as const, updatedAt: new Date().toISOString() } : n
        )
      );
      alert("Nomination approved and forwarded to Signatory!");
    } catch (error) {
      console.error("Failed to approve nomination:", error);
      alert("Failed to approve nomination.");
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Are you sure you want to reject this nomination?")) return;
    try {
      await updateNomination({ id, status: "disapproved", updatedAt: new Date().toISOString() });
      setNominations((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: "disapproved" as const, updatedAt: new Date().toISOString() } : n
        )
      );
    } catch (error) {
      console.error("Failed to reject nomination:", error);
      alert("Failed to reject nomination.");
    }
  };

  const handleEvaluate = async (nom: NominationForm) => {
    setSelectedNomination(nom);
    setShowEvaluationModal(true);
  };

  const handleGenerateMemo = (nom: NominationForm) => {
    const memo: MemoDirective = {
      id: `memo_${Date.now()}`,
      nominationId: nom.id,
      memoType: "out-of-house",
      participantName: nom.participantName,
      participantPosition: nom.participantPosition,
      participantOffice: nom.participantOffice,
      trainingTitle: nom.trainingTitle,
      trainingDate: nom.trainingDate,
      provider: "External Provider",
      venue: nom.venue,
      objectives: nom.justification,
      requirements: [
        "Post-Training Evaluation Form & PTR (within 7 days)",
        "Certificate of Completion/Attendance (within 3 days)",
      ],
      submissionDeadline: "7 days after training",
      memoDate: new Date().toISOString().split("T")[0],
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMemos((prev) => [...prev, memo]);
    setSelectedNomination(nom);
    setShowMemoModal(true);
  };

  const handleApproveMemo = async (memoId: string) => {
    setMemos((prev) =>
      prev.map((m) =>
        m.id === memoId ? { ...m, status: "approved" as const, updatedAt: new Date().toISOString() } : m
      )
    );
    alert("Memo directive approved and forwarded to Signatory!");
  };

  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    const training: TrainingProgram = {
      id: `training_${Date.now()}`,
      title: newTraining.title || "",
      description: newTraining.description || "",
      duration: newTraining.duration || "",
      level: newTraining.level || "All Levels",
      mode: newTraining.mode || "in-house",
      trainingType: newTraining.trainingType as TrainingType || "in-house",
      competencyType: newTraining.competencyType || "core",
      cost: newTraining.cost || "Free",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    try {
      // Note: API may not have createTraining endpoint yet, adding to local state
      setTrainings((prev) => [...prev, training]);
      setShowCreateTraining(false);
      setNewTraining({
        title: "",
        description: "",
        duration: "",
        level: "All Levels",
        mode: "in-house",
        trainingType: "in-house",
        competencyType: "core",
        cost: "",
        isActive: true,
      });
      alert("Training program created!");
    } catch (error) {
      console.error("Failed to create training:", error);
      alert("Failed to create training.");
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const account: EmployeeAccount = {
      id: `acc_${Date.now()}`,
      name: newAccount.name || "",
      email: newAccount.email || "",
      position: newAccount.position || "",
      office: newAccount.office || "",
      role: newAccount.role as "employee" | "supervisor" || "employee",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    try {
      await createUser(account);
      setAccounts((prev) => [...prev, account]);
      setShowCreateAccount(false);
      setNewAccount({ name: "", email: "", position: "", office: "", role: "employee" });
      alert("Employee account created!");
    } catch (error) {
      console.error("Failed to create account:", error);
      alert("Failed to create account.");
    }
  };

  const COMPETENCY_OPTIONS = [
    { value: "core", label: "Core Competency" },
    { value: "leadership", label: "Leadership Competency" },
    { value: "functional", label: "Functional Competency" },
  ];

  const MODE_OPTIONS = [
    { value: "in-house", label: "In-House" },
    { value: "out-of-house", label: "Out-of-House" },
    { value: "self-paced", label: "Self-Paced" },
  ];

  const TRAINING_TYPE_OPTIONS = [
    { value: "in-house", label: "In-House" },
    { value: "out-of-house", label: "Out-of-House" },
  ];

  const ROLE_OPTIONS = [
    { value: "employee", label: "Employee" },
    { value: "supervisor", label: "Supervisor" },
  ];

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
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Admin</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`menu-item ${activeSection === "dashboard" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <Users className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveSection("nominations")}
              className={`menu-item ${activeSection === "nominations" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <FileText className="h-5 w-5" />
              <span>Nominations</span>
              {pendingNominations.length > 0 && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {pendingNominations.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSection("evaluations")}
              className={`menu-item ${activeSection === "evaluations" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <Shield className="h-5 w-5" />
              <span>Evaluations</span>
            </button>
            <button
              onClick={() => setActiveSection("trainings")}
              className={`menu-item ${activeSection === "trainings" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Trainings</span>
            </button>
            <button
              onClick={() => setActiveSection("lto-database")}
              className={`menu-item ${activeSection === "lto-database" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <Database className="h-5 w-5" />
              <span>LTO Database</span>
            </button>
            <button
              onClick={() => setActiveSection("accounts")}
              className={`menu-item ${activeSection === "accounts" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
            >
              <UserPlus className="h-5 w-5" />
              <span>Account Control</span>
            </button>
          </nav>

          <div className="absolute bottom-8 left-5 right-5">
            <button
              onClick={logout}
              className="w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 ml-[280px] min-h-screen">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 dark:bg-gray-900 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {activeSection === "dashboard" && "Executive Dashboard"}
                {activeSection === "nominations" && "Nomination Approvals"}
                {activeSection === "trainings" && "Training Programs"}
                {activeSection === "accounts" && "Account Control"}
                {activeSection === "evaluations" && "HRDD Evaluations"}
                {activeSection === "lto-database" && "LTO Database"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Human Resource Development Division</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden border-r border-gray-200 pr-4 text-right dark:border-gray-700 sm:block">
                <div className="font-bold text-gray-800 dark:text-white">{formatClock()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate()}</div>
              </div>

              <button onClick={toggleTheme} className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-800">
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
                  <StatCard label="Pending HRDD" value={pendingNominations.length} note="Needs Review" accentColor="bg-amber-100 dark:bg-amber-900/25" />
                  <StatCard label="Approved" value={approvedNominations.length} note="Finalized" accentColor="bg-emerald-100 dark:bg-emerald-900/25" />
                  <StatCard label="Total Trainings" value={trainings.length} note="Active" accentColor="bg-blue-100 dark:bg-blue-900/25" />
                  <StatCard label="LTOs Generated" value={ltos.length} note="Documents" isHighlight />
                </div>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>HRDD Evaluation & Memo Directive Workflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">1</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">Supervisor Approves Nomination</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">O/S/O reviews and approves the nomination form</p>
                        </div>
                      </div>
                      <div className="ml-5 border-l-2 border-slate-200 dark:border-slate-700 h-8" />
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold">2</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">HRDD Evaluation</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">HRDD reviews qualification criteria and budget availability</p>
                        </div>
                      </div>
                      <div className="ml-5 border-l-2 border-slate-200 dark:border-slate-700 h-8" />
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">3</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">Memo Directive / LTO Generation</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Generate MO for in-house or LTO for out-of-house trainings</p>
                        </div>
                      </div>
                      <div className="ml-5 border-l-2 border-slate-200 dark:border-slate-700 h-8" />
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 font-bold">4</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">Signatory Approval</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Approving authority signs the memo/LTO</p>
                        </div>
                      </div>
                      <div className="ml-5 border-l-2 border-slate-200 dark:border-slate-700 h-8" />
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold">5</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">Auto-Update LTO Database</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Approved documents reflected in LTO Database Dashboard</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "nominations" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Pending HRDD Final Approval ({pendingNominations.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Employee</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Training</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Supervisor</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {pendingNominations.map((nom) => (
                            <tr key={nom.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="py-4">
                                <div className="font-medium text-slate-800 dark:text-white">{nom.participantName}</div>
                                <div className="text-sm text-slate-500">{nom.participantPosition}</div>
                              </td>
                              <td className="py-4 text-slate-600 dark:text-slate-300">{nom.trainingTitle}</td>
                              <td className="py-4 text-slate-600 dark:text-slate-300">{nom.participantSupervisor}</td>
                              <td className="py-4"><Badge variant="warning">Pending HRDD</Badge></td>
                              <td className="py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEvaluate(nom)}>
                                    <Eye className="h-4 w-4" />
                                    Evaluate
                                  </Button>
                                  <Button size="sm" onClick={() => handleGenerateMemo(nom)}>
                                    <FileText className="h-4 w-4" />
                                    Generate MO
                                  </Button>
                                  <Button size="sm" onClick={() => handleApprove(nom.id)}>
                                    <CheckCircle className="h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="danger" onClick={() => handleReject(nom.id)}>
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {pendingNominations.length === 0 && (
                        <p className="py-8 text-center text-slate-500 dark:text-slate-400">No pending nominations</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "evaluations" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>HRDD Evaluation Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Participant</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Training</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Qualification</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Documents</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Budget</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {evaluations.map((nom) => (
                            <tr key={nom.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="py-4">
                                <div className="font-medium text-slate-800 dark:text-white">{nom.participantName}</div>
                                <div className="text-sm text-slate-500">{nom.participantOffice}</div>
                              </td>
                              <td className="py-4 text-slate-600 dark:text-slate-300">{nom.trainingTitle}</td>
                              <td className="py-4">
                                <Badge variant="success">Passed</Badge>
                              </td>
                              <td className="py-4">
                                <Badge variant="success">Complete</Badge>
                              </td>
                              <td className="py-4">
                                <Badge variant="success">Available</Badge>
                              </td>
                              <td className="py-4">
                                <Badge variant={nom.status === "approved" ? "success" : "warning"}>
                                  {nom.status === "approved" ? "Evaluated" : "Pending"}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "trainings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Training Programs</h2>
                  <Button onClick={() => setShowCreateTraining(true)}>
                    <Plus className="h-4 w-4" />
                    Create Training
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {trainings.map((training) => (
                    <Card key={training.id} variant="bordered">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Badge variant={training.trainingType === "out-of-house" ? "info" : "success"}>
                            {training.trainingType === "out-of-house" ? "Out-of-House" : "In-House"}
                          </Badge>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{training.cost}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-bold text-slate-800 dark:text-white mb-2">{training.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{training.description}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{training.duration}</span>
                          <span>•</span>
                          <span>{training.mode}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "accounts" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Account Control</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage employee accounts and access</p>
                  </div>
                  <Button onClick={() => setShowCreateAccount(true)}>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </Button>
                </div>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Employee Accounts ({accounts.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Position</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Office</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {accounts.map((account) => (
                            <tr key={account.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="py-4 font-medium text-slate-800 dark:text-white">{account.name}</td>
                              <td className="py-4 text-slate-600 dark:text-slate-300">{account.email}</td>
                              <td className="py-4 text-slate-600 dark:text-slate-300">{account.position}</td>
                              <td className="py-4 text-slate-600 dark:text-slate-300">{account.office}</td>
                              <td className="py-4">
                                <Badge variant={account.role === "supervisor" ? "info" : "default"}>
                                  {account.role}
                                </Badge>
                              </td>
                              <td className="py-4">
                                <Badge variant={account.status === "active" ? "success" : "danger"}>
                                  {account.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "lto-database" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>LTO Database Dashboard</CardTitle>
                      <Button variant="outline">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">LTO No.</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Participant</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Training</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Training Date</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {ltos.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                                <Database className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <p>No LTOs generated yet.</p>
                                <p className="text-sm">LTOs will appear here after approval from the Signatory.</p>
                              </td>
                            </tr>
                          ) : (
                            ltos.map((lto) => (
                              <tr key={lto.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="py-4 font-medium text-slate-800 dark:text-white">{lto.ltoNumber}</td>
                                <td className="py-4 text-slate-600 dark:text-slate-300">{lto.participantName}</td>
                                <td className="py-4 text-slate-600 dark:text-slate-300">{lto.trainingTitle}</td>
                                <td className="py-4 text-slate-600 dark:text-slate-300">{lto.trainingDate}</td>
                                <td className="py-4">
                                  <Badge variant={lto.status === "generated" ? "success" : "warning"}>
                                    {lto.status}
                                  </Badge>
                                </td>
                                <td className="py-4">
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Generated Memo Directives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Memo No.</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Participant</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Training</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Type</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {memos.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <p>No memo directives generated yet.</p>
                              </td>
                            </tr>
                          ) : (
                            memos.map((memo) => (
                              <tr key={memo.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="py-4 font-medium text-slate-800 dark:text-white">{memo.memoNumber || memo.id}</td>
                                <td className="py-4 text-slate-600 dark:text-slate-300">{memo.participantName}</td>
                                <td className="py-4 text-slate-600 dark:text-slate-300">{memo.trainingTitle}</td>
                                <td className="py-4">
                                  <Badge variant={memo.memoType === "out-of-house" ? "info" : "success"}>
                                    {memo.memoType === "out-of-house" ? "Out-of-House" : "In-House"}
                                  </Badge>
                                </td>
                                <td className="py-4">
                                  <Badge variant={memo.status === "approved" ? "success" : memo.status === "pending" ? "warning" : "danger"}>
                                    {memo.status}
                                  </Badge>
                                </td>
                                <td className="py-4">
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    {memo.status === "pending" && (
                                      <Button size="sm" onClick={() => handleApproveMemo(memo.id)}>
                                        <CheckCircle className="h-4 w-4" />
                                        Approve
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      <Modal
        isOpen={showCreateTraining}
        onClose={() => setShowCreateTraining(false)}
        title="Create Training Program"
        size="xl"
      >
        <form onSubmit={handleCreateTraining} className="space-y-6">
          <Input
            label="Training Title"
            value={newTraining.title}
            onChange={(e) => setNewTraining((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <Textarea
            label="Description"
            value={newTraining.description}
            onChange={(e) => setNewTraining((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Duration"
              value={newTraining.duration}
              onChange={(e) => setNewTraining((prev) => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 2 days"
              required
            />
            <Input
              label="Cost"
              value={newTraining.cost}
              onChange={(e) => setNewTraining((prev) => ({ ...prev, cost: e.target.value }))}
              placeholder="e.g., Sponsored"
            />
            <Select
              label="Competency Type"
              value={newTraining.competencyType}
              onChange={(e) => setNewTraining((prev) => ({ ...prev, competencyType: e.target.value as TrainingProgram["competencyType"] }))}
              options={COMPETENCY_OPTIONS}
            />
            <Select
              label="Training Type"
              value={newTraining.trainingType}
              onChange={(e) => setNewTraining((prev) => ({ ...prev, trainingType: e.target.value as TrainingType }))}
              options={TRAINING_TYPE_OPTIONS}
            />
            <Select
              label="Mode"
              value={newTraining.mode}
              onChange={(e) => setNewTraining((prev) => ({ ...prev, mode: e.target.value as TrainingProgram["mode"] }))}
              options={MODE_OPTIONS}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowCreateTraining(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Training
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showCreateAccount}
        onClose={() => setShowCreateAccount(false)}
        title="Create Employee Account"
        size="md"
      >
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <Input
            label="Full Name"
            value={newAccount.name}
            onChange={(e) => setNewAccount((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newAccount.email}
            onChange={(e) => setNewAccount((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <Input
            label="Position"
            value={newAccount.position}
            onChange={(e) => setNewAccount((prev) => ({ ...prev, position: e.target.value }))}
            required
          />
          <Select
            label="Office"
            value={newAccount.office}
            onChange={(e) => setNewAccount((prev) => ({ ...prev, office: e.target.value }))}
            options={OFFICES}
            placeholder="Select office"
          />
          <Select
            label="Role"
            value={newAccount.role}
            onChange={(e) => setNewAccount((prev) => ({ ...prev, role: e.target.value as "employee" | "supervisor" }))}
            options={ROLE_OPTIONS}
          />
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowCreateAccount(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showEvaluationModal}
        onClose={() => setShowEvaluationModal(false)}
        title="HRDD Evaluation"
        size="lg"
      >
        {selectedNomination && (
          <div className="space-y-4">
            <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
              <h4 className="font-bold text-blue-700 dark:text-blue-400">{selectedNomination.participantName}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{selectedNomination.trainingTitle}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white">Qualification Review</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mb-2" />
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">Qualification Criteria</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">Passed</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mb-2" />
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">Documents</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">Complete</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mb-2" />
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">Budget</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">Available</p>
                </div>
              </div>
            </div>

            <Textarea
              label="HRDD Remarks"
              value={evaluationRemarks}
              onChange={(e) => setEvaluationRemarks(e.target.value)}
              rows={3}
              placeholder="Add evaluation remarks..."
            />

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEvaluationModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => { setShowEvaluationModal(false); handleApprove(selectedNomination.id); }} className="flex-1">
                <CheckCircle className="h-4 w-4" />
                Pass Evaluation
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showMemoModal}
        onClose={() => setShowMemoModal(false)}
        title="Memo Directive Generated"
        size="md"
      >
        {selectedNomination && (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <p className="text-emerald-700 dark:text-emerald-300 text-center font-medium">
                Memo Directive has been generated successfully!
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-white mb-2">Memo Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Participant:</span> {selectedNomination.participantName}</p>
                <p><span className="font-medium">Training:</span> {selectedNomination.trainingTitle}</p>
                <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span> <Badge variant="warning">Pending Signatory</Badge></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                The memo directive has been forwarded to the Signatory portal for approval. Participants will be notified once signed.
              </p>
            </div>

            <Button onClick={() => setShowMemoModal(false)} className="w-full">
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
