import { create } from "zustand";

const useGlobalStore = create((set) => ({
  // General variables
  user: null,
  setUser: (user) => set({ user }),
  appTitle: "Welcome back",
  setAppTitle: (title) => set({ appTitle: title }),
  // Files variables
  uploadingFiles: [],
  setUploadingFiles: (files) => set({ uploadingFiles: files }),
}));

export default useGlobalStore;
