"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import MOCK_TRANSACTIONS from "@/lib/mockData";

const DEFAULT_FILTERS = {
  search: "",
  category: "all",
  type: "all",
  month: "all",
};

const useAppStore = create(
  persist(
    (set) => ({
      transactions: MOCK_TRANSACTIONS,
      role: "viewer",
      theme: "light",
      filters: { ...DEFAULT_FILTERS },
      activeMonth: null,

      setRole: (role) => set({ role }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),

      resetData: () => set({ transactions: MOCK_TRANSACTIONS }),
    }),
    {
      name: "ledger-state",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }),
      skipHydration: true,
    }
  )
);

export default useAppStore;
