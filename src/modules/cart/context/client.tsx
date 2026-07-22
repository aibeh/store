"use client";

import type {Store} from "~/store/types";

import type {Cart, CartItem, Checkout, Field} from "../types";
import type {ShippingZone} from "../shipping";

import {useState, useMemo, useCallback, useContext, createContext, useEffect} from "react";

import {parseCurrency} from "~/currency/utils";

import {Button} from "@/components/ui/button";

import CartDrawer from "../components/CartDrawer";
import {getCartMessage, getCartTotal} from "../utils";

interface Context {
  state: {
    cart: Cart;
    checkout: Checkout;
    subtotal: string;
    total: string;
    totalAmount: number;
    shipping: ShippingZone | null;
    quantity: number;
    message: string;
  };
  actions: {
    addItem: (id: string, value: CartItem) => void;
    removeItem: (id: string) => void;
    updateItem: (id: string, value: CartItem) => void;
    updateField: (id: string, value: string) => void;
    updateShipping: (zone: ShippingZone | null) => void;
    openCart: () => void;
  };
}

const CartContext = createContext({} as Context);

function CartProviderClient({
  fields,
  children,
  store,
}: {
  fields: Field[];
  children: React.ReactNode;
  store: Store;
}) {
  const [checkout, setCheckout] = useState<Checkout>(() => new Map());
  const [cart, setCart] = useState<Cart>(() => new Map());
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [shipping, setShipping] = useState<ShippingZone | null>(null);
  const subtotal = useMemo(() => parseCurrency(getCartTotal(cart)), [cart]);
  const totalAmount = useMemo(
    () => getCartTotal(cart) + (shipping?.price || 0),
    [cart, shipping],
  );
  const total = useMemo(() => parseCurrency(totalAmount), [totalAmount]);
  const quantity = useMemo(
    () => Array.from(cart.values()).reduce((acc, item) => acc + item.quantity, 0),
    [cart],
  );
  const message = useMemo(() => getCartMessage(cart, checkout, shipping), [cart, checkout, shipping]);

  useEffect(() => {
    if (!cart.size) {
      setShipping(null);
    }
  }, [cart.size]);

  const addItem = useCallback((id: string, value: CartItem) => {
    setCart((cart) => {
      const newCart = new Map(cart);

      newCart.set(id, value);

      return newCart;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((cart) => {
      const newCart = new Map(cart);

      newCart.delete(id);

      return newCart;
    });
  }, []);

  const updateItem = useCallback((id: string, item: CartItem) => {
    setCart((cart) => {
      const newCart = new Map(cart);

      newCart.set(id, item);

      return newCart;
    });
  }, []);

  const updateField = useCallback(
    (id: string, value: string) => {
      checkout.set(id, value);

      setCheckout(new Map(checkout));
    },
    [checkout],
  );

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const updateShipping = useCallback((zone: ShippingZone | null) => {
    setShipping(zone);
  }, []);

  const state = useMemo(
    () => ({checkout, cart, subtotal, total, totalAmount, shipping, quantity, message}),
    [checkout, cart, subtotal, total, totalAmount, shipping, quantity, message],
  );
  const actions = useMemo(
    () => ({
      removeItem,
      updateItem,
      addItem,
      updateField,
      updateShipping,
      openCart,
    }),
    [removeItem, updateItem, addItem, updateField, updateShipping, openCart],
  );

  return (
    <CartContext.Provider value={{state, actions}}>
      <>
        {children}
        {/* Cart button */}
        {Boolean(quantity) && (
          <div className="sticky bottom-0 flex content-center items-center pb-4 sm:m-auto">
            <Button
              aria-label="Ver pedido"
              className="m-auto w-full px-4 shadow-lg sm:w-fit"
              data-testid="show-cart"
              size="lg"
              variant="brand"
              onClick={openCart}
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <p className="leading-6">Ver pedido</p>
                  <p className="rounded-sm bg-black/25 px-2 py-1 text-xs font-semibold text-white/90">
                    {quantity} item
                  </p>
                </div>
                <p className="leading-6">{total}</p>
              </div>
            </Button>
          </div>
        )}
        {/* Cart Drawer */}
        {Boolean(isCartOpen) && (
          <CartDrawer
            fields={fields}
            store={store}
            onClose={() => {
              setIsCartOpen(false);
            }}
          />
        )}
      </>
    </CartContext.Provider>
  );
}

export function useCart(): [Context["state"], Context["actions"]] {
  const {state, actions} = useContext(CartContext);

  return [state, actions];
}

export default CartProviderClient;
