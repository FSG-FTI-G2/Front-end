import { create } from "zustand";

const useGlobalStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  appTitle: "Welcome back",
  setAppTitle: (title) => set({ appTitle: title }),
}));

export default useGlobalStore;
