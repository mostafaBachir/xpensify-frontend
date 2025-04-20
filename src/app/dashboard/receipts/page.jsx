"use client";

import { useState, useEffect } from "react";
import useReceiptStore from "@/store/receiptStore";
import ReceiptTable from "@/components/receipts/ReceiptTable";
import ReceiptDetailsAccordion from "@/components/receipts/ReceiptDetailsAccordion";
import ReceiptImageViewer from "@/components/receipts/ReceiptImageViewer";
import ReceiptDrawerTrigger from "@/components/receipts/ReceiptDrawerTrigger";
import PaginationControls from "@/components/ui/PaginationControls";

export default function ReceiptPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { receipts, currentPage, totalCount, limit, getReceipts } =
    useReceiptStore();

  useEffect(() => {
    getReceipts(currentPage, limit);
  }, [currentPage]);
  useEffect(() => {
    getReceipts();
  }, []);

  const handleRowClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const selectedReceipt = receipts[selectedIndex];

  return (
    <div>
      <div className="flex">
        <div className="flex-1 space-y-4 pr-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Mes depenses</h2>
            <ReceiptDrawerTrigger />
          </div>

          <ReceiptTable receipts={receipts} onRowClick={handleRowClick} />

          {selectedReceipt && (
            <ReceiptDetailsAccordion
              receipt={selectedReceipt}
              index={selectedIndex}
              isOpen={selectedIndex !== null}
              onToggle={handleRowClick}
            />
            
          )}
        </div>

        <ReceiptImageViewer imageUrl={selectedReceipt?.blob_url} />
      </div>
      <div>
        <PaginationControls
          currentPage={currentPage}
          totalCount={totalCount}
          limit={limit}
          onPageChange={(newPage) => fetchReceiptsFromBackend(newPage, limit)}
        />
      </div>
    </div>
  );
}
