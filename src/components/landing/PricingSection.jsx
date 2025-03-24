"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Essentiel",
    monthly: 5,
    yearly: 49,
    features: [
      "Tickets illimités",
      "Export CSV",
      "Analyse IA (GPT-3.5)",
      "1 mois d'essai gratuit",
    ],
  },
  {
    name: "Premium",
    monthly: 10,
    yearly: 99,
    features: [
      "Toutes les fonctions Essentiel",
      "Analyse IA GPT-4",
      "Catégorisation automatique",
      "Support prioritaire",
      "1 mois d'essai gratuit",
    ],
  },
  {
    name: "Équipe",
    monthly: 20,
    yearly: 199,
    features: [
      "Jusqu'à 5 utilisateurs",
      "Rapports PDF mensuels",
      "Partage de tableaux de bord",
      "1 mois d'essai gratuit",
    ],
  },
];

export default function PricingSection() {
  const [billing, setBilling] = useState("yearly");

  return (
    <section className="container py-12 flex flex-col items-center justify-center text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Choisissez votre plan</h2>
        <p className="text-muted-foreground">Payez une fois, profitez toute l'année. <br /> Tous les plans incluent un <span className="font-semibold">mois d'essai gratuit</span>.</p>
        <div className="mt-4 inline-flex gap-2">
          <Button
            variant={billing === "monthly" ? "default" : "outline"}
            onClick={() => setBilling("monthly")}
          >
            Mensuel
          </Button>
          <Button
            variant={billing === "yearly" ? "default" : "outline"}
            onClick={() => setBilling("yearly")}
          >
            Annuel (économisez 17%)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <p className="text-3xl font-bold mt-2">
                {billing === "monthly" ? `$${plan.monthly}/mo` : `$${plan.yearly}/an`}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plan.features.map((feat) => (
                  <li key={feat} className="leading-tight">✅ {feat}</li>
                ))}
              </ul>
              <Button className="w-full mt-6">Commencer l'essai gratuit</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}