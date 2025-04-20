'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FillePresentationPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 p-4">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl border-none bg-white/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold text-pink-600">🌸 Ma Princesse 🌸</h1>
          <p className="text-gray-600 mt-2">Une petite étoile qui illumine nos vies</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-pink-300 shadow-md">
            <Image
              src="/ma_fille.jpeg"
              alt="Photo de ma fille"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          <Badge variant="secondary" className="mt-2">👶 Née le 23 décembre 2018</Badge>

          <p className="text-center text-lg text-gray-700 mt-4">
            Toujours souriante, avec des yeux qui pétillent de bonheur 🌟. 
            Elle aime les câlins, la musique douce et les histoires du soir.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
