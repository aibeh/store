"use client";

import type {Store} from "~/store/types";

import type {Cart, CartItem, Checkout, Coupon, Field, FuegosCoupon, FuegosGift} from "../types";
import type {ShippingZone} from "../shipping";

import {useState, useMemo, useCallback, useContext, createContext, useEffect} from "react";

import {parseCurrency} from "~/currency/utils";

import {Button} from "@/components/ui/button";

import CartDrawer from "../components/CartDrawer";
import {getCartMessage, getCartTotal, getFuegosDiscount, getPackSize} from "../utils";

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
    isStoreOpen: boolean;
    appliedCoupon: Coupon | null;
    couponError: string | null;
    couponLoading: boolean;
    fuegos: FuegosGift | null;
    weeklyMenu: string[];
  };
  actions: {
    addItem: (id: string, value: CartItem) => void;
    removeItem: (id: string) => void;
    updateItem: (id: string, value: CartItem) => void;
    updateField: (id: string, value: string) => void;
    updateShipping: (zone: ShippingZone | null) => void;
    openCart: () => void;
    applyCoupon: (code: string) => void;
    setGiftVianda: (nombre: string, cantidad: number) => void;
  };
}

const CartContext = createContext({} as Context);

function CartProviderClient({
  fields,
  children,
  store,
  coupons,
  weeklyMenu = [],
}: {
  fields: Field[];
  children: React.ReactNode;
  store: Store;
  coupons: Coupon[];
  weeklyMenu?: string[];
}) {
  const [checkout, setCheckout] = useState<Checkout>(() => new Map());
  const [cart, setCart] = useState<Cart>(() => new Map());
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [shipping, setShipping] = useState<ShippingZone | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [fuegos, setFuegos] = useState<FuegosGift | null>(null);
  const subtotal = useMemo(() => parseCurrency(getCartTotal(cart)), [cart]);
  const totalAmount = useMemo(
    () => Math.max(0, getCartTotal(cart) + (shipping?.price || 0) - getFuegosDiscount(fuegos)),
    [cart, shipping, fuegos],
  );
  const total = useMemo(() => parseCurrency(totalAmount), [totalAmount]);
  const quantity = useMemo(
    () => Array.from(cart.values()).reduce((acc, item) => acc + item.quantity, 0),
    [cart],
  );
  const message = useMemo(
    () => getCartMessage(cart, checkout, shipping, appliedCoupon, fuegos),
    [cart, checkout, shipping, appliedCoupon, fuegos],
  );
  const isStoreOpen = store.open !== "FALSE";

  useEffect(() => {
    if (!cart.size) {
      setShipping(null);
      setAppliedCoupon(null);
      setCouponError(null);
      setFuegos(null);
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

  const applyCoupon = useCallback(
    async (code: string) => {
      const trimmed = code.trim();

      setFuegos(null);

      if (!trimmed) {
        setAppliedCoupon(null);
        setCouponError(null);

        return;
      }

      const match = coupons.find(
        (coupon) => coupon.activo && coupon.codigo.toLowerCase() === trimmed.toLowerCase(),
      );

      if (!match) {
        setAppliedCoupon(null);

        // ¿Es un cupón de fueguitos? Lo validamos con la planilla (único y de un solo uso).
        setCouponLoading(true);
        try {
          const response = await fetch("/api/cupones/validar", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({codigo: trimmed}),
          });
          const data = (await response.json().catch(() => ({}))) as {cupon?: FuegosCoupon; error?: string};

          if (!response.ok || !data.cupon) {
            setCouponError(data.error || "Cupón inválido o vencido");

            return;
          }
          if (data.cupon.viandas && getPackSize(cart) === null) {
            setCouponError("Agregá un pack de viandas para usar este cupón");

            return;
          }
          setFuegos({cupon: data.cupon, viandas: {}});
          setCouponError(null);
        } catch {
          setCouponError("No pudimos revisar el cupón. Probá de nuevo.");
        } finally {
          setCouponLoading(false);
        }

        return;
      }

      if (getPackSize(cart) === null) {
        setAppliedCoupon(null);
        setCouponError("Agregá un pack de viandas para usar este cupón");

        return;
      }

      setAppliedCoupon(match);
      setCouponError(null);
    },
    [coupons, cart],
  );

  const setGiftVianda = useCallback((nombre: string, cantidad: number) => {
    setFuegos((actual) => {
      if (!actual) return actual;
      const viandas = {...actual.viandas, [nombre]: Math.max(0, cantidad)};
      const elegidas = Object.values(viandas).reduce((total, qty) => total + qty, 0);

      if (elegidas > actual.cupon.viandas) return actual;

      return {...actual, viandas};
    });
  }, []);

  const state = useMemo(
    () => ({
      checkout,
      cart,
      subtotal,
      total,
      totalAmount,
      shipping,
      quantity,
      message,
      isStoreOpen,
      appliedCoupon,
      couponError,
      couponLoading,
      fuegos,
      weeklyMenu,
    }),
    [
      couponLoading,
      fuegos,
      weeklyMenu,
      checkout,
      cart,
      subtotal,
      total,
      totalAmount,
      shipping,
      quantity,
      message,
      isStoreOpen,
      appliedCoupon,
      couponError,
    ],
  );
  const actions = useMemo(
    () => ({
      removeItem,
      updateItem,
      addItem,
      updateField,
      updateShipping,
      openCart,
      applyCoupon,
      setGiftVianda,
    }),
    [removeItem, updateItem, addItem, updateField, updateShipping, openCart, applyCoupon, setGiftVianda],
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
