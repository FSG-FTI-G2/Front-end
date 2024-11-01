import { create } from "zustand";

/**
 * @typedef {{
 * user: UserData | null;
 * setUser: (user: UserData) => void;
 * appTitle: string;
 * setAppTitle: (title: string) => void;
 * files: DisplayedFile[];
 * setFiles: (files: DisplayedFile[]) => void;
 * setFilesStatus: (status: Record<string, string>) => void;
 * llmConfig: LLMConfigData | null;
 * setLLMConfig: (config: LLMConfigData) => void;
 * chats: ChatData[];
 * setChats: (chats: ChatData[]) => void;
 * setChatMessages: (chatId: string, messages: MessageData[]) => void;
 * reset: () => void;
 * }} GlobalState
 */

/**
 * @typedef {import('zustand').UseBoundStore<import('zustand').StoreApi<GlobalState>>} GlobalStore
 */

/**
 * @type {GlobalStore}
 */
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
  // LLM variables
  llmConfig: null,
  setLLMConfig: (config) => set({ llmConfig: config }),
  // Chat variables
  chats: [],
  setChats: (chats) => set({ chats }),
  setChatMessages: (chatId, messages) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, messages } : chat
      ),
    })),
  // Reset function
  reset: () =>
    set({
      user: null,
      appTitle: "Welcome back",
      files: [],
      llmConfig: null,
      chats: [],
    }),
}));

export default useGlobalStore;
