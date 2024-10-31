import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage";
import { Product } from "@utils/dummyData";

interface CartItem {
    _id: string | number;
    item: Product;
    count: number;
} 

interface CartStore {
    cart: CartItem[];
    addItem: (item: Product) => void;
    removeItem: (itemId: string | number) => void;
    clearCart: () => void;
    getItemCount: (id: string | number) => number;
    getTotalPrice: () => number;
} 

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: [],
            addItem: (item: Product) => {
                if (item._id === undefined) {
                    console.error('The item ID is undefined');
                    return;
                }

                const currentCart = get().cart;
                const existingItemIndex = currentCart.findIndex((cartItem: CartItem) => cartItem._id === item._id);

                if (existingItemIndex >= 0) {
                    const updatedCart = [...currentCart];
                    updatedCart[existingItemIndex] = {
                        ...updatedCart[existingItemIndex],
                        count: updatedCart[existingItemIndex].count + 1
                    };
                    set({ cart: updatedCart });
                } else {
                    set({
                        cart: [...currentCart, { _id: item._id, item: item, count: 1 }]
                    });
                }
            },
            clearCart: () => set({ cart: [] }),
            removeItem: (itemId: string | number) => {
                const currentCart = get().cart;
                const existingItemIndex = currentCart.findIndex((cartItem: CartItem) => cartItem._id === itemId);
                if (existingItemIndex >= 0) {
                    const updatedCart = [...currentCart];
                    const existingItem = updatedCart[existingItemIndex];

                    if (existingItem.count > 1) {
                        updatedCart[existingItemIndex] = {
                            ...existingItem,
                            count: existingItem?.count - 1
                        };
                    } else {
                        updatedCart.splice(existingItemIndex, 1);
                    }
                    set({ cart: updatedCart });
                }
            },
            getItemCount: (id: string | number) => {
                const currentItem = get().cart.find(cartItem => cartItem._id === id);

                return currentItem ? currentItem.count : 0;
            },
            getTotalPrice: () => {
                return get().cart.reduce((total, cartItem) => total + cartItem.item.price * cartItem.count, 0);
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => mmkvStorage)
        }
    )
);