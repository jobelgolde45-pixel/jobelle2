import type { FormEvent } from "react";
import { UserEyeIcon } from "@/components/portal/icons";

interface LoginScreenProps {
  error: string;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUsernameChange: (value: string) => void;
  password: string;
  username: string;
}

export function LoginScreen({
  error,
  onPasswordChange,
  onSubmit,
  onUsernameChange,
  password,
  username,
}: LoginScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-10">
      <div className="w-full max-w-md">
        <div className="portal-fade-up rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/20">
              <UserEyeIcon className="h-10 w-10" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-800">
              Authorized Signatory
            </h1>
            <p className="mt-1 text-sm text-slate-500">Memo Directives Portal</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="portal-username"
              >
                Username
              </label>
              <input
                id="portal-username"
                type="text"
                value={username}
                onChange={(event) => onUsernameChange(event.target.value)}
                placeholder="cao_signatory"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="portal-password"
              >
                Password
              </label>
              <input
                id="portal-password"
                type="password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="••••••••"
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
              Secure Login
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-white/75">
          © 2024 Department of Transportation - HRDD
        </p>
      </div>
    </div>
  );
}
