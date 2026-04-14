"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/ui";
import type { UserRole } from "@/types/auth";
import { DEMO_CREDENTIALS, ROLE_LABELS } from "@/lib/auth";
import {
  UserIcon,
  UsersIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeIcon as EyeSlashIcon,
  BuildingIcon as BuildingOfficeIcon,
  ClipboardCheckIcon as DocumentCheckIcon,

  ClockIcon,
  ChevronRightIcon,
  SparklesIcon,
  FingerprintIcon as FingerPrintIcon,
  AlertTriangleIcon as ShieldExclamationIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PortalChoice = Exclude<UserRole, "admin">;

const portalIcons: Record<PortalChoice, React.ReactNode> = {
  employee: <UserIcon className="h-7 w-7" />,
  supervisor: <UsersIcon className="h-7 w-7" />,
  hrdd_admin: <BuildingOfficeIcon className="h-7 w-7" />,
  signatory: <DocumentCheckIcon className="h-7 w-7" />,
};

const portalDescriptions: Record<PortalChoice, string> = {
  employee: "Access trainings, nominations, and competency tools",
  supervisor: "Review nominations and job analysis forms",
  hrdd_admin: "Manage trainings, approvals, and master lists",
  signatory: "Review and sign nomination forms",
};

const portalFeatures: Record<PortalChoice, string[]> = {
  employee: ["Training Enrollment", "Competency Assessment", "Learning Path", "Certificates"],
  supervisor: ["Team Performance", "Nomination Review", "Job Analysis", "Approval Dashboard"],
  hrdd_admin: ["Training Management", "User Administration", "Reports & Analytics", "Master Lists"],
  signatory: ["Document Review", "Digital Signature", "Approval Workflow", "Audit Trail"],
};

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();
  const [view, setView] = useState<"portal-select" | "login">("portal-select");
  const [selectedRole, setSelectedRole] = useState<PortalChoice | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // Redirect already-authenticated users away from login
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/portal");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(username, password);
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const containerTransition = {
    duration: 0.5,
    ease: "easeOut" as const
  };

  const cardVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const cardTransition = {
    duration: 0.2,
    ease: "easeOut" as const
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait">
            {view === "portal-select" ? (
              <motion.div
                key="portal-select"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl p-8 md:p-12 border border-white/50"

              >
                {/* Header */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="inline-flex items-center justify-center mb-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-40"></div>
                      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 shadow-lg">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png"
                          alt="DOTr Logo"
                          className="h-14 w-14 object-contain brightness-0 invert"
                        />
                      </div>
                    </div>
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                    DOTr-HRDD Portal
                  </h1>
                  <p className="text-gray-600 text-lg">Learning Management System</p>
                </div>

                {/* Portal Selection */}
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Portal</h2>
                  <p className="text-gray-500">Choose the portal that matches your role</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
                  {(Object.keys(portalIcons) as PortalChoice[]).map((role, index) => (
                    <motion.button
                      key={role}
                      onClick={() => handleSelectPortal(role)}
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...cardTransition, delay: index * 0.1 }}
                      className="group relative bg-white rounded-2xl p-6 text-left shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden"


                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="relative">
                        <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md group-hover:shadow-lg transition-all">
                          {portalIcons[role]}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{ROLE_LABELS[role]}</h3>
                        <p className="text-sm text-gray-500 mb-4">{portalDescriptions[role]}</p>
                        <div className="space-y-1 mb-4">
                          {portalFeatures[role].slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center text-xs text-gray-600">
                              <ChevronRightIcon className="h-3 w-3 text-blue-500 mr-1" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Access Portal <ChevronRightIcon className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Demo Credentials - Commented out
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 p-6 border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="h-5 w-5 text-blue-600" />
                    <p className="font-semibold text-gray-700">Demo Credentials</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {DEMO_CREDENTIALS.slice(0, 4).map((cred, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/50">
                        <span className="text-sm font-medium text-gray-700">{ROLE_LABELS[cred.role]}</span>
                        <div className="text-xs text-gray-500 font-mono">
                          {cred.username} / {cred.password}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div> */}

              </motion.div>
            ) : (
              <motion.div
                key="login"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-md mx-auto rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl p-8 md:p-10 border border-white/50"

              >
                <motion.button
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView("portal-select")}
                  className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  Back to Portals
                </motion.button>

                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg mb-4"
                  >
                    {selectedRole && portalIcons[selectedRole]}
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedRole && ROLE_LABELS[selectedRole]} Access
                  </h2>
                  <p className="text-gray-500 mt-1">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      autoComplete="username"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-xl bg-red-50 border border-red-200 px-4 py-3"
                      >
                        <div className="flex items-center gap-2 text-red-700 text-sm">
                          <ShieldExclamationIcon className="h-5 w-5" />
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FingerPrintIcon className="h-5 w-5 mr-2" />
                          Sign In
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>

                {/* Security Note */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <ShieldCheckIcon className="h-4 w-4" />
                    Secure login with SSL encryption
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            © 2024 Department of Transportation - Human Resource Development Division
          </motion.p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
