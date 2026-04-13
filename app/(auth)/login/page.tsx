"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/ui";
import type { UserRole } from "@/types/auth";
import { DEMO_CREDENTIALS, ROLE_LABELS } from "@/lib/auth";
import { UserIcon, UsersIcon, ShieldCheckIcon, BriefcaseIcon } from "lucide-react";

type PortalChoice = UserRole;

const portalIcons: Record<PortalChoice, React.ReactNode> = {
  employee: <UserIcon className="h-6 w-6" />,
  supervisor: <UsersIcon className="h-6 w-6" />,
  hrdd_admin: <BriefcaseIcon className="h-6 w-6" />,
  signatory: <ShieldCheckIcon className="h-6 w-6" />,
};

const portalDescriptions: Record<PortalChoice, string> = {
  employee: "Access trainings, nominations, and competency tools",
  supervisor: "Review nominations and job analysis forms",
  hrdd_admin: "Manage trainings, approvals, and master lists",
  signatory: "Review and sign nomination forms",
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [view, setView] = useState<"portal-select" | "login">("portal-select");
  const [selectedRole, setSelectedRole] = useState<PortalChoice | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(username, password);
    if (result.success) {
      router.push("/portal");
    } else {
      setError(result.error || "Login failed");
    }
    setIsLoading(false);
  };

  const handleSelectPortal = (role: PortalChoice) => {
    setSelectedRole(role);
    setView("login");
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-4xl">
        {view === "portal-select" ? (
          <div className="portal-fade-up rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/20">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png"
                  alt="DOTr Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-800">
                DOTr-HRDD Portal
              </h1>
              <p className="mt-1 text-sm text-slate-500">Learning Management Portal</p>
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-slate-700">Select Your Portal</h2>
              <p className="mt-1 text-sm text-slate-500">Choose which portal you would like to access</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {(Object.keys(portalIcons) as PortalChoice[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleSelectPortal(role)}
                  className="flex items-start gap-4 rounded-2xl border-2 border-slate-200 p-5 text-left transition hover:border-blue-500 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {portalIcons[role]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{ROLE_LABELS[role]}</h3>
                    <p className="mt-1 text-sm text-slate-500">{portalDescriptions[role]}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-4">
              <p className="mb-2 text-xs font-semibold text-slate-600">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-slate-500">
                {DEMO_CREDENTIALS.slice(0, 4).map((cred) => (
                  <p key={cred.username}>
                    <span className="font-medium">{ROLE_LABELS[cred.role]}:</span> {cred.username} / {cred.password}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="portal-fade-up rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
            <button
              onClick={() => setView("portal-select")}
              className="mb-4 text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Portal Selection
            </button>

            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                {selectedRole && portalIcons[selectedRole]}
              </div>
              <h1 className="font-display text-xl font-bold text-slate-800">
                {selectedRole && ROLE_LABELS[selectedRole]}
              </h1>
              <p className="mt-1 text-sm text-slate-500">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </form>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-white/75">
          © 2024 Department of Transportation - HRDD
        </p>
      </div>
    </div>
  );
}
