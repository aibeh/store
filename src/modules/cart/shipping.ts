export interface ShippingZone {
  title: string;
  price: number;
}

export const SHIPPING_ZONES: ShippingZone[] = [
  {title: "Wilde / Don Bosco / Bernal", price: 1500},
  {title: "Quilmes", price: 2000},
  {title: "Berazategui / Hudson / CABA", price: 4000},
];

// Legacy per-product option group, now replaced by the cart-level selector above.
// Ignored wherever it still comes from the products sheet so old rows don't block checkout.
export const LEGACY_SHIPPING_OPTION_GROUP_TITLE = "Entrega a domicilio:";
