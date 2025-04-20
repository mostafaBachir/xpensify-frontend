// components/receipts/ReceiptDrawerTrigger.jsx
"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ReceiptUploader from "@/components/receipts/ReceiptUploader";
import ReceiptFormAdd from "@/components/receipts/ReceiptFormAdd";
import useReceiptStore from "@/store/receiptStore";

export default function ReceiptDrawerTrigger({ onReceiptAdded }) {
  const [open, setOpen] = useState(false);
  const { pendingReceipts, removePendingReceipt } = useReceiptStore();

  const closeDrawer = () => setOpen(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button onClick={() => setOpen(true)}>+ Ajouter un reçu</Button>
      </DrawerTrigger>
      <DrawerHeader>
        <DrawerTitle ></DrawerTitle>
        <DrawerDescription  className="sr-only">
          Formulaire d'ajout de reçu
        </DrawerDescription>
      </DrawerHeader>
      <DrawerContent
        className="fixed inset-0 z-50 bg-background p-0"
        aria-labelledby="receipt-drawer-title"
        onInteractOutside={(e) => e.preventDefault()}
        aria-describedby="drawer-desc"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
           
            <Button
              variant="ghost"
              onClick={closeDrawer}
              size="icon"
              aria-label="Fermer le panneau"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <ReceiptUploader />
            {pendingReceipts.map((receipt, index) => (
              <div
                key={receipt.id || index}
                className="border rounded-md p-4 shadow-sm bg-muted/10"
              >
                <ReceiptFormAdd
                  initialData={receipt.parsed}
                  imageUrl={receipt.blob_url}
                  filename={receipt.filename}
                  onRemove={() => removePendingReceipt(index)}
                  onSuccess={() => removePendingReceipt(index)}
                />
              </div>
            ))}
            <ReceiptFormAdd onSuccess={closeDrawer} />

            
          </div>

          {/* Footer */}
          <div className="border-t text-xs text-muted-foreground px-4 py-2">
            Tu peux uploader un reçu pour analyse automatique, ou remplir
            manuellement les infos.
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
