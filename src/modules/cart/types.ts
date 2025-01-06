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
