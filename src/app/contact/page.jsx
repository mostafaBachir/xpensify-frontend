import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Contactez-nous</h1>
          <p className="text-sm text-muted-foreground">
            Une question ? Une suggestion ? Nous sommes à votre écoute.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" type="text" placeholder="Votre nom" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Votre message..." required rows={5} />
          </div>

          <Button type="submit" className="w-full">Envoyer</Button>
        </form>
      </div>
    </div>
  );
}
