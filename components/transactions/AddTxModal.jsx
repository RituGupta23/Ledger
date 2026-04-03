"use client";

import { useState, useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import useAppStore from "@/store/useAppStore";

const CATEGORIES = ["Food & Dining", "Transport", "Housing", "Entertainment", "Healthcare", "Income"];

const INITIAL_FORM = {
  merchant: "",
  amount: "",
  category: "Food & Dining",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
};

const MAX_AMOUNT = 10000000;
const LARGE_AMOUNT_WARNING = 200000;

function generateId() {
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AddTxModal({ isOpen, onClose, editingTx }) {
  const addTransaction = useAppStore((s) => s.addTransaction);
  const updateTransaction = useAppStore((s) => s.updateTransaction);
  const deleteTransaction = useAppStore((s) => s.deleteTransaction);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);

  const isEditing = Boolean(editingTx);

  useEffect(() => {
    if (isOpen) {
      setForm(editingTx
        ? { merchant: editingTx.merchant, amount: String(editingTx.amount), category: editingTx.category, type: editingTx.type, date: editingTx.date }
        : INITIAL_FORM
      );
      setErrors({});
      if (firstInputRef.current) firstInputRef.current.focus();
    }
  }, [isOpen, editingTx]);

  const handleField = (field, value) => {
    setForm((prev) => {
      if (field === "type") {
        if (value === "income") {
          return { ...prev, type: value, category: "Income" };
        }
        return {
          ...prev,
          type: value,
          category: prev.category === "Income" ? "Food & Dining" : prev.category,
        };
      }
      return { ...prev, [field]: value };
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    const merchant = form.merchant.trim();
    const amountValue = Number(form.amount);

    if (!merchant) errs.merchant = "Merchant name is required";
    else if (merchant.length > 80) errs.merchant = "Merchant name should be under 80 characters";

    if (!form.amount || isNaN(amountValue) || amountValue <= 0) errs.amount = "Enter a valid amount greater than 0";
    else if (amountValue > MAX_AMOUNT) errs.amount = `Amount cannot exceed ${MAX_AMOUNT.toLocaleString("en-IN")}`;

    if (!form.category) errs.category = "Category is required";
    if (!form.date) errs.date = "Date is required";
    else if (Number.isNaN(new Date(form.date).getTime())) errs.date = "Enter a valid date";

    if (form.type === "income" && form.category !== "Income") {
      errs.category = "Income entries must use Income category";
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const amountValue = Number(form.amount);
    if (amountValue >= LARGE_AMOUNT_WARNING) {
      const confirmed = window.confirm(
        `This is a large transaction (${amountValue.toLocaleString("en-IN")}). Do you want to continue?`
      );
      if (!confirmed) return;
    }

    const tx = {
      id: editingTx?.id ?? generateId(),
      merchant: form.merchant.trim(),
      amount: parseFloat(amountValue.toFixed(2)),
      category: form.category,
      type: form.type,
      date: form.date,
    };

    if (isEditing) {
      updateTransaction(tx.id, tx);
    } else {
      addTransaction(tx);
    }
    onClose();
  };
  
  const handleDelete = () => {
    if (editingTx?.id) {
      deleteTransaction(editingTx.id);
      onClose();
    }
  };

  const LABEL_CLASS = "block text-xs font-medium text-near-black mb-1";
  const INPUT_CLASS = [
    "w-full px-3 py-2 text-sm border bg-white text-near-black",
    "outline-none focus:border-near-black transition-colors",
  ].join(" ");
  const ERR_CLASS = "text-xs text-expense mt-0.5";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 transition-opacity duration-200"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        className={[
          "fixed z-50 bg-off-white border-l border-gray-200 flex flex-col",
          "transition-transform duration-200",
          /* Desktop: right panel | Mobile: bottom sheet */
          "top-0 right-0 bottom-0 w-full md:w-[400px]",
        ].join(" ")}
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
        role="dialog"
        aria-label={isEditing ? "Edit transaction" : "Add transaction"}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2
            className="text-base text-near-black"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-1.5 hover:bg-gray-100 rounded cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          <div>
            <label className={LABEL_CLASS} htmlFor="tx-merchant">Merchant</label>
            <input
              ref={firstInputRef}
              id="tx-merchant"
              type="text"
              value={form.merchant}
              onChange={(e) => handleField("merchant", e.target.value)}
              placeholder="e.g. Swiggy"
              className={INPUT_CLASS}
              style={{ borderRadius: "6px", borderColor: errors.merchant ? "var(--theme-expense)" : "var(--theme-border)" }}
            />
            {errors.merchant && <p className={ERR_CLASS}>{errors.merchant}</p>}
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor="tx-amount">Amount (₹)</label>
            <input
              id="tx-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => handleField("amount", e.target.value)}
              placeholder="0.00"
              className={INPUT_CLASS}
              style={{ borderRadius: "6px", borderColor: errors.amount ? "var(--theme-expense)" : "var(--theme-border)" }}
            />
            {errors.amount && <p className={ERR_CLASS}>{errors.amount}</p>}
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor="tx-category">Category</label>
            <select
              id="tx-category"
              value={form.category}
              onChange={(e) => handleField("category", e.target.value)}
              className={INPUT_CLASS + " cursor-pointer"}
              style={{ borderRadius: "6px", borderColor: errors.category ? "var(--theme-expense)" : "var(--theme-border)" }}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <p className={LABEL_CLASS}>Type</p>
            <div className="flex gap-4">
              {["expense", "income"].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer text-sm text-near-black">
                  <input
                    type="radio"
                    name="tx-type"
                    value={t}
                    checked={form.type === t}
                    onChange={(e) => handleField("type", e.target.value)}
                    className="accent-near-black"
                  />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor="tx-date">Date</label>
            <input
              id="tx-date"
              type="date"
              value={form.date}
              onChange={(e) => handleField("date", e.target.value)}
              className={INPUT_CLASS}
              style={{ borderRadius: "6px", borderColor: errors.date ? "var(--theme-expense)" : "var(--theme-border)" }}
            />
            {errors.date && <p className={ERR_CLASS}>{errors.date}</p>}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2 w-full">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-near-black text-off-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                style={{ borderRadius: "6px" }}
              >
                {isEditing ? "Save changes" : "Add transaction"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-sm text-near-black hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ borderRadius: "6px" }}
              >
                Cancel
              </button>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-expense/20 text-expense text-sm font-medium hover:bg-expense/5 transition-colors cursor-pointer"
                style={{ borderRadius: "6px" }}
              >
                <Trash2 size={16} />
                Delete Transaction
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
