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
        <Image
          src="/assets/images/landing.png"
          alt="Illustration Xpensify"
          width={800}
          height={500}
          priority
          className="mt-10 rounded-xl border shadow"
        />
        <p className="mt-4 text-muted-foreground max-w-xl">
          Importez vos tickets de caisse, laissez l'IA les transformer en
          données précises, et suivez vos finances en temps réel.
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/register">
            <Button className="text-base">Créer un compte</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
