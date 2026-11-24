import storeApi from "~/store/api";
import productApi from "~/product/api";
import {getWeeklyMenu} from "~/product/utils";

import cartApi from "../api";

import CartProviderClient from "./client";

const CartProvider = async ({children}: {children: React.ReactNode}) => {
  const fields = await cartApi.field.list();
  const store = await storeApi.fetch();
  const coupons = await cartApi.coupon.list();
  // Menú de la semana: para elegir la vianda de regalo de un cupón de fueguitos.
  const weeklyMenu = getWeeklyMenu(await productApi.list());

  return (
    <CartProviderClient coupons={coupons} fields={fields} store={store} weeklyMenu={weeklyMenu}>
      {children}
    </CartProviderClient>
  );
};

export default CartProvider;
