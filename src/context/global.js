import { create } from "zustand";

const useGlobalStore = create((set) => ({
  // General variables
  user: null,
  setUser: (user) => set({ user }),
  appTitle: "Welcome back",
  setAppTitle: (title) => set({ appTitle: title }),
  // Files variables
  files: [],
  setFiles: (files) => set({ files }),
  setFilesStatus: (status) =>
    set((state) => ({
      files: state.files.map((file) => ({
        ...file,
        status: status[file.fileName] || file.status,
      })),
    })),
}));

export default useGlobalStore;
