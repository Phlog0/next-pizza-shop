import { create } from "zustand";
import { Api } from "@/shared/services";
import { getCartDetails } from "@/lib/get-cart-details";
import type { TCartStateItem } from "@/lib/get-cart-details";
import { CreateCartItemValues } from "../services/dto";

export type CartState = {
  loading: boolean;
  error: boolean;
  totalAmount: number;

  cartItems: TCartStateItem[];
  fetchCartItems: () => Promise<void>;
  updateItemQuantity: (id: number, quantity: number) => Promise<void>;
  removeCartItem: (id: number) => Promise<void>;
  addCartItem: (values: CreateCartItemValues) => Promise<void>;
};
export const useCartStore = create<CartState>()((set, get) => ({
  loading: true,
  error: false,
  cartItems: [],
  totalAmount: 0,
  fetchCartItems: async () => {
    try {
      set({ loading: true, error: false });
      const data = await Api.cart.getCart();
      if (data) {
        set(getCartDetails(data));
      }
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
  removeCartItem: async (id) => {
    try {
      set({
        cartItems: get().cartItems.map((item) => {
          if (item.id === id) {
            return { ...item, disabled: true };
          } else {
            return { ...item, disabled: false };
          }
        }),
        loading: true,
        error: false,
      });
      const data = await Api.cart.removeCartItem(id);
      if (data) {
        set(getCartDetails(data));
      }
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
  addCartItem: async (values) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.cart.addCartItem(values);
      if (data) {
        set(getCartDetails(data));
      }
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
  updateItemQuantity: async (cartItemId: number, quantity: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.cart.updateCartItemQuantity(cartItemId, quantity);
      if (data) {
        set(getCartDetails(data));
      }
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
}));
