import { create } from "zustand";

interface GlobalState {
  isFetched: boolean;
  setIsFetched: (value: boolean) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  isFetched: false,
  setIsFetched: (isFetched: boolean) => set({ isFetched }),
}));
