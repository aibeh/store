import type { Store } from "~/store/types";

import type { CartItem, Field } from "../../types";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import WhatsappIcon from "@/components/icons/whatsapp";

import { useCart } from "../../context/client";
import {
  getCashTotal,
  getCouponGiftQuantity,
  getFuegosChosenViandas,
  getFuegosDiscount,
  getOrderPayload,
} from "../../utils";

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
    {
      subtotal,
      total,
      totalAmount,
      shipping,
      message,
      cart,
      checkout,
      appliedCoupon,
      couponError,
      couponLoading,
      fuegos,
      weeklyMenu,
    },
    {
      removeItem,
      updateItem,
      updateField,
      updateShipping,
      applyCoupon,
      setGiftVianda,
    },
  ] = useCart();
  const [currentStep, setCurrentStep] = useState<"details" | "fields">(
    "details",
  );
  // "Mis cupones": si el cliente entró con su cuenta, le recordamos sus cupones sin usar.
  const [misCupones, setMisCupones] = useState<
    { codigo: string; premio: string }[]
  >([]);

  useEffect(() => {
    let activo = true;

    fetch("/api/cuenta/perfil", { cache: "no-store" })
      .then((response) => response.json())
      .then(
        (data: {
          perfil?: {
            cupones?: { codigo: string; premio: string; estado: string }[];
          } | null;
        }) => {
          if (!activo) return;
          setMisCupones(
            (data.perfil?.cupones || []).filter(
              (cupon) => cupon.estado === "Sin usar",
            ),
          );
        },
      )
      .catch(() => {});

    return () => {
      activo = false;
    };
  }, []);
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

    const payload = getOrderPayload(
      cart,
      checkout,
      shipping,
      appliedCoupon,
      fuegos,
    );

    // mode "no-cors" + Content-Type "text/plain": Apps Script no responde con
    // headers CORS, así que no podemos leer la respuesta (no la necesitamos).
    // "text/plain" evita el preflight; Apps Script igual lee el JSON crudo
    // desde e.postData.contents sin importar el Content-Type declarado.
    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
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

    // El cupón de fueguitos queda usado: no sirve para otro pedido.
    if (fuegos) {
      fetch("/api/cupones/usar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: fuegos.cupon.codigo,
          cliente:
            Array.from(checkout.entries()).find(([key]) =>
              /nombre/i.test(key),
            )?.[1] || "",
        }),
        keepalive: true,
      }).catch(() => {});
    }
  }

  const viandasRegalo =
    fuegos?.cupon.tipo === "regalo" ? fuegos.cupon.viandas : 0;
  const viandasElegidas = getFuegosChosenViandas(fuegos);
  const faltanViandas = viandasRegalo > viandasElegidas;

  useEffect(() => {
    if (!cart.size) {
      onClose();
    }
  }, [cart.size, onClose]);

  return (
    <Sheet open onOpenChange={(_isOpen) => !_isOpen && onClose()} {...props}>
      <SheetContent className="isolate grid grid-cols-1 grid-rows-[auto_1fr_auto] overflow-hidden bg-[#f0ead3]">
        <Image
          src="/assets/order-bg-deco.webp"
          alt=""
          aria-hidden="true"
          fill
          className="pointer-events-none absolute inset-0 -z-10 select-none object-cover opacity-[0.04] mix-blend-multiply"
        />
        {/* Título y X en una sola línea: así el encabezado ocupa poco lugar en el celular. */}
        <SheetHeader className="-mt-2 flex flex-row items-center justify-between gap-4 text-left">
          <SheetTitle className="text-left text-2xl font-medium">
            Tu pedido
          </SheetTitle>
          <SheetClose className="-mr-6 h-10 w-12 shrink-0 rounded-l-lg border border-border bg-[#f0ead3] py-1.5 pl-2 pr-3 shadow-lg">
            <X className="h-7 w-7" />
          </SheetClose>
        </SheetHeader>

        <div className="overflow-y-auto" data-testid="cart">
          {currentStep === "details" && (
            <>
              <Details cart={cart} onChange={handleUpdateCart} />
              <Shipping
                shipping={shipping}
                subtotal={subtotal}
                onChange={updateShipping}
              />
              {fields ? (
                // Cupón y viandas de regalo van en la parte que se desplaza, así se ven todas las opciones.
                <div className="mt-6 flex flex-col gap-4 pb-2">
                  <hr />
                  <Coupon
                    appliedCoupon={appliedCoupon}
                    couponError={couponError}
                    fuegos={fuegos}
                    giftQuantity={
                      appliedCoupon
                        ? getCouponGiftQuantity(appliedCoupon, cart)
                        : 0
                    }
                    loading={couponLoading}
                    misCupones={misCupones}
                    onApply={applyCoupon}
                  />
                  {viandasRegalo ? (
                    <div className="rounded-md border border-orange-300 bg-white/50 p-3">
                      <p className="text-sm font-semibold">
                        Elegí tu{viandasRegalo > 1 ? "s" : ""} vianda
                        {viandasRegalo > 1 ? "s" : ""} de regalo 🎁{" "}
                        <span className="font-normal text-muted-foreground">
                          ({viandasElegidas}/{viandasRegalo})
                        </span>
                      </p>
                      <ul className="mt-2 grid gap-2">
                        {weeklyMenu.map((nombre) => {
                          const cantidad = fuegos?.viandas[nombre] || 0;

                          return (
                            <li
                              key={nombre}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <span className="leading-snug">{nombre}</span>
                              <div className="flex shrink-0 items-center gap-2">
                                <Button
                                  className="h-6 w-6 rounded-full p-0"
                                  disabled={!cantidad}
                                  variant="brand"
                                  onClick={() =>
                                    setGiftVianda(nombre, cantidad - 1)
                                  }
                                >
                                  −
                                </Button>
                                <span className="w-4 text-center font-medium">
                                  {cantidad}
                                </span>
                                <Button
                                  className="h-6 w-6 rounded-full p-0"
                                  disabled={!faltanViandas}
                                  variant="brand"
                                  onClick={() =>
                                    setGiftVianda(nombre, cantidad + 1)
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
          {fields && currentStep === "fields" ? (
            <Fields
              checkout={checkout}
              fields={fields}
              showErrors={showErrors}
              totalAmount={totalAmount}
              cashTotal={Math.max(
                0,
                getCashTotal(cart, shipping?.price || 0) -
                  getFuegosDiscount(fuegos),
              )}
              onChange={handleUpdateField}
            />
          ) : null}
        </div>

        <SheetFooter>
          {fields && currentStep === "details" ? (
            <div className="flex w-full flex-col gap-4">
              <hr />
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
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Quiero sumar otros productos a mi pedido
              </Button>
              <Button
                className="w-full"
                data-testid="continue-order"
                disabled={!shipping || faltanViandas}
                size="lg"
                variant="brand"
                onClick={() => {
                  if (shipping && !faltanViandas) setCurrentStep("fields");
                }}
              >
                {!shipping
                  ? "Seleccioná una zona de envío"
                  : faltanViandas
                    ? viandasRegalo > 1
                      ? "Elegí tus viandas de regalo"
                      : "Elegí tu vianda de regalo"
                    : "Finalizar mi pedido"}
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
