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
  loadFromStorage: () => void;

  clearHistory: () => void;
};

export const useScanStore = create<Store>((set, get) => ({
  count: 1,
  productName: "",
  history: [],   // <-- start EMPTY. SSR safe.

  setCount: (n) => set({ count: n }),

  setProductName: (s) => set({ productName: s }),

  loadFromStorage: () => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem("history");
      const parsed = raw ? JSON.parse(raw) : [];
      set({ history: parsed });
    } catch {
      set({ history: [] });
    }
  },

  addToHistory: (item) =>
    set((state) => {
      const newItem = {
        ...item,
        // keep formatting HERE – fine
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

      if (typeof window !== "undefined") {
        localStorage.setItem("history", JSON.stringify(updated));
      }

      return { history: updated };
    }),

  clearHistory: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("history", "[]");
    }

    set({ history: [] });
  },
}));
