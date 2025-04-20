"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import useServiceStore from "@/store/serviceStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export default function ManageServicesPage() {
  const { user } = useAuthStore();
  const { services, fetchServices, addService, deleteService } = useServiceStore();
  const [form, setForm] = useState({ name: "", url: "" });
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAdd = async () => {
    try {
      await addService(form);
      setForm({ name: "", url: "" });
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteService(selected);
      setOpen(false);
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const startEdit = (service) => {
    setForm({ name: service.name, url: service.url });
    setSelected(service.ID);
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      await useServiceStore.getState().updateService(selected, form);
      setForm({ name: "", url: "" });
      setEditMode(false);
      setSelected(null);
    } catch (err) {
      alert("Erreur lors de la modification");
    }
  };

  useEffect(() => {
    if (user?.role === "superuser") fetchServices();
  }, [user, fetchServices]);

  if (user?.role !== "superuser") return <div className="p-6">⛔ Accès refusé</div>;

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold">🔧 Gérer les services</h1>

      <div className="space-y-2">
        <Label className="text-sm">Nom du service</Label>
        <Input
          size="sm"
          placeholder="Ex: Xpensify Receipt API"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Label className="text-sm">URL du service</Label>
        <Input
          size="sm"
          placeholder="Ex: http://localhost:8002"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
        <Button className="mt-2" size="sm" onClick={editMode ? handleUpdate : handleAdd}>
          {editMode ? "💾 Mettre à jour" : "➕ Ajouter le service"}
        </Button>
      </div>

      <div className="space-y-2">
        {services.map((s) => (
          <Card key={s.ID} className="p-3 flex justify-between items-center text-sm">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.url}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => startEdit(s)}
                title="Modifier"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Supprimer"
                    onClick={() => {
                      setSelected(s.ID);
                      setOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent open={open} onOpenChange={setOpen}>
                  <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm">Êtes-vous sûr de vouloir supprimer ce service ?</p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} size="sm">
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} size="sm">
                      Supprimer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
