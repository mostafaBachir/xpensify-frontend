"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import useReceiptStore from "@/store/receiptStore"

export default function ReceiptDetailsAccordion({ receipt, index, isOpen, onToggle }) {
  const { saveReceiptToBackend } = useReceiptStore()

  if (!receipt) return null

  const parsed = receipt.parsed || receipt

  const [isEditing, setIsEditing] = useState(false)
  const [editableItems, setEditableItems] = useState(parsed.items || [])
  const [merchantName, setMerchantName] = useState(parsed.merchant || "")
  const [dateTime, setDateTime] = useState(parsed.date_time || "")
  const [total, setTotal] = useState(parsed.total || 0)

  const totalCalculated = useMemo(() => {
    return editableItems.reduce(
      (sum, item) => sum + (item.unit_price || 0) * (item.quantite || 1),
      0
    )
  }, [editableItems])

  const handleChange = (i, field, value) => {
    const newItems = [...editableItems]
    newItems[i] = { ...newItems[i], [field]: value }

    if (field === "unit_price" || field === "quantite") {
      const unit = parseFloat(field === "unit_price" ? value : newItems[i].unit_price || 0)
      const qty = parseFloat(field === "quantite" ? value : newItems[i].quantite || 1)
      newItems[i].price = parseFloat((unit * qty).toFixed(2))
    }

    setEditableItems(newItems)
  }

  const handleDeleteItem = (i) => {
    const newItems = editableItems.filter((_, index) => index !== i)
    setEditableItems(newItems)
  }

  const handleAddItem = () => {
    setEditableItems([
      ...editableItems,
      { name: "", quantite: 1, unit_price: 0.0, price: 0.0, category: "" },
    ])
  }

  const handleCancel = () => {
    setEditableItems(parsed.items || [])
    setMerchantName(parsed.merchant || "")
    setDateTime(parsed.date_time || "")
    setTotal(parsed.total || 0)
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      useReceiptStore.getState().updateReceipt(receipt.id, "merchant", merchantName)
      useReceiptStore.getState().updateReceipt(receipt.id, "date", dateTime)
      useReceiptStore.getState().updateReceipt(receipt.id, "total", total)
      useReceiptStore.getState().updateReceipt(receipt.id, "items", editableItems)

      await saveReceiptToBackend(receipt.id)
      setIsEditing(false)
    } catch (err) {
      console.error("❌ Erreur sauvegarde :", err)
    }
  }

  return (
    <Accordion type="single" collapsible value={isOpen ? `item-${index}` : undefined}>
      <AccordionItem value={`item-${index}`}>
        <AccordionTrigger onClick={() => onToggle(index)}>
          Détails du reçu de {merchantName || "Inconnu"}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="block font-medium">Marchand :</span>
                {isEditing ? (
                  <Input value={merchantName} onChange={(e) => setMerchantName(e.target.value)} />
                ) : (
                  <span>{merchantName}</span>
                )}
              </div>
              <div>
                <span className="block font-medium">Date :</span>
                {isEditing ? (
                  <Input value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                ) : (
                  <span>{dateTime}</span>
                )}
              </div>
              <div>
                <span className="block font-medium">Montant total :</span>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.01"
                    value={total}
                    onChange={(e) => setTotal(parseFloat(e.target.value))}
                  />
                ) : (
                  <span>{total.toFixed(2)} {parsed.currency || "CAD"}</span>
                )}
              </div>
            </div>

            <div className="border rounded-md p-2">
              <div className="flex justify-between items-center mb-2">
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
                    {isEditing ? (
                      <>
                        <Input value={item.name} onChange={(e) => handleChange(i, "name", e.target.value)} />
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
                          {(item.price || 0).toFixed(2)} {parsed.currency || "CAD"}
                        </span>
                        <Input value={item.category} onChange={(e) => handleChange(i, "category", e.target.value)} />
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(i)}>
                          🗑️
                        </Button>
                      </>
                    ) : (
                      <>
                        <span>{item.name}</span>
                        <span>{item.quantite}x</span>
                        <span>{item.unit_price.toFixed(2)}</span>
                        <span className="text-right col-span-2">
                          {item.price?.toFixed(2)} {parsed.currency || "CAD"}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {isEditing && (
              <div className="text-sm bg-muted/30 p-3 rounded-md">
                <p>🧮 <strong>Total calculé :</strong> {totalCalculated.toFixed(2)} {parsed.currency || "CAD"}</p>
                <p>📄 <strong>Total saisi :</strong> {total.toFixed(2)} {parsed.currency || "CAD"}</p>
                {Math.abs(totalCalculated - total) > 0.01 && (
                  <p className="text-red-500 mt-1">⚠️ Le total calculé ne correspond pas au montant saisi</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>💾 Sauvegarder</Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel}>❌ Annuler</Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  ✏️ Éditer
                </Button>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
