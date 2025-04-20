// src/components/layout/Navbar.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ToggleMode } from "@/components/ui/toggle-mode";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    const { isAuthenticated, checkAuth } = useAuthStore.getState()
    if (!isAuthenticated) {
      checkAuth()
    }
  }, [])

  const linkClass = (path, isPrimary = false) => {
    const active = pathname === path;
    return active
    ? isPrimary
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "text-primary font-semibold"
    : "text-muted-foreground";
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="w-full border-b bg-background sticky top-0 z-50 shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-xl pl-7 font-bold text-primary">
          Xpensify
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/">
            <Button variant="ghost" className={`text-sm ${linkClass("/")}`}>Accueil</Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" className={`text-sm ${linkClass("/contact")}`}>Contact</Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className={`text-sm ${linkClass("/dashboard")}`}>Dashboard</Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" className="text-sm">
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className={`text-sm ${linkClass("/login")}`}>Connexion</Button>
              </Link>
              <Link href="/register">
                <Button className={`text-sm ${linkClass("/register", true)}`}>Inscription</Button>
              </Link>
            </>
          )}

          <ToggleMode />
        </div>
      </div>
    </nav>
  );
}
