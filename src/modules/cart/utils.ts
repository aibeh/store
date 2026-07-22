import type { Cart, CartItem, Checkout } from "./types";
import type { ShippingZone } from "./shipping";

import { parseCurrency } from "~/currency/utils";

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

export function getCartItemOptionsSummary(
  options: CartItem["options"],
): string {
  return Object.entries(options!)
    .reduce<string[]>(
      (_options, [category, { options }]) =>
        _options.concat(
          `  • ${category}:\n    - ${options.map((opt) => opt.title).join("\n    - ")}`,
        ),
      [],
    )
    .join("\n");
}

export function getCartMessage(cart: Cart, checkout: Checkout, shipping: ShippingZone | null): string {
  const items = Array.from(cart.values())
    .map(
      (item) =>
        `• ${item.title}${item.quantity > 1 ? ` (X${item.quantity})` : ``} - ${parseCurrency(getCartItemPrice(item))}${
          item.options && Object.keys(item.options).length > 0
            ? `\n${getCartItemOptionsSummary(item.options)}`
            : ``
        }`,
    )
    .join("\n\n");

  const fields = Array.from(checkout.entries())
    .map(([key, value]) => `• ${key}: ${value}`)
    .join("\n");

  const subtotal = getCartTotal(cart);
  const total = subtotal + (shipping?.price || 0);
  const shippingLine = shipping
    ? `\nCosto de envío (${shipping.title}): ${parseCurrency(shipping.price)}`
    : "";
  const isCashPayment = Array.from(checkout.values()).some((value) =>
    value.toLowerCase().includes("efectivo"),
  );
  const discountLine = isCashPayment
    ? `\nTotal con 10% OFF en efectivo: ${parseCurrency(total * 0.9)}`
    : "";
  const summary = `\nSubtotal: ${parseCurrency(subtotal)}${shippingLine}\nTotal: ${parseCurrency(total)}${discountLine}`;

  return [items, fields, summary].filter(Boolean).join("\n\n");
}
