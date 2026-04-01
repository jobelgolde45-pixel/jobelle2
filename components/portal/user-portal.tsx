"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ContentSection,
  UserApplication,
  UserDatabase,
} from "@/types/user-portal";
import {
  EMPLOYMENT_STATUS,
  formatClock,
  formatHeaderDate,
  getInitials,
  getUserNotifications,
  OFFICES,
  readUserDatabase,
  SALARY_GRADES,
  TRAINING_CATALOG,
  TRAINING_COLORS,
  writeUserDatabase,
} from "@/lib/user-portal-data";
import { SelfPacedPortal } from "@/components/portal/self-paced-portal";

const THEME_KEY = "user-portal-theme";

interface UserPortalProps {
  username: string;
  onSignOut: () => void;
}

export function UserPortal({ username, onSignOut }: UserPortalProps) {
  const [database, setDatabase] = useState<UserDatabase>(() =>
    typeof window === "undefined" ? { applications: [] } : readUserDatabase()
  );
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "dark";
  });
  const [activeSection, setActiveSection] = useState<ContentSection>("trainings-main");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const [expandedTrainings, setExpandedTrainings] = useState<string | null>(null);
  const [activeTrainingType, setActiveTrainingType] = useState<string | null>(null);
  const [activeTrainingIndex, setActiveTrainingIndex] = useState(0);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>("trainings");
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [showSelfPacedPortal, setShowSelfPacedPortal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    const tick = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, [isDark]);

  const persistDatabase = useCallback((next: UserDatabase) => {
    setDatabase(next);
    writeUserDatabase(next);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  }, []);

  const handleLogout = () => {
    setActiveSection("trainings-main");
    setIsMobileOpen(false);
    setIsNotifOpen(false);
    setIsUserMenuOpen(false);
    onSignOut();
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsSidebarExpanded((v) => !v);
    } else {
      setIsMobileOpen((v) => !v);
    }
  };

  const handleSectionChange = (section: ContentSection) => {
    setActiveSection(section);
  };

  const handleSubmenuToggle = (submenu: string) => {
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  };

  const notifications = useMemo(
    () => getUserNotifications(database, username),
    [database, username]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.isUnread).length,
    [notifications]
  );

  const handleOpenModal = (quarter: string) => {
    setExpandedTrainings(quarter);
    setActiveTrainingType(null);
    setActiveTrainingIndex(0);
  };

  const handleSelectTrainingType = (type: string) => {
    setActiveTrainingType(type);
    setActiveTrainingIndex(0);
  };

  const handleTrainingNav = (direction: "prev" | "next") => {
    if (!activeTrainingType) return;
    const items = TRAINING_CATALOG[activeTrainingType] || [];
    if (direction === "prev" && activeTrainingIndex > 0) {
      setActiveTrainingIndex((i) => i - 1);
    } else if (direction === "next" && activeTrainingIndex < items.length - 1) {
      setActiveTrainingIndex((i) => i + 1);
    }
  };

  const handleEnroll = (training: (typeof TRAINING_CATALOG)[string][number]) => {
    if (training.link) {
      window.open(training.link, "_blank");
    }
  };

  const handleRegisterHere = (training: (typeof TRAINING_CATALOG)[string][number]) => {
    setActiveSection("nomination-form");
    setExpandedTrainings(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, _isJA = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setUploadedSignature(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitNomination = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const application: UserApplication = {
      id: Date.now(),
      status: "Pending",
      date_submitted: new Date().toISOString().split("T")[0],
      title: formData.get("title") as string,
      date_course: formData.get("date_course") as string,
      date_filing: formData.get("date_filing") as string,
      venue: formData.get("venue") as string,
      competency: formData.get("competency") as "core" | "leadership" | "functional",
      name: username,
      user_account: username,
      id_num: formData.get("id_num") as string,
      email: formData.get("email") as string,
      office: formData.get("office") as string,
      position: formData.get("position") as string,
      supervisor: formData.get("supervisor") as string,
      date_hired: formData.get("date_hired") as string,
      emp_status: formData.get("emp_status") as string,
      sg: formData.get("sg") as string,
      service: formData.get("service") as string,
      contact: formData.get("contact") as string,
      gender: formData.get("gender") as string,
      oic: formData.get("oic") as string,
      justification: formData.get("justification") as string,
      user_signature: uploadedSignature || undefined,
      read: false,
    };

    const nextDb = {
      ...database,
      submitted: (database.submitted || 0) + 1,
      applications: [...(database.applications || []), application],
    };
    persistDatabase(nextDb);
    alert("Nomination submitted successfully!");
    form.reset();
    setUploadedSignature(null);
    setActiveSection("trainings-main");
  };

  const getSectionTitle = (section: ContentSection) => {
    const titles: Record<ContentSection, string> = {
      "trainings-main": "Dashboard",
      "trainings-interventions": "L&D Interventions",
      "trainings-request": "Request Training",
      "nomination-form": "Nomination Form",
      "comp-intro": "Competency Introduction",
      "comp-form": "Job Analysis Form",
      "csc-main": "CSC Exam Guides",
      "csc-tips": "CSC Tips",
      "csc-reviewers": "CSC Reviewers",
      "csc-numerical": "Numerical Reasoning",
      "csc-grammar": "Grammar & Comprehension",
      "csc-general": "General Info & Constitution",
      reports: "Reports",
      "reports-admin-finance": "Admin & Finance",
      "report-cash": "Cash Division Report",
      notifications: "Notifications",
      logout: "Logout",
    };
    return titles[section] || "Dashboard";
  };

  const hideHeader = activeSection === "trainings-interventions" || activeSection === "csc-main";

  return (
    <div className={`min-h-screen xl:flex w-full bg-gray-50 text-gray-900 dark:bg-gray-900 ${showSelfPacedPortal ? "hidden" : ""}`}>
      <aside
        className={`fixed mt-16 lg:mt-0 top-0 px-5 left-0 bg-gradient-to-b from-white via-blue-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 dark:border-gray-700 border-gray-200 h-screen transition-all duration-300 ease-in-out z-50 border-r ${
          isSidebarExpanded ? "w-[290px]" : "w-[90px]"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="py-8 flex justify-start items-center gap-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png"
            className="w-8 h-8"
            alt="Logo"
          />
          {isSidebarExpanded && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">DOTr-HRDD</span>
          )}
        </div>

        <nav className="mb-6">
          <ul className="flex flex-col gap-2">
            <li>
              <button
                onClick={() => handleSectionChange("trainings-main")}
                className={`menu-item ${activeSection === "trainings-main" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                {isSidebarExpanded && <span>Dashboard</span>}
              </button>
            </li>

            <li className="group">
              <button
                onClick={() => handleSubmenuToggle("trainings")}
                className="menu-item text-gray-600 dark:text-gray-400 w-full justify-between"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {isSidebarExpanded && <span>Trainings</span>}
                </div>
                {isSidebarExpanded && (
                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === "trainings" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {isSidebarExpanded && activeSubmenu === "trainings" && (
                <ul className="pl-6 mt-1 flex flex-col gap-1">
                  <li>
                    <button
                      onClick={() => handleSectionChange("trainings-interventions")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSection === "trainings-interventions" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                      L&D Interventions
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleSectionChange("trainings-request")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSection === "trainings-request" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                      Request for Training
                    </button>
                  </li>
                </ul>
              )}
            </li>

            <li className="group">
              <button
                onClick={() => handleSubmenuToggle("competency")}
                className="menu-item text-gray-600 dark:text-gray-400 w-full justify-between"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                  </svg>
                  {isSidebarExpanded && <span>Competency</span>}
                </div>
                {isSidebarExpanded && (
                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === "competency" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {isSidebarExpanded && activeSubmenu === "competency" && (
                <ul className="pl-6 mt-1 flex flex-col gap-1">
                  <li>
                    <button
                      onClick={() => handleSectionChange("comp-intro")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSection === "comp-intro" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                      Introduction
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleSectionChange("comp-form")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSection === "comp-form" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                      Job Analysis Form
                    </button>
                  </li>
                </ul>
              )}
            </li>

            <li className="group">
              <button
                onClick={() => handleSubmenuToggle("csc")}
                className="menu-item text-gray-600 dark:text-gray-400 w-full justify-between"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {isSidebarExpanded && <span>CSC Exam Guides</span>}
                </div>
                {isSidebarExpanded && (
                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === "csc" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {isSidebarExpanded && activeSubmenu === "csc" && (
                <ul className="pl-6 mt-1 flex flex-col gap-1">
                  <li>
                    <button
                      onClick={() => handleSectionChange("csc-tips")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSection === "csc-tips" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                      Helpful Tips
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleSectionChange("csc-reviewers")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSection === "csc-reviewers" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                      Reviewers
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleSectionChange("csc-numerical")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSection === "csc-numerical" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                      Numerical Reasoning
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleSectionChange("csc-grammar")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSection === "csc-grammar" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                      Grammar and Comprehension
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleSectionChange("csc-general")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSection === "csc-general" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                      General Info & Constitution
                    </button>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <button
                onClick={() => handleSectionChange("reports")}
                className={`menu-item ${activeSection === "reports" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isSidebarExpanded && <span>Reports</span>}
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto mb-10 text-center">
          <p className="text-gray-500 text-xs dark:text-gray-400">
            © 2024 DOTr-HRDD Portal
          </p>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? "lg:ml-[290px]" : "lg:ml-[90px]"}`}
      >
        <header
          className={`sticky top-0 flex w-full bg-gradient-to-r from-white via-blue-50 to-white border-b border-gray-200 z-30 h-16 sm:h-20 dark:bg-gradient-to-r dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 dark:border-gray-700 transition-colors ${hideHeader ? "hidden" : ""}`}
        >
          <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6">
            <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
              <button
                onClick={handleToggleSidebar}
                className="items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg z-30 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <div className="lg:hidden font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png"
                  className="w-8 h-8"
                  alt="Logo"
                />
                DOTr-HRDD
              </div>

              <div className="hidden lg:block ml-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {getSectionTitle(activeSection)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Welcome back, {username}!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end w-full gap-4 px-5 py-4 lg:px-0">
              <div className="hidden sm:flex flex-col items-end mr-2 border-r border-gray-200 dark:border-gray-700 pr-4">
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  {formatClock(clock)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatHeaderDate(clock)}
                </span>
              </div>

              <button
                onClick={handleThemeToggle}
                className="flex items-center justify-center w-11 h-11 text-gray-500 bg-white border border-gray-200 rounded-full hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                {isDark ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotifOpen((v) => !v);
                    setIsUserMenuOpen(false);
                  }}
                  className="relative flex items-center justify-center w-11 h-11 text-gray-500 bg-white border border-gray-200 rounded-full hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse border-2 border-white dark:border-gray-900" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-800 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <span className="font-bold text-gray-800 dark:text-white">Notifications</span>
                      <button className="text-xs text-blue-600 hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No notifications yet.</div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${notif.isUnread ? "bg-blue-50/40 dark:bg-gray-700/80" : ""}`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate pr-2">
                                {notif.title}
                              </h4>
                              {notif.isUnread && (
                                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Status: <span className="font-bold">{notif.status}</span>
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserMenuOpen((v) => !v);
                    setIsNotifOpen(false);
                  }}
                  className="flex items-center text-gray-700 dark:text-gray-400 ml-2"
                >
                  <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-blue-100 text-blue-600 border border-blue-200 dark:border-blue-800 dark:bg-blue-900/30 flex items-center justify-center font-bold">
                    {getInitials(username)}
                  </span>
                  <span className="block mr-1 font-medium text-sm hidden sm:block">{username}</span>
                  <svg className="stroke-gray-500 dark:stroke-gray-400" width="18" height="20" viewBox="0 0 18 20" fill="none">
                    <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-[17px] w-[260px] rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-800 z-50">
                    <div>
                      <span className="block font-medium text-gray-700 text-sm dark:text-gray-200">User Profile</span>
                      <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Employee</span>
                    </div>
                    <ul className="flex flex-col gap-1 pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full gap-3 px-3 py-2 mt-3 font-medium text-red-600 rounded-lg text-sm hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-0 lg:p-4 mx-auto w-full max-w-screen-2xl flex-1 overflow-y-auto">
          {activeSection === "trainings-main" && (
            <div className="w-full px-4 lg:px-8 py-8 lg:py-12 max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-blue-900 dark:text-blue-400 mb-12 tracking-tight">
                WHAT DO YOU WISH TO LEARN?
              </h1>

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-blue-100 dark:border-gray-700 mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-8">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-4">
                      <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xl font-bold">01</span>
                      CITIZEN&apos;S CHARTER (CC)
                    </h2>
                    <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed text-justify">
                      The crafting of the Citizen&apos;s Charter, in accordance with Republic Act 11032 and its Implementing Rules and Regulations (IRR), marks a significant milestone in the pursuit of good governance and public service excellence.
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-col justify-center gap-4">
                    <div className="text-sm font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-2">Available Training</div>
                    <button className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-800 dark:text-white text-lg group-hover:text-blue-700 dark:group-hover:text-blue-300">Service Excellence</span>
                        <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">A Guide to RA 11032 Citizen&apos;s Charter</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-emerald-50 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-4">
                    <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-lg font-bold">02</span>
                    CORE COMPETENCIES
                  </h2>
                  <p className="text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Core Competencies are characteristics that enable the organization to achieve its goals.
                  </p>
                  <div className="space-y-3">
                    {["Nationalism Through Service Excellence", "Customer/Public Service", "Gender Sensitivity"].map((topic) => (
                      <button key={topic} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700 text-left hover:bg-emerald-50 dark:hover:border-emerald-500 cursor-pointer group text-emerald-600 dark:text-emerald-400">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-gray-200 text-sm">{topic}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-amber-50 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-4">
                    <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center text-lg font-bold">03</span>
                    THE CREED OF GOOD GOVERNANCE
                  </h2>
                  <p className="text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Good governance is taken into the transactions and methods of decision-making.
                  </p>
                  <div className="space-y-3">
                    {["Effective Communication", "Contingency Planning", "Rational & Data-Driven Decision Making", "Workplace Professionalism", "Proactive & Multi-Pronged Approach"].map((topic) => (
                      <button key={topic} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700 text-left hover:bg-amber-50 dark:hover:border-amber-500 cursor-pointer group text-amber-600 dark:text-amber-400">
                        <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-gray-200 text-xs">{topic}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "trainings-interventions" && (
            <div className="w-full px-6 py-12 md:py-16">
              <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 dark:text-blue-400 mb-6 tracking-tight uppercase">
                  Learning and Development Programs
                </h1>
                <p className="text-lg md:text-xl text-slate-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed text-justify">
                  The Learning and Development (L&D) Programs at the DOTr will be the entry point for bridging the skills gaps of every workplace and employee.
                </p>
              </div>

              <div className="w-full px-6 pb-16 mt-12">
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {["First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter"].map((quarter, idx) => {
                      const colors = [
                        { bg: "from-blue-900 to-blue-950", glow: "#4facfe" },
                        { bg: "from-purple-900 to-purple-950", glow: "#a855f7" },
                        { bg: "from-emerald-900 to-emerald-950", glow: "#10b981" },
                        { bg: "from-amber-900 to-amber-950", glow: "#f59e0b" },
                      ];
                      return (
                        <button
                          key={quarter}
                          onClick={() => handleOpenModal(quarter)}
                          className="relative rounded-3xl p-8 cursor-pointer overflow-hidden transition-transform hover:scale-[1.02] hover:-translate-y-2"
                          style={{ background: `linear-gradient(145deg, ${colors[idx].bg.includes("blue") ? "#1e3a5f" : colors[idx].bg.includes("purple") ? "#2d1b4e" : colors[idx].bg.includes("emerald") ? "#1a3c34" : "#4a2c1a"}, ${colors[idx].bg.includes("blue") ? "#0d1b2a" : colors[idx].bg.includes("purple") ? "#1a0a2e" : colors[idx].bg.includes("emerald") ? "#0d1f1a" : "#2d1810"})`, boxShadow: `0 10px 30px -5px rgba(0,0,0,0.3)` }}
                        >
                          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ background: colors[idx].glow }} />
                          <div className="relative z-10">
                            <div className="flex items-center justify-between">
                              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{quarter}</h2>
                              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors[idx].glow} 0%, ${colors[idx].glow}cc 100%)` }}>
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "nomination-form" && (
            <div className="w-full px-4 lg:px-8 py-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-white via-blue-50 to-white dark:bg-gradient-to-br dark:from-slate-800 dark:via-gray-800 dark:to-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 p-8 text-white shadow-lg">
                  <h2 className="text-3xl font-bold mb-2">Nomination Form</h2>
                  <p className="opacity-90">Please fill out all required fields to register for the training.</p>
                </div>

                <form onSubmit={handleSubmitNomination} className="p-8 space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-gray-700 pb-2 mb-4">I. Training/Program Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Title of Training/Course</label>
                        <input type="text" name="title" className="w-full bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg px-4 py-2 text-slate-600 dark:text-gray-300" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Date of Training/Course</label>
                        <input type="text" name="date_course" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Date of Filing</label>
                        <input type="date" name="date_filing" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Type of Competency</label>
                        <div className="space-y-2 dark:text-gray-300">
                          <label className="flex items-center gap-2"><input type="radio" name="competency" value="core" className="text-blue-600" /> Core Competency</label>
                          <label className="flex items-center gap-2"><input type="radio" name="competency" value="leadership" className="text-blue-600" /> Leadership Competency</label>
                          <label className="flex items-center gap-2"><input type="radio" name="competency" value="functional" className="text-blue-600" /> Functional Competency</label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Venue</label>
                        <textarea name="venue" rows={3} className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-gray-700 pb-2 mb-4">II. Participant&apos;s Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">ID Number</label><input type="text" name="id_num" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" /></div>
                      <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Email Address</label><input type="email" name="email" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" /></div>
                      <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Position Title</label><input type="text" name="position" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" /></div>
                      <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Immediate Supervisor</label><input type="text" name="supervisor" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" /></div>
                      <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Date Hired</label><input type="date" name="date_hired" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" /></div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Status of Employment</label>
                        <select name="emp_status" className="w-full border border-slate-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-transparent dark:bg-gray-800 dark:text-white">
                          <option value="">Select Status</option>
                          {EMPLOYMENT_STATUS.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Salary Grade</label>
                        <select name="sg" className="w-full border border-slate-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-transparent dark:bg-gray-800 dark:text-white">
                          <option value="">Select SG</option>
                          {SALARY_GRADES.map((sg) => (
                            <option key={sg.value} value={sg.value}>{sg.label}</option>
                          ))}
                        </select>
                      </div>
                      <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Yrs./Months in DOTr Service</label><input type="text" name="service" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" /></div>
                      <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Contact/Viber Number</label><input type="text" name="contact" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" /></div>
                      <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Gender (Optional)</label><input type="text" name="gender" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" /></div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Office/Unit Head</label>
                        <select name="office" className="w-full border border-slate-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-transparent dark:bg-gray-800 dark:text-white">
                          <option value="">Select Office</option>
                          {OFFICES.map((office) => (
                            <option key={office} value={office}>{office}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Name, Position and Office of OIC (for SG 24 and up)</label>
                        <input type="text" name="oic" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-gray-700 pb-2 mb-4">III. Justification</h3>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Justification of Nominee&apos;s Attendance</label>
                    <textarea name="justification" rows={4} className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-gray-700 pb-2 mb-4">IV. Signature Attachment</h3>
                    <div className="border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-700/50">
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e)} className="hidden" id="signature-upload" />
                      <label htmlFor="signature-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                            <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-lg">Click to upload</span>
                            <span className="text-slate-500 dark:text-gray-400 text-lg">or drag and drop</span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium tracking-wide">JPG or PNG (MAX. 10MB)</p>
                        </div>
                      </label>
                    </div>
                    {uploadedSignature && (
                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">Signature uploaded successfully!</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-gray-700">
                    <button type="button" onClick={() => handleSectionChange("trainings-main")} className="px-6 py-3 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800">Cancel</button>
                    <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">Submit Nomination</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeSection === "comp-intro" && (
            <div className="w-full max-w-5xl mx-auto p-8">
              <div className="bg-gradient-to-br from-white via-blue-50 to-white dark:bg-gradient-to-br dark:from-slate-800 dark:via-gray-800 dark:to-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-gray-700">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4 text-xl flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                  Competency Introduction
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                  <iframe
                    src="https://www.canva.com/design/DAG4b-Sm0Og/b791BUQ43v-qLEyKJJVVfw/view?embed"
                    allowFullScreen
                    className="w-full h-full"
                    title="Competency Introduction"
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-4 italic">
                  Review the presentation above to understand the core competencies essential for your role.
                </p>
              </div>
            </div>
          )}

          {activeSection === "comp-form" && (
            <div className="w-full max-w-7xl mx-auto p-8">
              <div className="bg-gradient-to-br from-white via-blue-50 to-white dark:bg-gradient-to-br dark:from-slate-800 dark:via-gray-800 dark:to-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 p-6 text-white shadow-lg">
                  <h2 className="text-2xl font-bold mb-1">Job Analysis Form</h2>
                  <p className="opacity-90 text-sm">Fill out the details below to generate your Job Analysis document.</p>
                </div>

                <form className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input type="text" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Position Title</label>
                      <input type="text" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Office/Service/Division</label>
                      <select className="w-full border border-slate-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-transparent dark:bg-gray-800 dark:text-white">
                        <option value="">Select Office</option>
                        {OFFICES.map((office) => (
                          <option key={office} value={office}>{office}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Section/Project/Unit</label>
                      <input type="text" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Alternate Position</label>
                      <input type="text" className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Job Purpose</label>
                    <textarea rows={2} className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Main Duties and Responsibilities</label>
                    <textarea rows={3} className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Tools and Equipment</label>
                    <textarea rows={2} className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Challenges and Critical Issues</label>
                    <textarea rows={2} className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Additional Comments</label>
                    <textarea rows={2} className="w-full border border-slate-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg px-4 py-2" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-gray-700 pb-2 mb-4 mt-6">Signature Attachment</h3>
                    <div className="border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-700/50">
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="hidden" id="ja-signature-upload" />
                      <label htmlFor="ja-signature-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                            <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline text-lg">Click to upload</span>
                            <span className="text-slate-500 dark:text-gray-400 text-lg">or drag and drop</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-gray-700">
                    <button type="button" className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                      Generate and Submit Job Analysis PDF
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeSection === "csc-main" && (
            <div className="w-full px-4 lg:px-8 py-12 max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 dark:text-blue-400 mb-6 tracking-tight">
                  CIVIL SERVICE COMMISSION<br />
                  <span className="text-blue-600 dark:text-cyan-400">EXAMINATION STUDY GUIDES</span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto rounded-full" />
              </div>

              <div className="max-w-5xl mx-auto space-y-10">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-gray-700">
                  <p className="text-lg text-slate-700 dark:text-gray-300 leading-relaxed text-justify mb-6">
                    Managed by the Civil Service Commission (CSC), the Civil Service Examination is your gateway should you wish to be a part of the working force to either the government agencies or the civil service.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-l-4 border-blue-500 dark:border-blue-500">
                    <p className="text-lg text-slate-700 dark:text-gray-300 italic">
                      &quot;However, please take note that these materials are not accredited by the CSC nor any review center for the purpose of offering and holding review classes to prospective career service examinees.&quot;
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 dark:text-gray-400 text-sm">Select a topic from the menu to access downloadable resources.</p>
                </div>
              </div>
            </div>
          )}

          {["csc-tips", "csc-reviewers", "csc-numerical", "csc-grammar", "csc-general"].includes(activeSection) && (
            <div className="w-full max-w-5xl mx-auto p-8">
              <div className="bg-gradient-to-br from-white via-blue-50 to-white dark:bg-gradient-to-br dark:from-slate-800 dark:via-gray-800 dark:to-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-slate-800 dark:text-white text-xl mb-6 flex items-center gap-2">
                  <span className={`w-1 h-6 bg-gradient-to-b ${activeSection.includes("tips") ? "from-blue-500 to-blue-600" : activeSection.includes("reviewers") ? "from-purple-500 to-purple-600" : activeSection.includes("numerical") ? "from-emerald-500 to-emerald-600" : activeSection.includes("grammar") ? "from-amber-500 to-amber-600" : "from-red-500 to-red-600"} rounded-full`}></span>
                  {getSectionTitle(activeSection)}
                </h3>
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Content coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "reports" && (
            <div className="w-full max-w-7xl mx-auto p-8">
              <div className="bg-gradient-to-br from-white via-blue-50 to-white dark:bg-gradient-to-br dark:from-slate-800 dark:via-gray-800 dark:to-slate-800 rounded-2xl p-8 shadow-lg border border-slate-100 dark:border-gray-700">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-6 text-2xl flex items-center gap-2">
                  <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                  Department Reports
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-8">
                  Click on a specific office or department below to view their reports.
                </p>
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Reports visualization coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "trainings-request" && (
            <div className="w-full max-w-5xl mx-auto p-8">
              <div className="bg-gradient-to-br from-white via-blue-50 to-white dark:bg-gradient-to-br dark:from-slate-800 dark:via-gray-800 dark:to-slate-800 rounded-2xl p-8 shadow-lg border border-slate-100 dark:border-gray-700">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-6 text-2xl flex items-center gap-2">
                  <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                  Request for Training
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-8">
                  Submit your training request through the nomination form.
                </p>
                <button
                  onClick={() => handleSectionChange("nomination-form")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                >
                  Go to Nomination Form
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {expandedTrainings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0, 0, 0, 0.85)" }}
          onClick={() => setExpandedTrainings(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedTrainings(null)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-all"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!activeTrainingType ? (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{expandedTrainings}</h2>
                  <p className="text-xl text-gray-300">Training Programs</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(TRAINING_CATALOG).map(([type]) => {
                    const colors = TRAINING_COLORS[type as keyof typeof TRAINING_COLORS];
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          if (type === "self-paced") {
                            setExpandedTrainings(null);
                            setShowSelfPacedPortal(true);
                          } else {
                            handleSelectTrainingType(type);
                          }
                        }}
                        className="relative rounded-2xl p-8 text-left transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                        style={{ background: colors.gradient, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.5)" }}
                      >
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {type.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-")}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {type === "in-house" && "Collaborative learning within your organization"}
                          {type === "out-of-house" && "External workshops and seminars"}
                          {type === "self-paced" && "Learn on your schedule with curated courses"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setActiveTrainingType(null)}
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Trainings
                </button>

                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {activeTrainingType.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-")} Training
                  </h3>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleTrainingNav("prev")}
                    disabled={activeTrainingIndex === 0}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="max-w-2xl w-full mx-8">
                    {(() => {
                      const items = TRAINING_CATALOG[activeTrainingType] || [];
                      const training = items[activeTrainingIndex];
                      if (!training) return null;
                      const colors = TRAINING_COLORS[activeTrainingType as keyof typeof TRAINING_COLORS];
                      return (
                        <div className="rounded-2xl p-8 md:p-10" style={{ background: colors.gradient, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
                          <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">{training.title}</h4>
                          <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-4 py-2 rounded-lg bg-gray-800/50" style={{ color: colors.text }}>{training.duration}</span>
                            <span className="px-4 py-2 rounded-lg bg-gray-800/50" style={{ color: colors.text }}>{training.level}</span>
                          </div>
                          <p className="text-gray-300 text-lg leading-relaxed mb-8">{training.description}</p>
                          {training.link ? (
                            <button
                              onClick={() => handleEnroll(training)}
                              className="w-full py-4 rounded-xl font-semibold text-white hover:scale-105 transition-all"
                              style={{ background: colors.button }}
                            >
                              {training.buttonText || "Start Learning"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegisterHere(training)}
                              className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg transition-all"
                            >
                              Register Here
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <button
                    onClick={() => handleTrainingNav("next")}
                    disabled={activeTrainingIndex >= (TRAINING_CATALOG[activeTrainingType]?.length || 1) - 1}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSelfPacedPortal && (
        <SelfPacedPortal onBack={() => setShowSelfPacedPortal(false)} />
      )}
    </div>
  );
}
