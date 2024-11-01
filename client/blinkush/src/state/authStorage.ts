import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage";
import { Order, User } from "types/types";

interface authStore {
    user: User | null;
    setUser: (user: User) => void;
    setCurrentOrder: (order: Order) => void;
    currentOrder: Order | null;
    logout: () => void;
}

export const useAuthStore = create<authStore>()(
    persist(
        (set, get) => ({
            user: null,
            currentOrder: null,
            setUser: (user) => set({ user }),
            setCurrentOrder: (order) => set({ currentOrder: order }),
            logout: () => {
                // mmkvStorage.removeItem('user');
                set({ user: null, currentOrder: null });
            }
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => mmkvStorage)
        }
    )
);