import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Subscriber {
  id: number;
  email: string;
  name?: string;
  is_active: boolean;
  subscribed_on: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  last_login: string;
  is_staff: boolean;
  avatar?: string;
  role?: string;
  preferences?: {
    theme?: "light" | "dark" | "system";
    language?: string;
    [key: string]: any;
  };
}

interface UserState {
  user?: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  newEmailConfigModalOpen: boolean;
  newEmailConfigModalId?: string;
  newSubscriberConfigModalOpen: boolean;
  subscriberConfig?: Subscriber;
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  setNewEmailConfigModalOpen: (open: boolean, id?: string) => void;
  setNewSubscriberConfigModalOpen: (
    open: boolean,
    subscriber?: Subscriber
  ) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: undefined,
      isAuthenticated: false,
      isLoading: false,
      newEmailConfigModalOpen: false,
      newEmailConfigModalId: undefined,
      newSubscriberConfigModalOpen: false,
      subscriberConfig: undefined,
      setUser: (user) => set({ user, isAuthenticated: true }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearUser: () => set({ user: null, isAuthenticated: false }),

      setLoading: (loading) => set({ isLoading: loading }),

      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),

      logout: () => set({ user: null, isAuthenticated: false }),

      setNewEmailConfigModalOpen: (open, id) =>
        set({ newEmailConfigModalOpen: open, newEmailConfigModalId: id }),
      setNewSubscriberConfigModalOpen: (open, subscriber) =>
        set({
          newSubscriberConfigModalOpen: open,
          subscriberConfig: subscriber || undefined,
        }),
    }),
    {
      name: "user-storage", // Key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Optionally specify which state to persist
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        newEmailConfigModalOpen: state.newEmailConfigModalOpen,
        newEmailConfigModalId: state.newEmailConfigModalId,
        newSubscriberConfigModalOpen: state.newSubscriberConfigModalOpen,
        subscriberConfig: state.subscriberConfig,
      }),
    }
  )
);
