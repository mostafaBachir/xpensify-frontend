// src/app/page.jsx

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function HomePage() {
  return (
    
    <section className="min-h-[calc(100vh-5rem)] bg-background flex flex-col items-center justify-center px-6 text-center">
   
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/images/logo.svg"
            alt="Xpensify Logo"
            width={100}
            height={100}
            className="rounded-full"
            priority
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Gérez vos dépenses <span className="text-primary">intelligemment</span>
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Xpensify transforme vos tickets de caisse en données exploitables grâce à l’IA.<br />
          Suivez vos dépenses de manière <strong>automatisée</strong>, <strong>simple</strong> et <strong>efficace</strong>.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Créer un compte</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">Se connecter</Button>
          </Link>
        </div>
    </section>
  );
}
