"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, useClock } from "@/lib/hooks";
import { Card, CardHeader, CardTitle, CardContent, StatCard, Badge, Button, Modal } from "@/components/ui";
import { Textarea } from "@/components/ui";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { fetchNominations, updateNomination, fetchJobAnalysisForms, updateIdp, fetchIdp } from "@/lib/api-client";
import type { NominationForm } from "@/types/portal";
import { motion, AnimatePresence } from "framer-motion";

type Section = "dashboard" | "nominations" | "jaf" | "idp";

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.25 } };

export default function SupervisorPortalPage() {
  const { user, logout, isLoggingOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { formatClock, formatDate } = useClock();
  const [nominations, setNominations] = useState<NominationForm[]>([]);
  const [jafs, setJafs] = useState<any[]>([]);
  const [idpItems, setIdpItems] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJaf, setSelectedJaf] = useState<any>(null);
  const [selectedIdp, setSelectedIdp] = useState<any>(null);
  const [remarks, setRemarks] = useState("");
  const [showJafModal, setShowJafModal] = useState(false);
  const [showIdpModal, setShowIdpModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [nomResult, jafResult, idpResult] = await Promise.all([
          fetchNominations(),
          fetchJobAnalysisForms(),
          fetchIdp(),
        ]);
        if (nomResult.success) setNominations(nomResult.data as NominationForm[]);
        if (jafResult.success) setJafs(jafResult.data);
        if (idpResult.success) setIdpItems(idpResult.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const persistNomination = useCallback(async (nomination: NominationForm) => {
    try {
      await updateNomination({
        id: nomination.id,
        status: nomination.status,
        updatedAt: nomination.updatedAt,
      });
    } catch (error) {
      console.error("Failed to update nomination:", error);
    }
  }, []);

  const pendingNominations = nominations.filter((n) => n.status === "pending_supervisor");
  const approvedNominations = nominations.filter((n) => n.status === "approved");
  const rejectedNominations = nominations.filter((n) => n.status === "disapproved");

  const handleApprove = async (id: string) => {
    const updated = nominations.find((n) => n.id === id);
    if (!updated) return;

    const nomination = {
      ...updated,
      status: "approved" as const,
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateNomination({ id, status: "approved", updatedAt: nomination.updatedAt });
      setNominations((prev) => prev.map((n) => (n.id === id ? nomination : n)));
      alert("Nomination approved!");
    } catch (error) {
      console.error("Failed to approve nomination:", error);
      alert("Failed to approve nomination.");
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Are you sure you want to reject this nomination?")) return;

    const updated = nominations.find((n) => n.id === id);
    if (!updated) return;

    try {
      await updateNomination({ id, status: "disapproved", updatedAt: new Date().toISOString() });
      setNominations((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: "disapproved" as const, updatedAt: new Date().toISOString() } : n
        )
      );
      alert("Nomination rejected!");
    } catch (error) {
      console.error("Failed to reject nomination:", error);
      alert("Failed to reject nomination.");
    }
  };

  const handleJafAction = async (jafId: string, action: "approve" | "reject") => {
    try {
      await updateNomination({ id: jafId, status: action === "approve" ? "Finalized" : "Rejected", updatedAt: new Date().toISOString() });
      setJafs((prev) => prev.map((j) => j.id === jafId ? { ...j, status: action === "approve" ? "Finalized" : "Rejected" } : j));
      setShowJafModal(false);
    } catch (e) { alert("Action failed."); }
  };

  const handleIdpAction = async (action: "approve" | "reject") => {
    if (!selectedIdp) return;
    try {
      await updateIdp({ id: selectedIdp.id, status: action === "approve" ? "pending_hrdd" : "disapproved", supervisorRemarks: remarks });
      setIdpItems((prev) => prev.map((i) => i.id === selectedIdp.id ? { ...i, status: action === "approve" ? "pending_hrdd" : "disapproved", supervisor_remarks: remarks } : i));
      setShowIdpModal(false);
      setRemarks("");
    } catch (e) { alert("Action failed."); }
  };

  const pendingJafs = jafs.filter((j) => j.status === "Pending" || j.status === "pending_supervisor");
  const pendingIdps = idpItems.filter((i) => i.status === "pending_supervisor");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <aside className="fixed mt-16 lg:mt-0 top-0 left-0 h-screen w-[280px] bg-gradient-to-b from-white via-blue-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 dark:border-gray-700 border-r border-gray-200 px-5 py-8 z-40">
          <div className="flex items-center gap-3 mb-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png" className="w-8 h-8" alt="Logo" />
            <div>
              <span className="block text-xl font-bold text-gray-900 dark:text-white">DOTr-HRDD</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Supervisor</span>
            </div>
          </div>

          <nav className="space-y-2">
            {([
              { id: "dashboard", label: "Dashboard", icon: <Users className="h-5 w-5" />, badge: 0 },
              { id: "nominations", label: "Nominations", icon: <FileText className="h-5 w-5" />, badge: pendingNominations.length },
              { id: "jaf", label: "Job Analysis Forms", icon: <FileText className="h-5 w-5" />, badge: pendingJafs.length },
              { id: "idp", label: "IDP Review", icon: <TrendingUp className="h-5 w-5" />, badge: pendingIdps.length },
            ] as const).map((item) => (
              <button key={item.id} onClick={() => setActiveSection(item.id as Section)}
                className={`menu-item ${activeSection === item.id ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-400"}`}>
                {item.icon}
                <span>{item.label}</span>
                {item.badge > 0 && <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-8 left-5 right-5">
            <button onClick={logout} disabled={isLoggingOut} className="w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60 dark:bg-red-950/30 dark:text-red-400">{isLoggingOut ? "Signing out…" : "Sign Out"}</button>
          </div>
        </aside>

        <main className="flex-1 ml-[280px] min-h-screen">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 dark:bg-gray-900 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {activeSection === "dashboard" && "Supervisor Dashboard"}
                {activeSection === "nominations" && "Nominations"}
                {activeSection === "jaf" && "Job Analysis Forms"}
                {activeSection === "idp" && "IDP Review"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden border-r border-gray-200 pr-4 text-right dark:border-gray-700 sm:block">
                <div className="font-bold text-gray-800 dark:text-white">{formatClock()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate()}</div>
              </div>
              <button onClick={toggleTheme} className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-gray-800">
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <div className="flex h-11 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 dark:border-blue-900/70 dark:bg-blue-950/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-200">{user?.initials}</div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name}</span>
              </div>
            </div>
          </header>

          <div className="p-6">
            {activeSection === "dashboard" && (
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-4">
                  <StatCard
                    label="Pending Review"
                    value={pendingNominations.length}
                    note="Awaiting Action"
                    accentColor="bg-amber-100 dark:bg-amber-900/25"
                  />
                  <StatCard
                    label="Approved"
                    value={approvedNominations.length}
                    note="Forwarded to HRDD"
                    accentColor="bg-emerald-100 dark:bg-emerald-900/25"
                  />
                  <StatCard
                    label="Rejected"
                    value={rejectedNominations.length}
                    note="Disapproved"
                    accentColor="bg-red-100 dark:bg-red-900/25"
                  />
                  <StatCard
                    label="Total"
                    value={nominations.length}
                    note="All Nominations"
                    isHighlight
                  />
                </div>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Recent Pending Nominations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingNominations.slice(0, 3).map((nom) => (
                      <div key={nom.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">{nom.participantName}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{nom.trainingTitle}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveSection("nominations")}
                          className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          Review
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {pendingNominations.length === 0 && (
                      <p className="py-8 text-center text-slate-500 dark:text-slate-400">No pending nominations</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "nominations" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Pending Nominations ({pendingNominations.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Employee</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Training</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Office</th>
                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Filed</th>
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
                              <td className="py-4 text-slate-600 dark:text-slate-300">{nom.participantOffice}</td>
                              <td className="py-4 text-slate-500">{nom.dateFiled}</td>
                              <td className="py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <Button size="sm" onClick={() => handleApprove(nom.id)}>
                                    <CheckCircle className="h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="danger" onClick={() => handleReject(nom.id)}>
                                    <XCircle className="h-4 w-4" />
                                    Reject
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

                {approvedNominations.length > 0 && (
                  <Card variant="bordered">
                    <CardHeader>
                      <CardTitle>Approved Nominations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                              <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Employee</th>
                              <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Training</th>
                              <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Date Approved</th>
                              <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {approvedNominations.map((nom) => (
                              <tr key={nom.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="py-4 font-medium text-slate-800 dark:text-white">{nom.participantName}</td>
                                <td className="py-4 text-slate-600 dark:text-slate-300">{nom.trainingTitle}</td>
                                <td className="py-4 text-slate-500">{nom.updatedAt.split("T")[0]}</td>
                                <td className="py-4">
                                  <Badge variant="success">Approved</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* JAF Section */}
            {activeSection === "jaf" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader><CardTitle>Job Analysis Forms — Pending Review</CardTitle></CardHeader>
                  <CardContent>
                    {jafs.length === 0 ? (
                      <p className="py-8 text-center text-slate-400">No Job Analysis Forms submitted yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {jafs.map((jaf: any) => (
                          <motion.div key={jaf.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white">{jaf.fullname || jaf.full_name}</p>
                              <p className="text-sm text-slate-500">{jaf.position_title} · {jaf.office_name}</p>
                              <p className="text-xs text-slate-400 mt-1">{jaf.date_submitted || jaf.created_at?.split("T")[0]}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={jaf.status === "Finalized" ? "success" : jaf.status === "Rejected" ? "danger" : "warning"}>
                                {jaf.status || "Pending"}
                              </Badge>
                              {(jaf.status === "Pending" || !jaf.status) && (
                                <Button size="sm" onClick={() => { setSelectedJaf(jaf); setShowJafModal(true); }}>Review</Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* IDP Review Section */}
            {activeSection === "idp" && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader><CardTitle>Individual Development Plans — Pending Endorsement</CardTitle></CardHeader>
                  <CardContent>
                    {idpItems.length === 0 ? (
                      <p className="py-8 text-center text-slate-400">No IDPs pending review.</p>
                    ) : (
                      <div className="space-y-3">
                        {idpItems.map((idp: any) => (
                          <motion.div key={idp.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white">IDP #{idp.id}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{idp.target_competencies}</p>
                              <p className="text-xs text-slate-400">{idp.created_at?.split("T")[0]}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={idp.status === "approved" ? "success" : idp.status === "disapproved" ? "danger" : idp.status === "pending_hrdd" ? "info" : "warning"}>
                                {idp.status?.replace(/_/g, " ")}
                              </Badge>
                              {idp.status === "pending_supervisor" && (
                                <Button size="sm" onClick={() => { setSelectedIdp(idp); setRemarks(""); setShowIdpModal(true); }}>Review</Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* JAF Review Modal */}
      <Modal isOpen={showJafModal} onClose={() => setShowJafModal(false)} title="Review Job Analysis Form" size="lg">
        {selectedJaf && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {selectedJaf.fullname}</p>
              <p><span className="font-medium">Position:</span> {selectedJaf.position_title}</p>
              <p><span className="font-medium">Office:</span> {selectedJaf.office_name}</p>
              <p><span className="font-medium">Purpose:</span> {selectedJaf.purpose}</p>
              <p><span className="font-medium">Main Duties:</span> {selectedJaf.main_duties}</p>
            </div>
            <Textarea label="Supervisor Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} placeholder="Add your review remarks..." />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowJafModal(false)} className="flex-1">Cancel</Button>
              <Button variant="outline" onClick={() => handleJafAction(selectedJaf.id, "reject")} className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                <XCircle className="h-4 w-4" /> Reject
              </Button>
              <Button onClick={() => handleJafAction(selectedJaf.id, "approve")} className="flex-1">
                <CheckCircle className="h-4 w-4" /> Forward to HRDD
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* IDP Review Modal */}
      <Modal isOpen={showIdpModal} onClose={() => setShowIdpModal(false)} title="Review IDP" size="lg">
        {selectedIdp && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 space-y-2 text-sm">
              <p><span className="font-medium">Current Competencies:</span> {selectedIdp.current_competencies}</p>
              <p><span className="font-medium">Target Competencies:</span> {selectedIdp.target_competencies}</p>
              <p><span className="font-medium">Development Activities:</span> {selectedIdp.development_activities}</p>
              <p><span className="font-medium">Target Date:</span> {selectedIdp.target_date || "—"}</p>
            </div>
            <Textarea label="Supervisor Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} placeholder="Add endorsement remarks..." />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowIdpModal(false)} className="flex-1">Cancel</Button>
              <Button variant="outline" onClick={() => handleIdpAction("reject")} className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                <XCircle className="h-4 w-4" /> Disapprove
              </Button>
              <Button onClick={() => handleIdpAction("approve")} className="flex-1">
                <CheckCircle className="h-4 w-4" /> Endorse to HRDD
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
