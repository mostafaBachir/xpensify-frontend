"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";

export default function ReceiptForm({
  parsed = {},
  onSave,
  onCancel,
  isEditing = true,
  currency = "CAD",
}) {
  const [merchantName, setMerchantName] = useState(parsed.merchant || "");
  const [dateTime, setDateTime] = useState(parsed.date_time || "");
  const [total, setTotal] = useState(parsed.total || 0);
  const [taxes, setTaxes] = useState(parsed.taxes || 0);
  const [editableItems, setEditableItems] = useState(parsed.items || []);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setMerchantName(parsed.merchant || "");
    setDateTime(parsed.date_time || "");
    setTotal(parsed.total || 0);
    setTaxes(parsed.taxes || 0);
    setEditableItems(parsed.items || []);
  }, [parsed]);

  const totalCalculated = useMemo(() => {
    return editableItems.reduce(
      (sum, item) => sum + (item.unit_price || 0) * (item.quantite || 1),
      0
    );
  }, [editableItems]);

  const handleChange = (i, field, value) => {
    const newItems = [...editableItems];
    newItems[i] = { ...newItems[i], [field]: value };

    if (field === "unit_price" || field === "quantite") {
      const unit = parseFloat(
        field === "unit_price" ? value : newItems[i].unit_price || 0
      );
      const qty = parseFloat(
        field === "quantite" ? value : newItems[i].quantite || 1
      );
      newItems[i].price = parseFloat((unit * qty).toFixed(2));
    }

    setEditableItems(newItems);
  };

  const handleDeleteItem = (i) => {
    const newItems = editableItems.filter((_, index) => index !== i);
    setEditableItems(newItems);
  };

  const handleAddItem = () => {
    setEditableItems([
      ...editableItems,
      { name: "", quantite: 1, unit_price: 0.0, price: 0.0, category: "" },
    ]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const updated = {
      merchant: merchantName,
      date_time: dateTime,
      taxes,
      total,
      items: editableItems,
    };
    onSave?.(updated);
  };

  return (
    <Card className="max-w-5xl mx-auto p-6">
      <CardHeader className="text-2xl font-semibold">🧾 Nouveau reçu</CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <span className="block font-medium">Marchand :</span>
            <Input
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <span className="block font-medium">Date :</span>
            <Input
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <span className="block font-medium">Photo du reçu :</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={!isEditing}
            />
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="mt-2 rounded-md max-h-48" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <span className="block font-medium">Taxes :</span>
            <Input
              type="number"
              step="0.01"
              value={taxes}
              onChange={(e) => setTaxes(parseFloat(e.target.value))}
              disabled={!isEditing}
            />
          </div>
          <div>
            <span className="block font-medium">Total HT :</span>
            <Input disabled value={(total - taxes).toFixed(2)} />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="font-semibold">Articles :</p>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              + Ajouter un article
            </Button>
          )}
        </div>

        <ul className="space-y-2">
          {editableItems.map((item, i) => (
            <li key={i} className="text-sm grid grid-cols-6 gap-2 items-center">
              <Input
                value={item.name}
                onChange={(e) => handleChange(i, "name", e.target.value)}
              />
              <Input
                type="number"
                step="0.01"
                value={item.quantite}
                onChange={(e) => handleChange(i, "quantite", parseFloat(e.target.value))}
              />
              <Input
                type="number"
                step="0.01"
                value={item.unit_price}
                onChange={(e) => handleChange(i, "unit_price", parseFloat(e.target.value))}
              />
              <span className="text-right">
                {(item.price || 0).toFixed(2)} {currency}
              </span>
              <Input
                value={item.category}
                onChange={(e) => handleChange(i, "category", e.target.value)}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteItem(i)}
              >
                🗑️
              </Button>
            </li>
          ))}
        </ul>

        <div className="text-sm bg-muted/30 p-3 rounded-md space-y-1">
          <p>
            🧮 <strong>Total calculé :</strong> {totalCalculated.toFixed(2)} {currency}
          </p>
          <p>
            📄 <strong>Total saisi (TTC) :</strong> {total.toFixed(2)} {currency}
          </p>
        </div>

        {isEditing && (
          <div className="flex justify-between">
            <Button variant="ghost" onClick={onCancel}>
              ❌ Annuler
            </Button>
            <Button onClick={handleSubmit}>
              💾 Sauvegarder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
