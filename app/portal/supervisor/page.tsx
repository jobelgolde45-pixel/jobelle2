"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, useClock } from "@/lib/hooks";
import { Card, CardHeader, CardTitle, CardContent, StatCard, Badge, Button } from "@/components/ui";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { fetchNominations, updateNomination } from "@/lib/api-client";
import type { NominationForm } from "@/types/portal";

export default function SupervisorPortalPage() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { formatClock, formatDate } = useClock();
  const [nominations, setNominations] = useState<NominationForm[]>([]);
  const [activeSection, setActiveSection] = useState<"dashboard" | "nominations">("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNominations() {
      try {
        const result = await fetchNominations();
        if (result.success) {
          setNominations(result.data as NominationForm[]);
        }
      } catch (error) {
        console.error("Failed to load nominations:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNominations();
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
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Supervisor</span>
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
                {activeSection === "dashboard" ? "Supervisor Dashboard" : "Nominations"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.name}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden border-r border-gray-200 pr-4 text-right dark:border-gray-700 sm:block">
                <div className="font-bold text-gray-800 dark:text-white">{formatClock()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate()}</div>
              </div>

              <button
                onClick={toggleTheme}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-800"
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
          </div>
        </main>
      </div>
    </div>
  );
}
