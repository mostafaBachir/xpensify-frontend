// src/app/dashboard/page.jsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function DashboardPage() {
  const [file, setFile] = useState(null);
  const [expenses, setExpenses] = useState([
    {
      amount: 29.99,
      description: "Restaurant",
      date: "2025-03-20",
      category: "Alimentation",
    },
    {
      amount: 15.5,
      description: "Transport métro",
      date: "2025-03-21",
      category: "Transport",
    },
  ]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

  };

  return (
    <div className="container py-10 space-y-10">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Uploader un ticket de caisse</h2>
        <form className="flex flex-col sm:flex-row items-center gap-4">
          <Label htmlFor="file" className="w-full sm:w-auto">Ticket photo :</Label>
          <Input id="file" type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
          <Button type="submit" disabled={!file}>Analyser</Button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Historique des dépenses</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Montant</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Catégorie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => (
              <TableRow key={index}>
                <TableCell>{expense.amount.toFixed(2)} €</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
