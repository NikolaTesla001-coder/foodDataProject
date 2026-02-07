import { create } from "zustand";

type HistoryItem = {
  name: string;
  count: number;
  score: number | string;
  time: string;
};

type Store = {
  count: number;
  productName: string;
  history: HistoryItem[];

  setCount: (n: number) => void;
  setProductName: (s: string) => void;

  addToHistory: (item: HistoryItem) => void;


  clearHistory: () => void;
};

// Load from localStorage
const loadHistory = (): HistoryItem[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("history") || "[]");
};

export const useScanStore = create<Store>((set) => ({
  count: 1,
  productName: "",

  history: loadHistory(),

  setCount: (n) => set({ count: n }),

  setProductName: (s) => set({ productName: s }),

  addToHistory: (item) =>
    set((state) => {
      const newItem = {
        ...item,
        time: new Date().toLocaleString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}),
      };

      const updated = [newItem, ...state.history];

      localStorage.setItem("history", JSON.stringify(updated));

      return { history: updated };
    }),

  clearHistory: () => {
    localStorage.setItem("history", "[]");
    set({ history: [] });
  },
}));
