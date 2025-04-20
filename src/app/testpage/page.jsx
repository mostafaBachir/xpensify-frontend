"use client"

import useReceiptStore from "@/store/receiptStore"

import ReceiptForm from "@/components/receipts/ReceiptForm";

export default function TestPage() {
  const empty = useReceiptStore((s) => s.getEmptyReceipt());

  const handleSave = (data) => {
    console.log("➡️ À sauvegarder :", data);
    // Appel au store, API, ou autre
  };
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
      <ReceiptForm
        parsed={empty.parsed}
        onSave={handleSave}
        isEditing={true}
        currency={empty.parsed.currency}
      />{" "}
    </div>
  );
}
