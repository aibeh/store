import type {Cart, CartItem, Checkout} from "./types";

import {parseCurrency} from "~/currency/utils";

export function getCartItemPrice(item: CartItem): number {
  // Start with base price multiplied by quantity
  let total = item.price * item.quantity;

  if (item.options) {
    Object.values(item.options).forEach((category) => {
      category.options.forEach((option) => {
        if (category.condition) {
          // For stepper options, multiply price by quantity
          total += (option.price || 0) * (option.quantity || 0);
        } else {
          // For radio options, multiply by item quantity since they apply to each item
          total += (option.price || 0) * item.quantity;
        }
      });
    });
  }

  return total;
}

export function getCartTotal(cart: Cart): number {
  return Array.from(cart.values()).reduce((total, item) => total + getCartItemPrice(item), 0);
}

export function getCartItemOptionsSummary(options: CartItem["options"]): string {
  return Object.entries(options!)
    .reduce<string[]>(
      (_options, [category, {options}]) =>
        _options.concat(`${category}: ${options.map((opt) => opt.title).join(", ")}`),
      [],
    )
    .join(", ");
}

export function getCartMessage(cart: Cart, checkout: Checkout): string {
  const items = Array.from(cart.values())
    .map(
      (item) =>
        `* ${item.title}${item.quantity > 1 ? ` (X${item.quantity})` : ``}${
          item.options && Object.keys(item.options).length > 0
            ? ` [${getCartItemOptionsSummary(item.options)}]`
            : ``
        } - ${parseCurrency(getCartItemPrice(item))}`,
    )
    .join("\n");
  const fields = Array.from(checkout.entries())
    .map(([key, value]) => `* ${key}: ${value}`)
    .join("\n");
  const total = `Total: ${parseCurrency(getCartTotal(cart))}`;

  return [items, fields, total].filter(Boolean).join("\n\n");
}
