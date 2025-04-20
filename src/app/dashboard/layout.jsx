"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { LogOut, User, FileText, Settings, Users } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, checkAuth, me } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (user && !user.name) {
      me();
    }
  }, [user]);
  const isActive = (path) =>
    pathname === path
      ? "bg-primary/10 text-primary font-semibold"
      : "text-muted-foreground hover:bg-muted/50";

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r bg-muted/30 backdrop-blur-md space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Xpensify</h2>
        </div>

        <nav className="flex flex-col space-y-1">
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${isActive(
              "/dashboard/profile"
            )}`}
          >
            <User size={18} /> Profil
          </Link>

          <Link
            href="/dashboard/receipts"
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${isActive(
              "/dashboard/receipts"
            )}`}
          >
            <FileText size={18} /> Dépenses
          </Link>

          {user?.role === "superuser" && (
            <Link
              href="/dashboard/manage/services"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${isActive(
                "/dashboard/manage/services"
              )}`}
            >
              <Settings size={16} /> Gérer les services
            </Link>
          )}

          {user?.role === "superuser" && (
            <Link
              href="/dashboard/users"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${isActive(
                "/dashboard/users"
              )}`}
            >
              <Users size={16} /> Gérer les utilisateurs
            </Link>
          )}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
