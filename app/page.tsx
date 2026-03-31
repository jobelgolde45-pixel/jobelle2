"use client";

import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActionModal } from "@/components/portal/action-modal";
import { DashboardShell } from "@/components/portal/dashboard-shell";
import { UserPortal } from "@/components/portal/user-portal";
import {
  authenticate,
  CREDENTIALS,
  type AuthCredentials,
  type UserRole,
} from "@/lib/auth-credentials";
import {
  buildFolderGroups,
  buildMemoHtml,
  buildNominationHtml,
  formatClock,
  formatHeaderDate,
  getInitials,
  getNotifications,
  getTrainingInfo,
  readPortalDatabase,
  THEME_KEY,
  writePortalDatabase,
} from "@/lib/portal-data";
import type {
  ActiveTab,
  ModalStage,
  PortalApplication,
  PortalDatabase,
  PortalNotification,
} from "@/types/portal";

function UnifiedLoginScreen({
  error,
  onPasswordChange,
  onSubmit,
  onUsernameChange,
  password,
  username,
}: {
  error: string;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUsernameChange: (value: string) => void;
  password: string;
  username: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/20">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-800">
              DOTr-HRDD Portal
            </h1>
            <p className="mt-1 text-sm text-slate-500">Learning Management Portal</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="portal-username">
                Username
              </label>
              <input
                id="portal-username"
                type="text"
                value={username}
                onChange={(event) => onUsernameChange(event.target.value)}
                placeholder="Enter your username"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="portal-password">
                Password
              </label>
              <input
                id="portal-password"
                type="password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold text-slate-600">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-slate-500">
              <p><span className="font-medium">Signatory:</span> cao_signatory / dotr123</p>
              <p><span className="font-medium">Employee:</span> employee / password123</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/75">
          © 2024 Department of Transportation - HRDD
        </p>
      </div>
    </div>
  );
}

function SignatoryDashboard({
  onSignOut,
}: {
  onSignOut: () => void;
}) {
  const [database, setDatabase] = useState<PortalDatabase>(() =>
    typeof window === "undefined" ? { applications: [] } : readPortalDatabase(),
  );
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    return storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [selectedBatchTitle, setSelectedBatchTitle] = useState<string | null>(null);
  const [modalStage, setModalStage] = useState<ModalStage>("closed");
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [disapprovalReason, setDisapprovalReason] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    const tick = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, [isDark]);

  const nominationApplications = useMemo(
    () => database.applications.filter((application) => application.formType !== "jaf"),
    [database.applications],
  );

  const pendingApplications = useMemo(
    () =>
      nominationApplications.filter(
        (application) =>
          application.status === "Pending Signatory" || application.status === "Finalized",
      ),
    [nominationApplications],
  );

  const signedApplications = useMemo(
    () =>
      nominationApplications.filter((application) => application.status === "Signed"),
    [nominationApplications],
  );

  const dashboardGroups = useMemo(
    () => buildFolderGroups(pendingApplications),
    [pendingApplications],
  );

  const archiveGroups = useMemo(
    () => buildFolderGroups(signedApplications),
    [signedApplications],
  );

  const notifications = useMemo(
    () => getNotifications(database),
    [database],
  );

  const selectedBatchApplications = useMemo(
    () =>
      selectedBatchTitle
        ? pendingApplications.filter((application) => application.title === selectedBatchTitle)
        : [],
    [pendingApplications, selectedBatchTitle],
  );

  const stats = useMemo(() => {
    const totalApplications = nominationApplications.length;
    const finalizedCount = signedApplications.length;
    const pendingFolderCount = new Set(pendingApplications.map((application) => application.title)).size;

    return {
      finalizedCount,
      pendingFolderCount,
      signingRate:
        totalApplications > 0 ? Math.round((finalizedCount / totalApplications) * 100) : 0,
      totalApplications,
    };
  }, [nominationApplications, pendingApplications, signedApplications]);

  const persistDatabase = useCallback((nextDatabase: PortalDatabase) => {
    setDatabase(nextDatabase);
    writePortalDatabase(nextDatabase);
  }, []);

  const refreshDatabase = useCallback(() => {
    persistDatabase(readPortalDatabase());
  }, [persistDatabase]);

  const handleThemeToggle = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }, [isDark]);

  const handleToggleSidebar = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarExpanded((value) => !value);
    } else {
      setIsMobileOpen((value) => !value);
    }
  }, []);

  const handleTabChange = useCallback((nextTab: ActiveTab) => {
    setActiveTab(nextTab);
    setIsNotifOpen(false);
    setExpandedFolders([]);
  }, []);

  const handleFolderToggle = useCallback((folderId: string) => {
    setExpandedFolders((current) =>
      current.includes(folderId)
        ? current.filter((entry) => entry !== folderId)
        : [...current, folderId],
    );
  }, []);

  const handleNotificationClick = useCallback((notification: PortalNotification) => {
    const target = database.applications.find(
      (application) => application.id === notification.id,
    );

    if (!target) return;

    const nextDatabase = {
      applications: database.applications.map((application) =>
        application.id === target.id
          ? { ...application, admin_read: true }
          : application,
      ),
    };

    persistDatabase(nextDatabase);
    setActiveTab("dashboard");
    setSelectedBatchTitle(target.title);
    setModalStage("idle");
    setIsNotifOpen(false);
  }, [database, persistDatabase]);

  const openDocumentWindow = useCallback((title: string, html: string) => {
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) {
      window.alert("Please allow popups to view the generated document.");
      return;
    }
    popup.document.open();
    popup.document.write(html);
    popup.document.title = title;
    popup.document.close();
  }, []);

  const handleShowNomination = useCallback((application: PortalApplication) => {
    openDocumentWindow(
      `Nomination - ${application.name}`,
      buildNominationHtml(application),
    );
  }, [openDocumentWindow]);

  const handleShowMemo = useCallback((application: PortalApplication) => {
    if (application.memo_pdf?.startsWith("data:application/pdf")) {
      const popup = window.open("", "_blank", "noopener,noreferrer");
      if (!popup) {
        window.alert("Please allow popups to view the generated document.");
        return;
      }
      popup.document.open();
      popup.document.write(
        `<iframe title="Memo PDF" src="${application.memo_pdf}" style="border:0;width:100vw;height:100vh;"></iframe>`,
      );
      popup.document.close();
      return;
    }

    const fallbackHtml =
      application.memoHtml ??
      buildMemoHtml(
        application,
        getTrainingInfo(application.title).description,
        signaturePreview ?? undefined,
      );

    openDocumentWindow(`Memo - ${application.name}`, fallbackHtml);
  }, [openDocumentWindow, signaturePreview]);

  const handleReviewBatch = useCallback((title: string) => {
    setSelectedBatchTitle(title);
    setModalStage("idle");
    setSignaturePreview(null);
    setDisapprovalReason("");
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedBatchTitle(null);
    setModalStage("closed");
    setSignaturePreview(null);
    setDisapprovalReason("");
  }, []);

  const loadSignatureFile = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSignaturePreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleApproveBatch = useCallback(() => {
    if (!selectedBatchTitle || !signaturePreview || selectedBatchApplications.length === 0) return;

    const objectives = getTrainingInfo(selectedBatchTitle).description;
    const nextApplications = database.applications.map((application) => {
      if (
        application.title !== selectedBatchTitle ||
        !(application.status === "Pending Signatory" || application.status === "Finalized")
      ) {
        return application;
      }

      const memoHtml = buildMemoHtml(application, objectives, signaturePreview);

      return {
        ...application,
        memoHtml,
        messages: [
          ...(application.messages ?? []),
          {
            sender: "Admin",
            text: `OFFICIAL MEMO DIRECTIVE: Your nomination for "${application.title}" has been officially approved and signed.`,
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
        read: false,
        status: "Signed" as const,
      };
    });

    persistDatabase({ applications: nextApplications });
    window.alert("Batch processed. Memos were signed and posted to the local portal records.");
    handleCloseModal();
  }, [database, handleCloseModal, persistDatabase, selectedBatchApplications.length, selectedBatchTitle, signaturePreview]);

  const handleDisapproveBatch = useCallback(() => {
    if (!selectedBatchTitle || !disapprovalReason.trim()) {
      window.alert("Please provide a reason for the batch disapproval.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to disapprove the entire batch of ${selectedBatchApplications.length} applications?`,
      )
    ) {
      return;
    }

    const reason = disapprovalReason.trim();
    const nextApplications = database.applications.map((application) => {
      if (
        application.title !== selectedBatchTitle ||
        !(application.status === "Pending Signatory" || application.status === "Finalized")
      ) {
        return application;
      }

      return {
        ...application,
        messages: [
          ...(application.messages ?? []),
          {
            sender: "Admin",
            text: `SIGNATORY DISAPPROVAL NOTICE: The batch application for "${application.title}" has been disapproved. Reason: ${reason}`,
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
        read: false,
        status: "Rejected" as const,
      };
    });

    persistDatabase({ applications: nextApplications });
    window.alert("Batch disapproved.");
    handleCloseModal();
  }, [database, disapprovalReason, handleCloseModal, persistDatabase, selectedBatchApplications.length, selectedBatchTitle]);

  return (
    <>
      <DashboardShell
        activeTab={activeTab}
        archiveGroups={archiveGroups}
        dashboardGroups={dashboardGroups}
        expandedFolders={expandedFolders}
        initials={getInitials("Authorized Signatory")}
        isDark={isDark}
        isMobileOpen={isMobileOpen}
        isNotifOpen={isNotifOpen}
        isSidebarExpanded={isSidebarExpanded}
        notifications={notifications}
        onFolderToggle={handleFolderToggle}
        onNotificationClick={handleNotificationClick}
        onRefresh={refreshDatabase}
        onReviewBatch={handleReviewBatch}
        onShowMemo={handleShowMemo}
        onShowNomination={handleShowNomination}
        onSignOut={onSignOut}
        onTabChange={handleTabChange}
        onThemeToggle={handleThemeToggle}
        onToggleNotifications={() => setIsNotifOpen((value) => !value)}
        onToggleSidebar={handleToggleSidebar}
        stats={stats}
        timeLabel={formatClock(clock)}
        userName="Authorized Signatory"
        dateLabel={formatHeaderDate(clock)}
      />

      {selectedBatchTitle ? (
        <ActionModal
          applications={selectedBatchApplications}
          batchTitle={selectedBatchTitle}
          disapprovalReason={disapprovalReason}
          modalStage={modalStage}
          onApprove={modalStage === "disapprove" ? handleDisapproveBatch : handleApproveBatch}
          onClose={handleCloseModal}
          onDisapprovalReasonChange={setDisapprovalReason}
          onDrop={(event) => {
            event.preventDefault();
            loadSignatureFile(event.dataTransfer.files[0] ?? null);
          }}
          onFileChange={(event) => {
            loadSignatureFile(event.target.files?.[0] ?? null);
          }}
          onOpenDisapprove={() => setModalStage("disapprove")}
          onOpenSignatureUpload={() => setModalStage("approve")}
          onShowNomination={handleShowNomination}
          signaturePreview={signaturePreview}
        />
      ) : null}
    </>
  );
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const credentials = authenticate(username, password);

    if (credentials) {
      setIsAuthenticated(true);
      setUserRole(credentials.role);
      setLoginError("");
      return;
    }

    setLoginError("Invalid credentials. Please check your username and password.");
  }, [username, password]);

  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername("");
    setPassword("");
  }, []);

  if (!isAuthenticated) {
    return (
      <UnifiedLoginScreen
        error={loginError}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        onUsernameChange={setUsername}
        password={password}
        username={username}
      />
    );
  }

  if (userRole === "employee") {
    const credentials = CREDENTIALS.find((c) => c.username.toLowerCase() === username.trim().toLowerCase());
    return <UserPortal username={credentials?.name || username} onSignOut={handleSignOut} />;
  }

  return <SignatoryDashboard onSignOut={handleSignOut} />;
}
