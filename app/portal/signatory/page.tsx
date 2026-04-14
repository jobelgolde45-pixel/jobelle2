"use client";

import { useState, useCallback, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, useClock } from "@/lib/hooks";
import { Card, CardHeader, CardTitle, CardContent, StatCard, Badge, Button, Modal } from "@/components/ui";
import { Textarea } from "@/components/ui";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Shield,
  FileSignature,
  CheckCircle,
  Clock,
  Folder,
  ChevronDown,
  Upload,
  Eye,
  FileText,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import type { PortalApplication } from "@/types/portal";
import {
  readPortalDatabase,
  writePortalDatabase,
  buildMemoHtml,
  buildOutOfHouseMemoHtml,
  buildInHouseMemoHtml,
  buildLtoHtml,
  getTrainingInfo,
} from "@/lib/portal-data";
import type { MemoDirective, LocalTravelOrder } from "@/types/portal";

export default function SignatoryPortalPage() {
  const { user, logout, isLoggingOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { formatClock, formatDate } = useClock();
  const [database, setDatabase] = useState(() => (typeof window !== "undefined" ? readPortalDatabase() : { applications: [] }));
  const [memoDirectives, setMemoDirectives] = useState<MemoDirective[]>([]);
  const [localTravelOrders, setLocalTravelOrders] = useState<LocalTravelOrder[]>([]);
  const [activeSection, setActiveSection] = useState<"dashboard" | "pending" | "archive" | "memos" | "ltos">("dashboard");
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<PortalApplication | null>(null);
  const [signatureFile, setSignatureFile] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDisapproveModal, setShowDisapproveModal] = useState(false);
  const [disapprovalReason, setDisapprovalReason] = useState("");

  const persistDatabase = useCallback((next: typeof database) => {
    setDatabase(next);
    writePortalDatabase(next);
  }, []);

  const refreshDatabase = useCallback(() => {
    const data = readPortalDatabase();
    setDatabase(data);
  }, []);

  const pendingApplications = database.applications.filter(
    (app) => app.status === "Pending Signatory" || app.status === "Finalized"
  );
  const signedApplications = database.applications.filter((app) => app.status === "Signed");

  const folderGroups = pendingApplications.reduce((acc, app) => {
    const key = app.title;
    if (!acc[key]) acc[key] = [];
    acc[key].push(app);
    return acc;
  }, {} as Record<string, PortalApplication[]>);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    );
  };

  const handleOpenApplicationModal = (application: PortalApplication) => {
    setSelectedApplication(application);
  };

  const handleCloseApplicationModal = () => {
    setSelectedApplication(null);
  };

  const handleShowNomination = (application: PortalApplication) => {
    const html = generateNominationHtml(application);
    const popup = window.open("", "_blank");
    if (popup) {
      popup.document.open();
      popup.document.write(html);
      popup.document.close();
    }
  };

  const handleViewMemo = (app: PortalApplication, signature?: string) => {
    const trainingInfo = getTrainingInfo(app.title);
    const isOutOfHouse = trainingInfo.details?.mode?.toLowerCase().includes("out") ||
                         trainingInfo.details?.mode?.toLowerCase().includes("seminar") ||
                         trainingInfo.details?.mode?.toLowerCase().includes("conference");

    const memo: MemoDirective = {
      id: `memo_${app.id}`,
      nominationId: String(app.id),
      memoType: isOutOfHouse ? "out-of-house" : "in-house",
      participantName: app.name,
      participantPosition: app.position,
      participantOffice: app.office,
      trainingTitle: app.title,
      trainingDate: app.date_course || "",
      trainingTimeIn: app.memo_time_in,
      trainingTimeOut: app.memo_time_out,
      provider: app.memo_provider || "",
      venue: app.venue || "",
      objectives: trainingInfo.description,
      requirements: [
        "Post-Training Evaluation Form & PTR (within 7 days)",
        "Certificate of Completion/Attendance (within 3 days)",
      ],
      submissionDeadline: "7 days after training",
      memoDate: app.memo_date || new Date().toISOString().split("T")[0],
      status: signature ? "signed" : "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      signature: signature,
      signedBy: signature ? "Chief Administrative Officer" : undefined,
      signedDate: signature ? new Date().toISOString().split("T")[0] : undefined,
    };

    const html = isOutOfHouse 
      ? buildOutOfHouseMemoHtml(memo, signature)
      : buildInHouseMemoHtml(memo, signature);
    
    const popup = window.open("", "_blank");
    if (popup) {
      popup.document.open();
      popup.document.write(html);
      popup.document.close();
    }
  };

  const handleGenerateLto = (app: PortalApplication) => {
    const trainingInfo = getTrainingInfo(app.title);
    
    const memo: MemoDirective = {
      id: `memo_${app.id}`,
      nominationId: String(app.id),
      memoType: "out-of-house",
      participantName: app.name,
      participantPosition: app.position,
      participantOffice: app.office,
      trainingTitle: app.title,
      trainingDate: app.date_course || "",
      provider: app.memo_provider || "",
      venue: app.venue || "",
      objectives: trainingInfo.description,
      requirements: [],
      submissionDeadline: "",
      memoDate: new Date().toISOString().split("T")[0],
      status: "signed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const lto: LocalTravelOrder = {
      id: `lto_${Date.now()}`,
      memoDirectiveId: memo.id,
      participantName: app.name,
      participantPosition: app.position,
      participantOffice: app.office,
      trainingTitle: app.title,
      trainingDate: app.date_course || "",
      venue: app.venue || "",
      status: "generated",
      torfSubmitted: false,
      torfApproved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLocalTravelOrders((prev) => [...prev, lto]);

    const html = buildLtoHtml(lto, memo);
    const popup = window.open("", "_blank");
    if (popup) {
      popup.document.open();
      popup.document.write(html);
      popup.document.close();
    }
  };

  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSignatureFile(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApproveBatch = () => {
    if (!selectedBatch || !signatureFile) return;

    const nextApplications = database.applications.map((app) => {
      if (app.title !== selectedBatch) return app;
      if (app.status !== "Pending Signatory" && app.status !== "Finalized") return app;
      return {
        ...app,
        status: "Signed" as const,
        messages: [
          ...(app.messages || []),
          {
            sender: "Signatory",
            text: `OFFICIAL MEMO DIRECTIVE: Your nomination for "${app.title}" has been approved and signed.`,
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
        read: false,
      };
    });

    persistDatabase({ applications: nextApplications });
    alert("Batch approved and memos generated!");
    setShowApproveModal(false);
    setSelectedBatch(null);
    setSignatureFile(null);
    refreshDatabase();
  };

  const handleDisapproveBatch = () => {
    if (!selectedBatch || !disapprovalReason.trim()) {
      alert("Please provide a reason for disapproval");
      return;
    }

    const nextApplications = database.applications.map((app) => {
      if (app.title !== selectedBatch) return app;
      if (app.status !== "Pending Signatory" && app.status !== "Finalized") return app;
      return {
        ...app,
        status: "Rejected" as const,
        messages: [
          ...(app.messages || []),
          {
            sender: "Signatory",
            text: `DISAPPROVAL NOTICE: Your nomination for "${app.title}" has been disapproved. Reason: ${disapprovalReason}`,
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
        read: false,
      };
    });

    persistDatabase({ applications: nextApplications });
    alert("Batch disapproved!");
    setShowDisapproveModal(false);
    setSelectedBatch(null);
    setDisapprovalReason("");
    refreshDatabase();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(219,234,254,0.7)_35%,_rgba(238,244,255,0.95)_75%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.9),_rgba(2,6,23,0.95)_45%,_rgba(2,6,23,1)_80%)] dark:text-slate-100">
      <div className="flex">
        <aside className="fixed mt-16 lg:mt-0 top-0 left-0 h-screen w-[280px] bg-white/90 border-r border-white/60 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur px-5 py-8 z-40 dark:bg-slate-950/85 dark:border-slate-700/70">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png"
              className="w-8 h-8"
              alt="Logo"
            />
            <div>
              <span className="block text-xl font-bold text-slate-900 dark:text-white">DOTr HRDD</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Signatory</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`menu-item ${activeSection === "dashboard" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "text-slate-600 dark:text-slate-400"}`}
            >
              <Shield className="h-5 w-5" />
              <span>Dashboard</span>
              {pendingApplications.length > 0 && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {Object.keys(folderGroups).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSection("pending")}
              className={`menu-item ${activeSection === "pending" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "text-slate-600 dark:text-slate-400"}`}
            >
              <Clock className="h-5 w-5" />
              <span>Pending</span>
            </button>
            <button
              onClick={() => setActiveSection("archive")}
              className={`menu-item ${activeSection === "archive" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "text-slate-600 dark:text-slate-400"}`}
            >
              <CheckCircle className="h-5 w-5" />
              <span>Archive</span>
            </button>
            <button
              onClick={() => setActiveSection("memos")}
              className={`menu-item ${activeSection === "memos" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "text-slate-600 dark:text-slate-400"}`}
            >
              <FileSignature className="h-5 w-5" />
              <span>Memo Directives</span>
            </button>
            <button
              onClick={() => setActiveSection("ltos")}
              className={`menu-item ${activeSection === "ltos" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "text-slate-600 dark:text-slate-400"}`}
            >
              <Clock className="h-5 w-5" />
              <span>LTOs</span>
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
          <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 shadow-[0_8px_40px_rgba(148,163,184,0.15)] backdrop-blur px-6 py-4 dark:bg-slate-950/75 dark:border-slate-700/70">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {activeSection === "dashboard" && "Signatory Dashboard"}
                  {activeSection === "pending" && "Pending Signatures"}
                  {activeSection === "archive" && "Signed Archive"}
                  {activeSection === "memos" && "Memo Directives"}
                  {activeSection === "ltos" && "Local Travel Orders"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Human Resource Development Division</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden border-r border-slate-200 pr-4 text-right dark:border-slate-700 sm:block">
                  <div className="font-bold text-slate-800 dark:text-white">{formatClock()}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{formatDate()}</div>
                </div>

                <button onClick={toggleTheme} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {isDark ? "☀️" : "🌙"}
                </button>

                <div className="flex h-11 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 dark:border-blue-900/70 dark:bg-blue-950/40">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-cyan-100 font-bold text-blue-700 dark:from-blue-900 dark:to-slate-800 dark:text-blue-200">
                    {user?.initials}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            {activeSection === "dashboard" && (
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-4">
                  <StatCard label="Pending Folders" value={Object.keys(folderGroups).length} note="Awaiting Signature" accentColor="bg-amber-100 dark:bg-amber-900/25" />
                  <StatCard label="Total Memos Signed" value={signedApplications.length} note="Blasted" accentColor="bg-emerald-100 dark:bg-emerald-900/25" />
                  <StatCard label="Total Applications" value={database.applications.length} accentColor="bg-purple-100 dark:bg-purple-900/25" />
                  <StatCard
                    label="Signing Rate"
                    value={database.applications.length > 0 ? Math.round((signedApplications.length / database.applications.length) * 100) : 0}
                    note="%"
                    isHighlight
                  />
                </div>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Pending Memo Directives</CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Object.entries(folderGroups).map(([title, apps], index) => {
                      const folderId = `folder-${index}`;
                      const isExpanded = expandedFolders.includes(folderId);
                      return (
                        <div key={title}>
                          <button
                            onClick={() => toggleFolder(folderId)}
                            className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            <div className="flex items-center gap-3">
                              <Folder className="h-6 w-6 text-amber-500" />
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">{title}</h4>
                                <p className="text-sm text-slate-500">{apps.length} nominee(s)</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="warning">PENDING</Badge>
                              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="bg-slate-50 p-4 dark:bg-slate-900/50">
                              <table className="w-full text-left text-sm">
                                <thead>
                                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                                    <th className="pb-2">Employee</th>
                                    <th className="pb-2">Office</th>
                                    <th className="pb-2">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                  {apps.map((app) => (
                                    <tr key={app.id}>
                                      <td className="py-2 font-medium text-slate-800 dark:text-white">{app.name}</td>
                                      <td className="py-2 text-slate-600 dark:text-slate-300">{app.office}</td>
                                      <td className="py-2">
                                        <button
                                          onClick={() => handleOpenApplicationModal(app)}
                                          className="text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                          Review Details
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="mt-4 flex gap-3">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBatch(title);
                                    setShowApproveModal(true);
                                  }}
                                >
                                  <FileSignature className="h-4 w-4" />
                                  Review & Sign Batch
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => {
                                    setSelectedBatch(title);
                                    setShowDisapproveModal(true);
                                  }}
                                >
                                  Disapprove Batch
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {Object.keys(folderGroups).length === 0 && (
                      <p className="py-8 text-center text-slate-500">No pending records</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "pending" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Pending Signatures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">{app.name}</h4>
                          <p className="text-sm text-slate-500">{app.title}</p>
                        </div>
                        <Button size="sm" onClick={() => handleOpenApplicationModal(app)}>
                          <Eye className="h-4 w-4" />
                          Review
                        </Button>
                      </div>
                    ))}
                    {pendingApplications.length === 0 && (
                      <p className="py-8 text-center text-slate-500">No pending signatures</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "archive" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Signed Memos Archive</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {signedApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">{app.name}</h4>
                          <p className="text-sm text-slate-500">{app.title}</p>
                        </div>
                        <Badge variant="success">Signed</Badge>
                      </div>
                    ))}
                    {signedApplications.length === 0 && (
                      <p className="py-8 text-center text-slate-500">No signed memos</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "memos" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Memo Directive Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      View and manage memo directives. After signing, participants can generate the official memo.
                    </p>
                    <div className="space-y-4">
                      {pendingApplications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">{app.name}</h4>
                            <p className="text-sm text-slate-500">{app.title}</p>
                            <p className="text-xs text-slate-400 mt-1">Memo Date: {app.memo_date || "Not generated"}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewMemo(app)}>
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      ))}
                      {pendingApplications.length === 0 && (
                        <p className="py-8 text-center text-slate-500">No pending memos</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "ltos" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Local Travel Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Generate Local Travel Orders (LTO) for out-of-house trainings. LTOs are automatically updated in the LTO Database Dashboard.
                    </p>
                    <div className="space-y-4">
                      {localTravelOrders.length === 0 && pendingApplications.length === 0 ? (
                        <p className="py-8 text-center text-slate-500">No LTOs generated</p>
                      ) : (
                        <>
                          {pendingApplications.map((app) => (
                            <div key={app.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">{app.name}</h4>
                                <p className="text-sm text-slate-500">{app.title}</p>
                                <p className="text-xs text-slate-400 mt-1">Training: {app.date_course}</p>
                              </div>
                              <Button size="sm" onClick={() => handleGenerateLto(app)}>
                                Generate LTO
                              </Button>
                            </div>
                          ))}
                          {localTravelOrders.map((lto) => (
                            <div key={lto.id} className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                              <div>
                                <h4 className="font-bold text-emerald-700 dark:text-emerald-400">{lto.participantName}</h4>
                                <p className="text-sm text-emerald-600 dark:text-emerald-300">{lto.trainingTitle}</p>
                                <p className="text-xs text-emerald-500 mt-1">LTO No: {lto.ltoNumber || "Generated"}</p>
                              </div>
                              <Badge variant="success">Generated</Badge>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      <Modal
        isOpen={Boolean(selectedApplication)}
        onClose={handleCloseApplicationModal}
        title={selectedApplication ? `Pending Signature Review: ${selectedApplication.name}` : "Pending Signature Review"}
        description="Review the nomination details in-app before opening the printable document or signing the batch."
        size="xl"
      >
        {selectedApplication ? (
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                      <FileSignature className="h-3.5 w-3.5" />
                      Pending Signature
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedApplication.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Confirm the nominee details, training schedule, and justification before signing the memo batch.
                    </p>
                  </div>
                  <Badge variant="warning">{selectedApplication.status}</Badge>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <DetailTile icon={<UserRound className="h-4 w-4" />} label="Nominee" value={selectedApplication.name} />
                  <DetailTile icon={<Briefcase className="h-4 w-4" />} label="Position" value={selectedApplication.position} />
                  <DetailTile icon={<Building2 className="h-4 w-4" />} label="Office" value={selectedApplication.office} />
                  <DetailTile icon={<CalendarDays className="h-4 w-4" />} label="Training Date" value={selectedApplication.date_course || "To be announced"} />
                  <DetailTile icon={<Mail className="h-4 w-4" />} label="Email" value={selectedApplication.email || "Not provided"} />
                  <DetailTile icon={<Phone className="h-4 w-4" />} label="Contact" value={selectedApplication.contact || "Not provided"} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Submission Snapshot
                  </p>
                  <dl className="mt-4 space-y-3 text-sm">
                    <MetaRow label="Date Filed" value={selectedApplication.date_filing || selectedApplication.date_submitted || "Not available"} />
                    <MetaRow label="Venue" value={selectedApplication.venue || "To be announced"} />
                    <MetaRow label="Competency" value={selectedApplication.competency || "Not specified"} />
                    <MetaRow label="Supervisor" value={selectedApplication.supervisor || "Not specified"} />
                  </dl>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Next Actions
                  </p>
                  <div className="mt-4 space-y-3">
                    <Button variant="outline" className="w-full justify-center" onClick={() => handleShowNomination(selectedApplication)}>
                      <FileText className="h-4 w-4" />
                      Open Printable Form
                    </Button>
                    <Button
                      className="w-full justify-center"
                      onClick={() => {
                        setSelectedBatch(selectedApplication.title);
                        handleCloseApplicationModal();
                        setShowApproveModal(true);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Sign This Batch
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/70">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Employment Details
                </p>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MetaCard label="Salary Grade" value={selectedApplication.salary_grade || "Not indicated"} />
                  <MetaCard label="Service Length" value={selectedApplication.service_length || "Not indicated"} />
                  <MetaCard label="Date Hired" value={selectedApplication.date_hired || "Not indicated"} />
                  <MetaCard label="Gender" value={selectedApplication.gender || "Not indicated"} />
                </dl>
              </section>

              <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/70">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Training Justification
                </p>
                <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  {selectedApplication.justification || "No justification was provided."}
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} title="Sign & Approve Batch" size="lg">
        <div className="space-y-6">
          <p className="text-slate-600 dark:text-slate-300">
            Uploading a signature will approve and sign all nominations in this batch.
          </p>

          <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-600">
            <input type="file" accept="image/*" onChange={handleUploadSignature} className="hidden" id="signature-upload" />
            <label htmlFor="signature-upload" className="cursor-pointer">
              {signatureFile ? (
                <img src={signatureFile} alt="Signature preview" className="mx-auto h-16 object-contain" />
              ) : (
                <div className="text-slate-500 dark:text-slate-400">
                  <Upload className="mx-auto h-8 w-8 mb-2" />
                  <p>Click to upload signature</p>
                </div>
              )}
            </label>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setShowApproveModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleApproveBatch} disabled={!signatureFile} className="flex-1">
              <CheckCircle className="h-4 w-4" />
              Sign & Approve
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDisapproveModal} onClose={() => setShowDisapproveModal(false)} title="Disapprove Batch" size="lg">
        <div className="space-y-6">
          <Textarea
            label="Reason for Disapproval"
            value={disapprovalReason}
            onChange={(e) => setDisapprovalReason(e.target.value)}
            rows={4}
            placeholder="Enter the reason for disapproving this batch..."
          />

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setShowDisapproveModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDisapproveBatch} disabled={!disapprovalReason.trim()} className="flex-1">
              Confirm Disapproval
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DetailTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white/90 p-4 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-3 last:border-b-0 last:pb-0 dark:border-slate-800">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right font-semibold text-slate-800 dark:text-white">{value}</dd>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-slate-50 p-4 dark:bg-slate-900">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function generateNominationHtml(application: PortalApplication): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Nomination Form - ${application.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #1e40af; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Learning and Development Nomination Form</h1>
  <div class="field"><span class="label">Name:</span> ${application.name}</div>
  <div class="field"><span class="label">Training:</span> ${application.title}</div>
  <div class="field"><span class="label">Position:</span> ${application.position}</div>
  <div class="field"><span class="label">Office:</span> ${application.office}</div>
  <div class="field"><span class="label">Date of Training:</span> ${application.date_course || "TBA"}</div>
  <div class="field"><span class="label">Venue:</span> ${application.venue || "TBA"}</div>
  <div class="field"><span class="label">Justification:</span> ${application.justification || "N/A"}</div>
</body>
</html>`;
}
