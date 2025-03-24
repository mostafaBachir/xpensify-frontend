// src/app/dashboard/layout.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function DashboardLayout({ children }) {
  const { user, checkAuth, me } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
    if (user) me();
  }, [user]);

  const isActive = (path) =>
    pathname === path ? "font-semibold text-primary" : "text-muted-foreground";

  return (
    <div className="flex h-screen">
      {/* Side Menu */}
      <aside className="w-64 p-4 border-r bg-muted space-y-4">
        <h2 className="text-xl font-bold text-primary">Mon espace</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard/profile" className={isActive("/dashboard/profile")}>Profil</Link>
          <Link href="/dashboard/expenses" className={isActive("/dashboard/expenses")}>Dépenses</Link>
          {user?.role === "superuser" && (
            <>
              <Link href="/dashboard/users" className={isActive("/dashboard/users")}>User Admin</Link>
              <Link href="/dashboard/services" className={isActive("/dashboard/services")}>Service Admin</Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
