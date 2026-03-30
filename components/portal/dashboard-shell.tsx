import Image from "next/image";
import {
  ArchiveIcon,
  BellIcon,
  DashboardIcon,
  FolderIcon,
  MenuIcon,
  MoonIcon,
  RefreshIcon,
  SearchApproveIcon,
  SignOutIcon,
  SunIcon,
} from "@/components/portal/icons";
import { getInitials } from "@/lib/portal-data";
import type {
  ActiveTab,
  FolderGroup,
  PortalApplication,
  PortalNotification,
} from "@/types/portal";

const logoSrc =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png";

interface DashboardShellProps {
  activeTab: ActiveTab;
  archiveGroups: FolderGroup[];
  dashboardGroups: FolderGroup[];
  expandedFolders: string[];
  initials: string;
  isDark: boolean;
  isMobileOpen: boolean;
  isNotifOpen: boolean;
  isSidebarExpanded: boolean;
  notifications: PortalNotification[];
  onFolderToggle: (folderId: string) => void;
  onNotificationClick: (notification: PortalNotification) => void;
  onRefresh: () => void;
  onReviewBatch: (title: string) => void;
  onShowMemo: (application: PortalApplication) => void;
  onShowNomination: (application: PortalApplication) => void;
  onSignOut: () => void;
  onTabChange: (tab: ActiveTab) => void;
  onThemeToggle: () => void;
  onToggleNotifications: () => void;
  onToggleSidebar: () => void;
  stats: {
    finalizedCount: number;
    pendingFolderCount: number;
    signingRate: number;
    totalApplications: number;
  };
  timeLabel: string;
  userName: string;
  dateLabel: string;
}

function StatCard({
  accent,
  label,
  note,
  value,
}: {
  accent: string;
  label: string;
  note?: string;
  value: string | number;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/90 p-6 shadow-[0_18px_60px_rgba(148,163,184,0.18)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85">
      <div className={`absolute -right-5 -top-5 h-28 w-28 rounded-full blur-3xl ${accent}`} />
      <p className="relative z-10 text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <h3 className="relative z-10 mt-3 font-display text-4xl font-bold text-slate-800 dark:text-white">
        {value}
      </h3>
      {note ? (
        <div className="relative z-10 mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {note}
        </div>
      ) : null}
    </div>
  );
}

function NavButton({
  active,
  compact,
  icon,
  label,
  onClick,
  suffix,
}: {
  active: boolean;
  compact: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  suffix?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
        active
          ? "border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 font-semibold text-blue-900 dark:from-blue-950/80 dark:to-slate-900 dark:text-blue-200"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white",
        compact ? "justify-center px-2" : "",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      <span className="shrink-0">{icon}</span>
      {!compact ? <span>{label}</span> : null}
      {!compact ? suffix : null}
    </button>
  );
}

function FolderPanel({
  emptyLabel,
  expandedFolders,
  folderPrefix,
  folders,
  isPending,
  onFolderToggle,
  onReviewBatch,
  onShowMemo,
  onShowNomination,
}: {
  emptyLabel: string;
  expandedFolders: string[];
  folderPrefix: string;
  folders: FolderGroup[];
  isPending: boolean;
  onFolderToggle: (folderId: string) => void;
  onReviewBatch: (title: string) => void;
  onShowMemo: (application: PortalApplication) => void;
  onShowNomination: (application: PortalApplication) => void;
}) {
  if (folders.length === 0) {
    return (
      <div className="p-10 text-center text-sm text-slate-400 dark:text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-700">
      {folders.map((folder, index) => {
        const folderId = `${folderPrefix}-${index}`;
        const isExpanded = expandedFolders.includes(folderId);

        return (
          <section key={folder.title}>
            <button
              type="button"
              onClick={() => onFolderToggle(folderId)}
              className="flex w-full items-center justify-between bg-slate-50 px-5 py-5 text-left transition hover:bg-slate-100 dark:bg-slate-800/30 dark:hover:bg-slate-800/60"
              aria-expanded={isExpanded}
            >
              <div className="flex items-center gap-3">
                <FolderIcon
                  className={`h-6 w-6 ${isPending ? "text-amber-500" : "text-emerald-500"}`}
                />
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {folder.title}
                  </h4>
                  {isPending ? (
                    <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                      PENDING
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  {folder.items.length} Nominee(s)
                </span>
                <svg
                  className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="m19 9-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded ? (
              <div className="overflow-x-auto bg-white p-2 dark:bg-slate-900/60">
                <table className="min-w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
                    <tr>
                      <th className="px-5 py-3">ID</th>
                      <th className="px-3 py-3">Employee</th>
                      <th className="px-3 py-3">Office</th>
                      <th className="px-3 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {folder.items.map((application) => (
                      <tr
                        key={application.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-3 font-mono text-xs text-slate-400 dark:text-slate-500">
                          #{`${application.id}`.slice(-4)}
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-700 dark:text-slate-100">
                          {application.name}
                        </td>
                        <td className="px-3 py-3 text-xs">{application.office}</td>
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              isPending
                                ? onShowNomination(application)
                                : onShowMemo(application)
                            }
                            className={`text-xs font-bold hover:underline ${
                              isPending
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-blue-600 dark:text-blue-400"
                            }`}
                          >
                            {isPending ? "View Form" : "View Memo"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {isPending ? (
                  <div className="px-3 pb-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onReviewBatch(folder.title)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/15 transition hover:from-blue-700 hover:to-blue-800"
                    >
                      <SearchApproveIcon className="h-5 w-5" />
                      Review & Sign Batch
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

export function DashboardShell(props: DashboardShellProps) {
  const {
    activeTab,
    archiveGroups,
    dashboardGroups,
    dateLabel,
    expandedFolders,
    initials,
    isDark,
    isMobileOpen,
    isNotifOpen,
    isSidebarExpanded,
    notifications,
    onFolderToggle,
    onNotificationClick,
    onRefresh,
    onReviewBatch,
    onShowMemo,
    onShowNomination,
    onSignOut,
    onTabChange,
    onThemeToggle,
    onToggleNotifications,
    onToggleSidebar,
    stats,
    timeLabel,
    userName,
  } = props;

  const compactSidebar = !isSidebarExpanded;
  const unreadCount = notifications.filter((notification) => notification.isUnread).length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(219,234,254,0.7)_35%,_rgba(238,244,255,0.95)_75%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.9),_rgba(2,6,23,0.95)_45%,_rgba(2,6,23,1)_80%)] dark:text-slate-100">
      {isMobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={onToggleSidebar}
        />
      ) : null}

      <aside
        className={[
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/60 bg-white/90 px-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur transition-all duration-300 dark:border-slate-700/70 dark:bg-slate-950/85",
          compactSidebar ? "w-[92px]" : "w-[290px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 py-8">
          <Image
            src={logoSrc}
            alt="DOTr logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
            unoptimized={false}
          />
          {!compactSidebar ? (
            <div>
              <span className="block text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                DOTr HRDD
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                Authorized Signatory
              </span>
            </div>
          ) : null}
        </div>

        <div className="portal-scrollbar flex-1 overflow-y-auto pb-6">
          <p
            className={`mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 ${
              compactSidebar ? "text-center" : ""
            }`}
          >
            {!compactSidebar ? "Menu" : "•"}
          </p>

          <div className="space-y-2">
            <NavButton
              active={activeTab === "dashboard"}
              compact={compactSidebar}
              icon={<DashboardIcon className="h-5 w-5" />}
              label="Dashboard (Pending)"
              onClick={() => onTabChange("dashboard")}
              suffix={
                stats.pendingFolderCount > 0 ? (
                  <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {stats.pendingFolderCount}
                  </span>
                ) : undefined
              }
            />
            <NavButton
              active={activeTab === "archive"}
              compact={compactSidebar}
              icon={<ArchiveIcon className="h-5 w-5" />}
              label="Signed Archive"
              onClick={() => onTabChange("archive")}
            />
          </div>
        </div>

        <div className="pb-8">
          <button
            type="button"
            onClick={onSignOut}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 ${
              compactSidebar ? "px-2" : ""
            }`}
          >
            <SignOutIcon className="h-4 w-4" />
            {!compactSidebar ? "Sign Out" : null}
          </button>
        </div>
      </aside>

      <div className={`flex min-h-screen flex-col transition-all duration-300 ${compactSidebar ? "lg:ml-[92px]" : "lg:ml-[290px]"}`}>
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 shadow-[0_8px_40px_rgba(148,163,184,0.15)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/75">
          <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleSidebar}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Toggle navigation"
              >
                <MenuIcon className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                  {activeTab === "dashboard" ? "Signatory Dashboard" : "Signed Memos Archive"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Human Resource Development Division
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <div className="hidden border-r border-slate-200 pr-4 text-right sm:block dark:border-slate-700">
                <div className="font-display text-sm font-bold text-slate-800 dark:text-white">
                  {timeLabel}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{dateLabel}</div>
              </div>

              <button
                type="button"
                onClick={onRefresh}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                aria-label="Refresh data"
              >
                <RefreshIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onThemeToggle}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Toggle color theme"
              >
                {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={onToggleNotifications}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-expanded={isNotifOpen}
                  aria-haspopup="dialog"
                  aria-label="Show notifications"
                >
                  <BellIcon className="h-5 w-5" />
                  {unreadCount > 0 ? (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500 dark:border-slate-900" />
                  ) : null}
                </button>

                {isNotifOpen ? (
                  <div className="portal-dropdown absolute right-0 mt-3 flex w-80 flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/90">
                      <span className="font-bold text-slate-800 dark:text-white">
                        Recent Approvals
                      </span>
                    </div>

                    <div className="portal-scrollbar max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                          <BellIcon className="mb-3 h-8 w-8 opacity-50" />
                          No items pending signature.
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            type="button"
                            key={notification.id}
                            onClick={() => onNotificationClick(notification)}
                            className={`flex w-full items-start gap-3 border-l-4 px-4 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                              notification.isUnread
                                ? "border-blue-500 bg-blue-50/50 dark:bg-slate-800/80"
                                : "border-transparent"
                            }`}
                          >
                            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-2 text-blue-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-blue-400">
                              <SearchApproveIcon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                                  {notification.title}
                                </h4>
                                {notification.isUnread ? (
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                ) : null}
                              </div>
                              <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                {notification.message}
                              </p>
                              <span className="mt-1 block text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                {notification.date}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-3 rounded-full border border-blue-200 bg-blue-50 pr-4 shadow-sm dark:border-blue-900/70 dark:bg-blue-950/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-cyan-100 font-bold text-blue-700 dark:from-blue-900 dark:to-slate-800 dark:text-blue-200">
                  {initials || getInitials(userName)}
                </span>
                <span className="hidden text-sm font-semibold text-slate-700 md:block dark:text-slate-200">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="portal-scrollbar mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-8 overflow-y-auto px-4 py-5 lg:px-8 lg:py-8">
          {activeTab === "dashboard" ? (
            <>
              <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  accent="bg-blue-100 dark:bg-blue-900/25"
                  label="Pending Folders"
                  note="Awaiting Signature"
                  value={stats.pendingFolderCount}
                />
                <StatCard
                  accent="bg-emerald-100 dark:bg-emerald-900/25"
                  label="Total Memos Signed"
                  note="Blasted to Portal"
                  value={stats.finalizedCount}
                />
                <StatCard
                  accent="bg-purple-100 dark:bg-purple-900/25"
                  label="Total Applications"
                  value={stats.totalApplications}
                />
                <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-800/20 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.3)] dark:border-slate-700/60 dark:from-slate-800 dark:to-slate-950">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Signing Rate
                  </p>
                  <h3 className="mt-3 font-display text-4xl font-bold">
                    {stats.signingRate}%
                  </h3>
                  <p className="mt-4 text-xs text-slate-400">
                    Based on signed vs total approved
                  </p>
                </div>
              </section>

              <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 shadow-[0_18px_60px_rgba(148,163,184,0.18)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85">
                <div className="border-b border-slate-100 px-6 py-6 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    Pending Memo Directives
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Grouped by training title for batch signing
                  </p>
                </div>
                <FolderPanel
                  emptyLabel="No pending records found."
                  expandedFolders={expandedFolders}
                  folderPrefix="pending-folder"
                  folders={dashboardGroups}
                  isPending
                  onFolderToggle={onFolderToggle}
                  onReviewBatch={onReviewBatch}
                  onShowMemo={onShowMemo}
                  onShowNomination={onShowNomination}
                />
              </section>
            </>
          ) : (
            <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 shadow-[0_18px_60px_rgba(148,163,184,0.18)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85">
              <div className="border-b border-slate-100 px-6 py-6 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Signed Memos Archive
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Released batches grouped by training title
                </p>
              </div>
              <FolderPanel
                emptyLabel="No archived records found."
                expandedFolders={expandedFolders}
                folderPrefix="archive-folder"
                folders={archiveGroups}
                isPending={false}
                onFolderToggle={onFolderToggle}
                onReviewBatch={onReviewBatch}
                onShowMemo={onShowMemo}
                onShowNomination={onShowNomination}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
