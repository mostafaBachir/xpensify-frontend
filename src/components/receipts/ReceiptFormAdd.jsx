"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import useReceiptStore from "@/store/receiptStore";

export default function ReceiptFormAdd({
  initialData = {},
  imageUrl = "",
  filename = "",
  onRemove,
  onSuccess,
}) {
  const getEmptyItem = useReceiptStore((s) => s.getEmptyItem);
  const addEmptyReceipt = useReceiptStore((s) => s.addEmptyReceipt);

  const [merchant, setMerchant] = useState(initialData.merchant || "");
  const [date, setDate] = useState(initialData.date_time || "");
  const [total, setTotal] = useState(initialData.total || 0);
  const [items, setItems] = useState(
    initialData.items?.length ? initialData.items : [getEmptyItem()]
  );
  const [note, setNote] = useState("");

  const totalCalculated = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (item.unit_price || 0) * (item.quantite ?? 1),
        0
      ),
    [items]
  );

  const formatCAD = (val) =>
    new Intl.NumberFormat("fr-CA", {
      style: "currency",
      currency: "CAD",
    }).format(val);

  const updateItem = (index, field, value) => {
    const updated = [...items];
    const v =
      ["unit_price", "quantite"].includes(field) ? parseFloat(value) : value;
    updated[index][field] = v;

    if (["unit_price", "quantite"].includes(field)) {
      const u = updated[index].unit_price || 0;
      const q = updated[index].quantite ?? 1;
      updated[index].price = parseFloat((u * q).toFixed(2));
    }

    setItems(updated);
  };

  const addItem = () => setItems([...items, getEmptyItem()]);
  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    addEmptyReceipt(); // à adapter plus tard
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Aperçu image */}
      <div className="flex justify-end">
        <div className="w-48 h-48 relative rounded-md border overflow-hidden shadow-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={192}
              height={192}
              className="object-cover rounded cursor-zoom-in"
              alt="Aperçu du reçu"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-muted text-xs flex items-center justify-center">
              Image non disponible
            </div>
          )}
        </div>
      </div>

      {/* Infos principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Marchand"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Total"
          value={total}
          onChange={(e) => setTotal(parseFloat(e.target.value))}
        />
      </div>

      {/* Articles */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}-${item.unit_price}`}
            className="grid grid-cols-6 gap-2 items-center border p-2 rounded"
          >
            <Input
              placeholder="Nom"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Quantité"
              value={item.quantite}
              onChange={(e) => updateItem(index, "quantite", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Prix unitaire"
              value={item.unit_price}
              onChange={(e) => updateItem(index, "unit_price", e.target.value)}
            />
            <Input
              readOnly
              className="bg-muted"
              value={item.price?.toFixed(2) || "0.00"}
            />
            <Input
              placeholder="Catégorie"
              value={item.category}
              onChange={(e) => updateItem(index, "category", e.target.value)}
            />
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => removeItem(index)}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addItem}>
          + Ajouter un article
        </Button>
      </div>

      {/* Totaux */}
      <div className="text-sm bg-muted/30 p-3 rounded-md space-y-1">
        <p>🧮 <strong>Total calculé :</strong> {formatCAD(totalCalculated)}</p>
        <p>📄 <strong>Total saisi :</strong> {formatCAD(total)}</p>
        {Math.abs(totalCalculated - total) > 0.01 && (
          <p className="text-yellow-500">
            ⚠️ Le total calculé diffère du total saisi
          </p>
        )}
      </div>

      {/* Note */}
      <Textarea
        placeholder="Note ou commentaire (optionnel)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* Actions */}
      <div className="text-right flex justify-between items-center">
        {onRemove && (
          <Button variant="destructive" type="button" onClick={onRemove}>
            Supprimer
          </Button>
        )}
        <Button type="submit">💾 Enregistrer</Button>
      </div>
    </form>
  );
}
