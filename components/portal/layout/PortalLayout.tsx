"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/lib/hooks";
import { Avatar, Button } from "@/components/ui";
import {
  Menu,
  Moon,
  Sun,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface PortalLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
  subtitle?: string;
}

export function PortalLayout({ children, navItems, title, subtitle }: PortalLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsSidebarExpanded((v) => !v);
    } else {
      setIsMobileOpen((v) => !v);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(219,234,254,0.7)_35%,_rgba(238,244,255,0.95)_75%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.9),_rgba(2,6,23,0.95)_45%,_rgba(2,6,23,1)_80%)] dark:text-slate-100">
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/60 bg-white/90 px-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur transition-all duration-300 dark:border-slate-700/70 dark:bg-slate-950/85",
          isSidebarExpanded ? "w-[280px]" : "w-[90px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 py-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png"
            alt="DOTr Logo"
            className="h-8 w-8 rounded-full object-contain"
          />
          {isSidebarExpanded && (
            <div>
              <span className="block text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                DOTr HRDD
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                Learning Portal
              </span>
            </div>
          )}
        </div>

        <nav className="portal-scrollbar flex-1 overflow-y-auto pb-6">
          <p
            className={`mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 ${
              isSidebarExpanded ? "" : "text-center"
            }`}
          >
            {isSidebarExpanded ? "Menu" : "•"}
          </p>

          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
                    isActive
                      ? "border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 font-semibold text-blue-900 dark:from-blue-950/80 dark:to-slate-900 dark:text-blue-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white",
                    !isSidebarExpanded && "justify-center px-2",
                  ].join(" ")}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {isSidebarExpanded && <span>{item.label}</span>}
                  {isSidebarExpanded && item.badge && item.badge > 0 && (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="pb-8">
          <button
            type="button"
            onClick={logout}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 ${
              !isSidebarExpanded && "px-2"
            }`}
          >
            <LogOut className="h-4 w-4" />
            {isSidebarExpanded && "Sign Out"}
          </button>
        </div>
      </aside>

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          isSidebarExpanded ? "lg:ml-[280px]" : "lg:ml-[90px]"
        }`}
      >
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 shadow-[0_8px_40px_rgba(148,163,184,0.15)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/75">
          <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleSidebar}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Toggle navigation"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle || "Human Resource Development Division"}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifOpen((v) => !v);
                    setIsUserMenuOpen(false);
                  }}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-expanded={isNotifOpen}
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>

                {isNotifOpen && (
                  <div className="portal-dropdown absolute right-0 mt-3 flex w-80 flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/90">
                      <span className="font-bold text-slate-800 dark:text-white">Notifications</span>
                    </div>
                    <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500">
                      No new notifications
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen((v) => !v);
                    setIsNotifOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 pr-4 shadow-sm dark:border-blue-900/70 dark:bg-blue-950/40"
                >
                  <Avatar name={user?.name || "User"} size="sm" />
                  <span className="hidden text-sm font-semibold text-slate-700 md:block dark:text-slate-200">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="portal-dropdown absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-800">
                    <div className="border-b border-slate-200 pb-3 dark:border-slate-700">
                      <p className="font-medium text-slate-700 dark:text-slate-200">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <div className="pt-3">
                      <Button variant="danger" size="sm" onClick={logout} className="w-full">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="portal-scrollbar mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-8 overflow-y-auto px-4 py-5 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
