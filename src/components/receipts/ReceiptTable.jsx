"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import useReceiptStore from "@/store/receiptStore";

export default function ReceiptTable({ receipts, onRowClick }) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Marchand</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Articles</TableHead>
            <TableHead>Validé</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt, index) => (
            <TableRow
              key={receipt.id}
              onClick={() => onRowClick(index)}
              className="cursor-pointer hover:bg-muted/30 transition"
            >
              <TableCell>{receipt.parsed?.merchant || "--"}</TableCell>
              <TableCell>
                {receipt.parsed?.date_time
                  ? new Date(receipt.parsed.date_time).toLocaleDateString(
                      "fr-CA"
                    )
                  : "--"}
              </TableCell>
              <TableCell>
                {receipt.parsed?.total?.toFixed(2)}{" "}
                {receipt.parsed?.currency || "CAD"}
              </TableCell>
              <TableCell>{receipt.parsed?.items?.length || 0}</TableCell>
            
              <TableCell>
                {receipt.parsed?.reviewed_and_corrected ? "✅" : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
