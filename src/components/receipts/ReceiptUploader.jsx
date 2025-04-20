"use client"

import { useState } from "react"
import Image from "next/image"
import useReceiptStore from "@/store/receiptStore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { X, CheckCircle } from "lucide-react"

export default function ReceiptUploader() {
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const uploadReceipt = useReceiptStore((state) => state.uploadReceipt)
  const addReceipts = useReceiptStore((state) => state.addReceipts)

  const handleFilesSelected = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
    }))
    setPreviews((prev) => [...prev, ...mapped])

    setLoading(true)
    for (let i = 0; i < mapped.length; i++) {
      try {
        const result = await uploadReceipt(mapped[i].file)
        if (!result.exists) {
          addReceipts([result])
        }
        setPreviews((prev) => {
          const updated = [...prev]
          updated[i] = { ...updated[i], uploaded: true }
          return updated
        })
      } catch (err) {
        toast.error("Erreur lors de l'upload de " + mapped[i].file.name)
      }
    }
    setLoading(false)
  }

  const handleRemove = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild size="sm">
          <label>
            📤 Sélectionner des fichiers
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFilesSelected}
            />
          </label>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {previews.map(({ file, preview, uploaded }, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <p className="text-xs truncate w-full text-center mb-1">{file.name}</p>
            <div className="w-full aspect-square relative rounded-md overflow-hidden border shadow-sm">
              <Image src={preview} alt={file.name} fill className="object-cover" />
              <div className="absolute top-1 right-1 flex gap-1">
                {uploaded && (
                  <CheckCircle className="w-4 h-4 text-green-500 bg-white rounded-full shadow p-0.5" />
                )}
                <button
                  className="bg-white rounded-full shadow p-1 hover:bg-red-100"
                  onClick={() => handleRemove(index)}
                  aria-label="Supprimer le fichier"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">⏳ Traitement en cours...</p>}
    </div>
  )
}
