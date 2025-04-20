'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import useReceiptStore from '@/store/receiptStore'
import { compressImage, hashFile } from '@/lib/images'
import { receiptApi } from '@/services/api'

export default function UnifiedReceiptManager() {
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)

  const {
    receipts,
    addReceipts,
    addEmptyReceipt,
    resetReceipts,
  } = useReceiptStore()

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []).slice(0, 3)
    setFiles(selected)
    setPreviews(selected.map((file) => URL.createObjectURL(file)))
  }

  const handleUpload = async () => {
    if (!files.length) return toast.error('Sélectionne au moins un fichier')

    const formData = new FormData()
    setLoading(true)

    try {
      for (const file of files) {
        const originalHash = await hashFile(file)
        const compressed = await compressImage(file)
        const optimizedHash = await hashFile(compressed)

        formData.append('files', compressed)
        formData.append('filenames', file.name)
        formData.append('original_signatures', originalHash)
        formData.append('optimized_signatures', optimizedHash)
      }

      const res = await receiptApi.post('/receipts/upload', formData)
      const results = res.data?.results

      if (!results || results.length === 0) {
        throw new Error('Aucun reçu analysé.')
      }

      addReceipts(results)
      toast.success(`${results.length} reçu(s) analysé(s) avec succès 🎉`)
      setFiles([])
      setPreviews([])
    } catch (err) {
      console.error('Erreur d\u2019upload :', err)
      toast.error("Erreur pendant l'analyse des reçus")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAll = async () => {
    if (receipts.length === 0) return toast.error('Aucun reçu à envoyer')

    const payload = receipts.map((r) => ({
      filename: r.id,
      blob_url: r.blob_url,
      summary: r.summary,
      merchant: r.editable.merchant,
      total: parseFloat(r.editable.total),
      currency: 'CAD',
      items_count: r.editable.items.length,
      user_id: r.user_id || '',
      timestamp: new Date().toISOString(),
      items: r.editable.items.map((item) => ({
        name: item.name,
        price: parseFloat(item.price),
        quantite: parseFloat(item.quantite),
        category: item.category,
      })),
    }))

    try {
      const res = await receiptApi.post('/receipts/confirm/batch', payload)
      toast.success(`✅ ${res.data?.message || 'Reçus enregistrés avec succès'}`)
      resetReceipts()
    } catch (err) {
      console.error('❌ Erreur de soumission :', err)
      toast.error('Erreur lors de la sauvegarde des reçus')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="space-y-2">
        <Label htmlFor="upload">Uploader jusqu'à 3 reçus</Label>
        <Input
          id="upload"
          name="files"
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={handleFileChange}
        />
        {previews.length > 0 && (
          <div className="flex space-x-2 mt-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt={`reçu-${i}`} className="w-28 rounded border shadow" />
            ))}
          </div>
        )}
        <Button onClick={handleUpload} disabled={loading || files.length === 0}>
          {loading ? 'Analyse en cours...' : 'Analyser les reçus'}
        </Button>
      </div>

      <div>
        <Button variant="outline" onClick={addEmptyReceipt}>
          ➕ Ajouter un reçu manuellement
        </Button>
      </div>

      {receipts.length > 0 && (
        <div className="border p-4 rounded shadow mt-4">
          <p className="font-medium mb-2">🧾 {receipts.length} reçu(s) prêt(s) à valider</p>
          <Button onClick={handleSubmitAll}>✅ Valider et enregistrer</Button>
        </div>
      )}
    </div>
  )
}
