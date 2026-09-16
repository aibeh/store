import type { Cart, CartItem, Checkout, Coupon } from "./types";
import type { ShippingZone } from "./shipping";

import { parseCurrency } from "~/currency/utils";

// Detecta el tamaño del pack de viandas en el carrito (5, 10 o 15), para
// saber cuántas viandas congeladas de regalo corresponden con un cupón.
export function getPackSize(cart: Cart): 5 | 10 | 15 | null {
  for (const item of Array.from(cart.values())) {
    const match = /pack de (5|10|15)\s*viandas/i.exec(item.title);

    if (match) return Number(match[1]) as 5 | 10 | 15;
  }

  return null;
}

export function getCouponGiftQuantity(coupon: Coupon, cart: Cart): number {
  const packSize = getPackSize(cart);

  if (packSize === 5) return coupon.pack5;
  if (packSize === 10) return coupon.pack10;
  if (packSize === 15) return coupon.pack15;

  return 0;
}

export function getCartItemPrice(item: CartItem): number {
  // Start with base price multiplied by quantity
  let total = item.price * item.quantity;

  if (item.options) {
    Object.values(item.options).forEach((category) => {
      category.options.forEach((option) => {
        const conditions = category.condition?.split("||") || [];
        const hasQuantityCondition = conditions.some((c) =>
          c.match(/^[><=]\d+$/),
        );

        if (hasQuantityCondition) {
          // For stepper options, multiply price by quantity
          total += (option.price || 0) * (option.quantity || 0);
        } else {
          // For radio options, just add the price once
          total += option.price || 0;
        }
      });
    });
  }

  return total;
}

export function getCartTotal(cart: Cart): number {
  return Array.from(cart.values()).reduce(
    (total, item) => total + getCartItemPrice(item),
    0,
  );
}

function hasQuantityCondition(condition?: string): boolean {
  const conditions = condition?.split("||") || [];

  return conditions.some((c) => c.match(/^[><=]?\d+$/));
}

// Stepper selections are stored as "Title x N" so the drawer can find the
// existing entry by its title prefix (see CartItemDrawer#handleSelectOption).
function formatOptionTitle(title: string): string {
  const match = /^(.*) x (\d+)$/.exec(title);

  return match ? `${match[1]} (x${match[2]})` : title;
}

export function getCartItemOptionsSummary(
  options: CartItem["options"],
): string {
  const inlineOptions: string[] = [];
  const sections: string[] = [];

  Object.entries(options!).forEach(([category, group]) => {
    const optionLines = group.options.map((opt) => `  • ${formatOptionTitle(opt.title)}`);

    if (hasQuantityCondition(group.condition)) {
      inlineOptions.push(...optionLines);
    } else {
      sections.push(`${category}:\n${optionLines.join("\n")}`);
    }
  });

  return [inlineOptions.join("\n"), ...sections].filter(Boolean).join("\n\n");
}

export interface OrderPayload {
  cliente: string | null;
  items: {
    producto: string;
    cantidad: number;
    precio: number;
    viandas: {nombre: string; cantidad: number}[];
    otrasElecciones: Record<string, string[]>;
  }[];
  metodoPago: string | null;
  direccion: string | null;
  zonaEntrega: string | null;
  subtotal: number;
  costoEnvio: number;
  total: number;
  totalConDescuentoEfectivo: number | null;
  cupon: {codigo: string; viandasRegalo: number} | null;
}

// Payload estructurado para mandar a un endpoint (Apps Script en producción)
// que anote el pedido automáticamente, en paralelo al link de WhatsApp.
export function getOrderPayload(
  cart: Cart,
  checkout: Checkout,
  shipping: ShippingZone | null,
  coupon: Coupon | null,
): OrderPayload {
  const items = Array.from(cart.values()).map((item) => {
    const viandas: {nombre: string; cantidad: number}[] = [];
    const otrasElecciones: Record<string, string[]> = {};

    Object.entries(item.options || {}).forEach(([category, group]) => {
      if (hasQuantityCondition(group.condition)) {
        group.options.forEach((opt) => {
          const match = /^(.*) x (\d+)$/.exec(opt.title);

          if (match) viandas.push({nombre: match[1], cantidad: parseInt(match[2], 10)});
        });
      } else {
        otrasElecciones[category] = group.options.map((opt) => opt.title);
      }
    });

    return {
      producto: item.title,
      cantidad: item.quantity,
      precio: getCartItemPrice(item),
      viandas,
      otrasElecciones,
    };
  });

  let cliente: string | null = null;
  let direccion: string | null = null;
  let metodoPago: string | null = null;

  for (const [key, value] of checkout) {
    const normalizedKey = key.toLowerCase();

    if (normalizedKey.includes("nombre")) cliente = value;
    else if (normalizedKey.includes("direcci")) direccion = value;
    else if (normalizedKey.includes("pago")) metodoPago = value;
  }

  const subtotal = getCartTotal(cart);
  const costoEnvio = shipping?.price || 0;
  const total = subtotal + costoEnvio;
  const isCashPayment = Boolean(metodoPago && metodoPago.toLowerCase().includes("efectivo"));

  return {
    cliente,
    items,
    metodoPago,
    direccion,
    zonaEntrega: shipping?.title || null,
    subtotal,
    costoEnvio,
    total,
    totalConDescuentoEfectivo: isCashPayment ? Math.round(total * 0.9) : null,
    cupon: coupon ? {codigo: coupon.codigo, viandasRegalo: getCouponGiftQuantity(coupon, cart)} : null,
  };
}

export function getCartMessage(
  cart: Cart,
  checkout: Checkout,
  shipping: ShippingZone | null,
  coupon: Coupon | null,
): string {
  const items = Array.from(cart.values())
    .map((item) => {
      const title = `${item.title}${item.quantity > 1 ? ` (X${item.quantity})` : ``} - ${parseCurrency(getCartItemPrice(item))}`;
      const optionsSummary =
        item.options && Object.keys(item.options).length > 0
          ? getCartItemOptionsSummary(item.options)
          : "";

      return [title, optionsSummary].filter(Boolean).join("\n");
    })
    .join("\n\n");

  const giftQuantity = coupon ? getCouponGiftQuantity(coupon, cart) : 0;
  const couponLine = giftQuantity
    ? `🎁 Cupón ${coupon!.codigo}: +${giftQuantity} vianda${giftQuantity > 1 ? "s" : ""} congelada${giftQuantity > 1 ? "s" : ""} de regalo`
    : "";

  const fields = Array.from(checkout.entries())
    .map(([key, value]) => `${key}:\n  • ${value}`)
    .join("\n\n");

  const shippingLine = shipping ? `Zona de entrega:\n  • ${shipping.title}` : "";

  const subtotal = getCartTotal(cart);
  const total = subtotal + (shipping?.price || 0);
  const isCashPayment = Array.from(checkout.values()).some((value) =>
    value.toLowerCase().includes("efectivo"),
  );
  const finalTotal = isCashPayment
    ? `Total con 10% OFF en efectivo: ${parseCurrency(total * 0.9)}`
    : `Total: ${parseCurrency(total)}`;
  const separator = "------------------------------";

  return [items, couponLine, fields, shippingLine, separator, finalTotal]
    .filter(Boolean)
    .join("\n\n");
}
