import type {Option} from "~/product/types";

export interface CartItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price: number;
  quantity: number;
  options?: Record<
    string,
    {
      options: Option[];
      condition: string;
    }
  >;
}

export type Cart = Map<CartItem["id"], CartItem>;

export type Checkout = Map<string, string>;

export interface RadioField {
  title: string;
  type: "radio";
  options: string[];
  required: boolean;
  note: string;
}

export interface TextField {
  title: string;
  type: "text";
  placeholder: string;
  required: boolean;
  note: string;
}

export type Field = RadioField | TextField;

// Cupón de fueguitos (canje del panel del cliente): único y de un solo uso.
export interface FuegosCoupon {
  codigo: string;
  premio: string;
  tipo: "regalo" | "plata";
  viandas: number;
  pancakes: number;
  pan: number;
  descuento: number;
}

// Cupón de fueguitos aplicado + las viandas de regalo que eligió el cliente.
export interface FuegosGift {
  cupon: FuegosCoupon;
  viandas: Record<string, number>;
}

export interface Coupon {
  codigo: string;
  pack5: number;
  pack10: number;
  pack15: number;
  activo: boolean;
  regaloSingular: string;
  regaloPlural: string;
}
