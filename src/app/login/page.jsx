// src/app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { access_token, refresh_token } = await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err.error || err.message || "Échec de la connexion");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Connexion à Xpensify</h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à votre tableau de bord
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Vous n'avez pas de compte ? {" "}
          <Link href="/register" className="text-primary underline">
            Créez-en un ici
          </Link>
        </p>
      </div>
    </div>
  );
}
