"use client";

import { useState, useEffect } from "react";
import { Eye, Plus } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import Filters from "@/components/transactions/Filters";
import ExportMenu from "@/components/transactions/ExportMenu";
import TxTable from "@/components/transactions/TxTable";
import AddTxModal from "@/components/transactions/AddTxModal";
import { filterTransactions } from "@/lib/utils";

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const transactions = useAppStore((s) => s.transactions);
  const role = useAppStore((s) => s.role);
  const filters = useAppStore((s) => s.filters);
  const deleteTransaction = useAppStore((s) => s.deleteTransaction);

  const isAdmin = role === "admin";
  const filteredTransactions = filterTransactions(transactions, filters);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleRowClick = (tx) => {
    if (!isAdmin) return;
    setEditingTx(tx);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingTx(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 text-sm flex items-start gap-2" style={{ borderRadius: "6px" }}>
          <Eye size={16} />
          You are in Viewer mode. Switch to Admin mode in the sidebar to add, edit, or delete transactions.
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl text-near-black" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Transactions
        </h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <ExportMenu transactions={filteredTransactions} />
          {isAdmin && (
            <button
              onClick={handleAddClick}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 bg-near-black text-off-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
              style={{ borderRadius: "6px" }}
            >
              <Plus size={14} strokeWidth={2.5} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="border border-gray-200 p-3 sm:p-4 bg-white">
        <Filters transactions={transactions} />
        <div className="mt-4">
          <TxTable
            transactions={filteredTransactions}
            isAdmin={isAdmin}
            onDelete={deleteTransaction}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      <AddTxModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingTx={editingTx}
      />
    </div>
  );
}
