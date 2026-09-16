import type {Store} from "~/store/types";

import type {CartItem, Field} from "../../types";

import {useEffect, useState} from "react";
import {X} from "lucide-react";
import Image from "next/image";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import WhatsappIcon from "@/components/icons/whatsapp";

import {useCart} from "../../context/client";
import {getCouponGiftQuantity, getOrderPayload} from "../../utils";

import Coupon from "./Coupon";
import Details from "./Details";
import Fields from "./Fields";
import Shipping from "./Shipping";

function CartDrawer({
  onClose,
  store,
  fields,
  ...props
}: Omit<React.ComponentProps<typeof Sheet>, "children"> & {
  fields?: Field[];
  store: Store;
  onClose: VoidFunction;
}) {
  const [
    {subtotal, total, totalAmount, shipping, message, cart, checkout, appliedCoupon, couponError},
    {removeItem, updateItem, updateField, updateShipping, applyCoupon},
  ] = useCart();
  const [currentStep, setCurrentStep] = useState<"details" | "fields">("details");
  const [showErrors, setShowErrors] = useState(false);

  function validateRequiredFields(): boolean {
    if (!fields) return true;

    return fields.every((field) => {
      if (!field.required) return true;
      const value = checkout.get(field.title);
      return Boolean(value && value.trim());
    });
  }

  function handleUpdateCart(id: string, item: CartItem) {
    if (!item.quantity) {
      removeItem(id);

      return;
    }

    updateItem(id, item);
  }

  function handleUpdateField(id: string, value: string) {
    updateField(id, value);
  }

  // Invisible para el cliente: no cambia el redirect a WhatsApp ni lo demora,
  // solo dispara en paralelo el registro del pedido en la planilla.
  function logOrderInBackground() {
    const url = process.env.NEXT_PUBLIC_ORDER_LOG_URL;

    if (!url) return;

    const payload = getOrderPayload(cart, checkout, shipping, appliedCoupon);

    // mode "no-cors" + Content-Type "text/plain": Apps Script no responde con
    // headers CORS, así que no podemos leer la respuesta (no la necesitamos).
    // "text/plain" evita el preflight; Apps Script igual lee el JSON crudo
    // desde e.postData.contents sin importar el Content-Type declarado.
    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }

  function handleCompleteOrder(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!validateRequiredFields()) {
      e.preventDefault();
      setShowErrors(true);

      return;
    }

    logOrderInBackground();
  }

  useEffect(() => {
    if (!cart.size) {
      onClose();
    }
  }, [cart.size, onClose]);

  return (
    <Sheet open onOpenChange={(_isOpen) => !_isOpen && onClose()} {...props}>
      <SheetContent showCloseButton={false} className="grid grid-cols-1 grid-rows-[auto_1fr_auto] overflow-hidden">
        <Image
          src="/assets/order-bg-deco.webp"
          alt=""
          aria-hidden="true"
          fill
          className="pointer-events-none absolute inset-0 -z-10 select-none object-cover opacity-[0.04] mix-blend-multiply"
        />
        <SheetHeader>
          <SheetClose aria-label="Cerrar" className="-mx-6 ml-auto h-12 w-14 rounded-l-lg border border-border bg-background py-2 pl-2 pr-4 shadow-lg">
            <X className="h-8 w-8" />
          </SheetClose>
          <SheetTitle className="text-left text-2xl font-medium">Tu pedido</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto" data-testid="cart">
          {currentStep === "details" && (
            <>
              <Details cart={cart} onChange={handleUpdateCart} />
              <Shipping shipping={shipping} subtotal={subtotal} onChange={updateShipping} />
            </>
          )}
          {fields && currentStep === "fields" ? (
            <Fields
              checkout={checkout}
              fields={fields}
              showErrors={showErrors}
              totalAmount={totalAmount}
              onChange={handleUpdateField}
            />
          ) : null}
        </div>

        <SheetFooter>
          {fields && currentStep === "details" ? (
            <div className="flex w-full flex-col gap-4">
              <hr />
              <Coupon
                appliedCoupon={appliedCoupon}
                couponError={couponError}
                giftQuantity={appliedCoupon ? getCouponGiftQuantity(appliedCoupon, cart) : 0}
                onApply={applyCoupon}
              />
              <div className="flex items-center justify-between gap-2 text-lg font-medium">
                <p>Total</p>
                <p>{total}</p>
              </div>
              <Button
                className="w-full"
                data-testid="keep-shopping"
                size="lg"
                variant="brand"
                onClick={() => {
                  onClose();
                  document
                    .getElementById("hace-tu-pedido")
                    ?.scrollIntoView({behavior: "smooth", block: "start"});
                }}
              >
                Quiero sumar otros productos a mi pedido
              </Button>
              <Button
                className="w-full"
                data-testid="continue-order"
                disabled={!shipping}
                size="lg"
                variant="brand"
                onClick={() => {
                  if (shipping) setCurrentStep("fields");
                }}
              >
                {shipping ? "Finalizar mi pedido" : "Seleccioná una zona de envío"}
              </Button>
            </div>
          ) : null}
          {(currentStep === "fields" || !fields) && (
            <div className="flex w-full flex-col gap-4">
              <hr />
              <Button
                className="w-full"
                size="lg"
                variant="ghost"
                onClick={() => {
                  setCurrentStep("details");
                }}
              >
                Revisar pedido
              </Button>
              <a
                className="w-full"
                href={`https://wa.me/${store.phone}?text=${encodeURIComponent(message)}`}
                rel="noopener noreferrer"
                target="_blank"
                onClick={handleCompleteOrder}
              >
                <Button
                  className="w-full"
                  data-testid="complete-order"
                  size="lg"
                  variant="brand"
                >
                  <div className="inline-flex items-center gap-2">
                    <WhatsappIcon />
                    <span>Completar pedido</span>
                  </div>
                </Button>
              </a>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;
