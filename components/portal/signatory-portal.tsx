"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { ActionModal } from "@/components/portal/action-modal";
import { DashboardShell } from "@/components/portal/dashboard-shell";
import { LoginScreen } from "@/components/portal/login-screen";
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

const AUTH_USERNAME = "cao_signatory";
const AUTH_PASSWORD = "dotr123";

function openDocumentWindow(title: string, html: string) {
  const popup = window.open("", "_blank", "noopener,noreferrer");

  if (!popup) {
    window.alert("Please allow popups to view the generated document.");
    return;
  }

  popup.document.open();
  popup.document.write(html);
  popup.document.title = title;
  popup.document.close();
}

export function SignatoryPortal() {
  const [database, setDatabase] = useState<PortalDatabase>(() =>
    typeof window === "undefined" ? { applications: [] } : readPortalDatabase(),
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    return storedTheme === "dark" || (!storedTheme && mediaQuery.matches);
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
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
    const pendingFolderCount = new Set(pendingApplications.map((application) => application.title))
      .size;

    return {
      finalizedCount,
      pendingFolderCount,
      signingRate:
        totalApplications > 0 ? Math.round((finalizedCount / totalApplications) * 100) : 0,
      totalApplications,
    };
  }, [nominationApplications, pendingApplications, signedApplications]);

  const persistDatabase = (nextDatabase: PortalDatabase) => {
    setDatabase(nextDatabase);
    writePortalDatabase(nextDatabase);
  };

  const refreshDatabase = () => {
    persistDatabase(readPortalDatabase());
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (trimmedUsername === AUTH_USERNAME && trimmedPassword === AUTH_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
      setPassword("");
      refreshDatabase();
      return;
    }

    setLoginError("Invalid signatory credentials.");
  };

  const handleThemeToggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsSidebarExpanded((value) => !value);
      return;
    }

    setIsMobileOpen((value) => !value);
  };

  const handleTabChange = (nextTab: ActiveTab) => {
    setActiveTab(nextTab);
    setIsNotifOpen(false);
    setExpandedFolders([]);
  };

  const handleFolderToggle = (folderId: string) => {
    setExpandedFolders((current) =>
      current.includes(folderId)
        ? current.filter((entry) => entry !== folderId)
        : [...current, folderId],
    );
  };

  const handleNotificationClick = (notification: PortalNotification) => {
    const target = database.applications.find(
      (application) => application.id === notification.id,
    );

    if (!target) {
      return;
    }

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
  };

  const handleShowNomination = (application: PortalApplication) => {
    openDocumentWindow(
      `Nomination - ${application.name}`,
      buildNominationHtml(application),
    );
  };

  const handleShowMemo = (application: PortalApplication) => {
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
  };

  const handleReviewBatch = (title: string) => {
    setSelectedBatchTitle(title);
    setModalStage("idle");
    setSignaturePreview(null);
    setDisapprovalReason("");
  };

  const handleCloseModal = () => {
    setSelectedBatchTitle(null);
    setModalStage("closed");
    setSignaturePreview(null);
    setDisapprovalReason("");
  };

  const loadSignatureFile = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSignaturePreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleApproveBatch = () => {
    if (!selectedBatchTitle || !signaturePreview || selectedBatchApplications.length === 0) {
      return;
    }

    const objectives = getTrainingInfo(selectedBatchTitle).description;
    const nextApplications = database.applications.map((application) => {
      if (
        application.title !== selectedBatchTitle ||
        !(
          application.status === "Pending Signatory" ||
          application.status === "Finalized"
        )
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
            text: `OFFICIAL MEMO DIRECTIVE: Your nomination for "${application.title}" has been officially approved and signed. Use the signed memo view to open the generated directive.`,
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
  };

  const handleDisapproveBatch = () => {
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
        !(
          application.status === "Pending Signatory" ||
          application.status === "Finalized"
        )
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
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        error={loginError}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        onUsernameChange={setUsername}
        password={password}
        username={username}
      />
    );
  }

  return (
    <div>
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
        onSignOut={() => {
          setIsAuthenticated(false);
          setActiveTab("dashboard");
          setIsMobileOpen(false);
          setIsNotifOpen(false);
          handleCloseModal();
        }}
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
    </div>
  );
}
