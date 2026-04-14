"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, useClock } from "@/lib/hooks";
import { Card, CardHeader, CardTitle, CardContent, StatCard, Badge, Button, Modal } from "@/components/ui";
import { Input, Select, Textarea } from "@/components/ui";
import {
  Shield,
  Users,
  FileText,
  Activity,
  Settings,
  UserPlus,
  Eye,
  Trash2,
  RefreshCw,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
} from "lucide-react";
import { fetchUsers, createUser, fetchAuditLogs } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";

type Section = "dashboard" | "users" | "audit-logs" | "system";

interface UserAccount {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  position_title: string;
  is_active: number;
  created_at: string;
}

interface AuditLog {
  id: number;
  full_name: string;
  action: string;
  entity_type: string;
  entity_id: number;
  old_value: string;
  new_value: string;
  ip_address: string;
  created_at: string;
}

const ROLE_OPTIONS = [
  { value: "employee", label: "Employee" },
  { value: "supervisor", label: "Supervisor" },
  { value: "hrdd_admin", label: "HRDD Admin" },
  { value: "signatory", label: "Authorized Signatory" },
  { value: "admin", label: "System Administrator" },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function AdminPortalPage() {
  const { user, logout, isLoggingOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { formatClock, formatDate } = useClock();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", full_name: "", email: "", role: "employee", position_title: "", password: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersResult, logsResult] = await Promise.all([
        fetchUsers(),
        fetchAuditLogs(undefined, 50),
      ]);
      if (usersResult.success) setUsers(usersResult.data as UserAccount[]);
      if (logsResult.success) setAuditLogs(logsResult.data as AuditLog[]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      setShowCreateUser(false);
      setNewUser({ username: "", full_name: "", email: "", role: "employee", position_title: "", password: "" });
      loadData();
    } catch (err) {
      alert("Failed to create user.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = !searchQuery || u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const activeUsers = users.filter((u) => u.is_active === 1).length;
  const roleBreakdown = ROLE_OPTIONS.map((r) => ({ label: r.label, count: users.filter((u) => u.role === r.value).length }));

  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <Activity className="h-5 w-5" /> },
    { id: "users", label: "User Management", icon: <Users className="h-5 w-5" /> },
    { id: "audit-logs", label: "Audit Logs", icon: <FileText className="h-5 w-5" /> },
    { id: "system", label: "System Config", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="portal-sidebar flex w-64 flex-col border-r">
        <div className="flex items-center gap-3 border-b border-white/40 px-5 py-5 dark:border-slate-700/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">DOTr-LMS</p>
            <p className="text-sm font-bold text-slate-800 dark:text-white">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`menu-item ${activeSection === item.id
                ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/40 p-3 dark:border-slate-700/60">
          <div className="portal-user-pill mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-xs font-bold text-white">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">System Admin</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="portal-icon-button flex-1 rounded-xl">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={logout} disabled={isLoggingOut} className="portal-icon-button flex-1 rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-900/20">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="portal-header flex items-center justify-between border-b px-6 py-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">
              {navItems.find((n) => n.id === activeSection)?.label}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate()}</p>
          </div>
          <div className="portal-time-block">
            <p className="text-lg font-bold tabular-nums text-slate-800 dark:text-white">{formatClock()}</p>
          </div>
        </header>

        <main className="portal-content flex-1 overflow-y-auto portal-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} {...fadeUp} transition={{ duration: 0.28 }}>

              {/* Dashboard */}
              {activeSection === "dashboard" && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total Users" value={users.length} note="Registered" />
                    <StatCard label="Active Users" value={activeUsers} note="Currently active" />
                    <StatCard label="Audit Events" value={auditLogs.length} note="Logged" />
                    <StatCard label="Roles" value={ROLE_OPTIONS.length} note="Defined" isHighlight />
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card variant="bordered">
                      <CardHeader>
                        <CardTitle>Role Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {roleBreakdown.map((r) => (
                          <div key={r.label} className="flex items-center gap-3">
                            <span className="w-40 text-sm text-slate-600 dark:text-slate-300">{r.label}</span>
                            <div className="flex-1 rounded-full bg-slate-100 dark:bg-slate-800 h-2 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${users.length ? (r.count / users.length) * 100 : 0}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                              />
                            </div>
                            <span className="w-6 text-right text-sm font-bold text-slate-800 dark:text-white">{r.count}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card variant="bordered">
                      <CardHeader>
                        <CardTitle>Recent Audit Events</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {auditLogs.slice(0, 5).map((log) => (
                          <div key={log.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30">
                              <Activity className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{log.action}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{log.full_name || "System"} · {log.entity_type}</p>
                            </div>
                            <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(log.created_at).toLocaleDateString()}</span>
                          </div>
                        ))}
                        {auditLogs.length === 0 && (
                          <p className="py-6 text-center text-sm text-slate-400">No audit events yet.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {navItems.slice(1).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-red-400 hover:bg-red-50 dark:border-slate-700 dark:hover:bg-red-900/20"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white text-sm">{item.label}</p>
                        </div>
                        <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* User Management */}
              {activeSection === "users" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-xs"
                    />
                    <Select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      options={[{ value: "all", label: "All Roles" }, ...ROLE_OPTIONS]}
                      className="max-w-[180px]"
                    />
                    <div className="ml-auto flex gap-2">
                      <Button variant="outline" onClick={loadData} size="sm">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                      </Button>
                      <Button onClick={() => setShowCreateUser(true)} size="sm">
                        <UserPlus className="h-4 w-4" />
                        Add User
                      </Button>
                    </div>
                  </div>

                  <Card variant="bordered">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Username</th>
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Position</th>
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                              <tr><td colSpan={6} className="py-12 text-center text-slate-400">Loading...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                              <tr><td colSpan={6} className="py-12 text-center text-slate-400">No users found.</td></tr>
                            ) : filteredUsers.map((u) => (
                              <motion.tr
                                key={u.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-rose-600 text-xs font-bold text-white">
                                      {u.full_name?.charAt(0) || "?"}
                                    </div>
                                    <span className="font-medium text-slate-800 dark:text-white">{u.full_name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{u.username}</td>
                                <td className="px-4 py-3">
                                  <Badge variant={u.role === "admin" ? "danger" : u.role === "signatory" ? "info" : u.role === "hrdd_admin" ? "warning" : "default"}>
                                    {ROLE_OPTIONS.find((r) => r.value === u.role)?.label || u.role}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{u.position_title || "—"}</td>
                                <td className="px-4 py-3">
                                  <Badge variant={u.is_active ? "success" : "danger"}>
                                    {u.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Audit Logs */}
              {activeSection === "audit-logs" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Showing last {auditLogs.length} events</p>
                    <Button variant="outline" onClick={loadData} size="sm">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>

                  <Card variant="bordered">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Entity</th>
                              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">IP Address</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                              <tr><td colSpan={5} className="py-12 text-center text-slate-400">Loading...</td></tr>
                            ) : auditLogs.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-12 text-center">
                                  <Database className="mx-auto h-10 w-10 mb-3 text-slate-300" />
                                  <p className="text-slate-400">No audit events recorded yet.</p>
                                </td>
                              </tr>
                            ) : auditLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                                  {new Date(log.created_at).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white">{log.full_name || "System"}</td>
                                <td className="px-4 py-3">
                                  <Badge variant={log.action.includes("approve") ? "success" : log.action.includes("reject") || log.action.includes("disapprove") ? "danger" : "default"}>
                                    {log.action}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{log.entity_type} #{log.entity_id}</td>
                                <td className="px-4 py-3 text-xs text-slate-400">{log.ip_address || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* System Config */}
              {activeSection === "system" && (
                <div className="space-y-6">
                  <Card variant="bordered">
                    <CardHeader>
                      <CardTitle>System Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: "Application", value: "DOTr-LMS v1.0" },
                        { label: "Framework", value: "Next.js 16" },
                        { label: "Database", value: "Turso (libSQL)" },
                        { label: "Environment", value: process.env.NODE_ENV || "development" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                          <Badge variant="default">{item.value}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card variant="bordered">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                      {[
                        { label: "View All Users", icon: <Users className="h-4 w-4" />, action: () => setActiveSection("users") },
                        { label: "View Audit Trail", icon: <Activity className="h-4 w-4" />, action: () => setActiveSection("audit-logs") },
                        { label: "Refresh Data", icon: <RefreshCw className="h-4 w-4" />, action: loadData },
                        { label: "Add New User", icon: <UserPlus className="h-4 w-4" />, action: () => { setActiveSection("users"); setShowCreateUser(true); } },
                      ].map((item) => (
                        <Button key={item.label} variant="outline" onClick={item.action} className="justify-start gap-3">
                          {item.icon}
                          {item.label}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Create User Modal */}
      <Modal isOpen={showCreateUser} onClose={() => setShowCreateUser(false)} title="Create User Account" size="md">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input label="Full Name" value={newUser.full_name} onChange={(e) => setNewUser((p) => ({ ...p, full_name: e.target.value }))} required />
          <Input label="Username" value={newUser.username} onChange={(e) => setNewUser((p) => ({ ...p, username: e.target.value }))} required />
          <Input label="Email" type="email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Password" type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} required />
          <Input label="Position Title" value={newUser.position_title} onChange={(e) => setNewUser((p) => ({ ...p, position_title: e.target.value }))} />
          <Select label="Role" value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} options={ROLE_OPTIONS} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowCreateUser(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
