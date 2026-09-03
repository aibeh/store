import storeApi from "~/store/api";

import cartApi from "../api";

import CartProviderClient from "./client";

const CartProvider = async ({children}: {children: React.ReactNode}) => {
  const fields = await cartApi.field.list();
  const store = await storeApi.fetch();
  const coupons = await cartApi.coupon.list();

  return (
    <CartProviderClient coupons={coupons} fields={fields} store={store}>
      {children}
    </CartProviderClient>
  );
};

export default CartProvider;
