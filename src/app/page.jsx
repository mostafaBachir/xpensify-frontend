// src/app/page.jsx

import Image from "next/image";
import Link from "next/link";
import PricingSection from "@/components/landing/PricingSection";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 text-center bg-background">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Suivez vos dépenses sans effort avec <span className="text-primary">Xpensify</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl">
          Importez vos tickets de caisse, laissez l'IA les transformer en données précises, et suivez vos finances en temps réel.
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/register">
            <Button className="text-base">Créer un compte</Button>
          </Link>
          <Link href="#tarifs">
            <Button variant="outline" className="text-base">Voir les tarifs</Button>
          </Link>
        </div>
        <Image
          src="/xpensify-preview.svg"
          alt="Aperçu Xpensify"
          width={700}
          height={400}
          className="mt-10 rounded-xl border shadow"
        />
      </section>

      {/* Section Tarifs */}
      <div id="tarifs">
        <PricingSection />
      </div>
    </div>
  );
}
