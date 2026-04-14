"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function PortalPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const routes: Record<string, string> = {
        employee: "/portal/employee",
        supervisor: "/portal/supervisor",
        hrdd_admin: "/portal/hrdd-admin",
        signatory: "/portal/signatory",
      };
      const route = routes[user.role];
      if (route) {
        router.push(route);
      } else {
        router.push("/login");
      }
    } else if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-500">Redirecting to your portal...</p>
      </div>
    </div>
  );
}
