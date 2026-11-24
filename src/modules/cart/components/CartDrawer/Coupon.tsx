import type {Coupon as CouponData, FuegosGift} from "../../types";

import {useState} from "react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {getCouponGiftLabel} from "../../utils";

function Coupon({
  appliedCoupon,
  giftQuantity,
  couponError,
  onApply,
  fuegos = null,
  loading = false,
  misCupones = [],
}: {
  appliedCoupon: CouponData | null;
  giftQuantity: number;
  couponError: string | null;
  onApply: (code: string) => void;
  fuegos?: FuegosGift | null;
  loading?: boolean;
  misCupones?: {codigo: string; premio: string}[];
}) {
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-col gap-2">
      {misCupones.length ? (
        <div className="rounded-md border border-orange-300 bg-orange-50/80 p-3">
          <p className="text-sm font-semibold">🔥 Mis cupones</p>
          <ul className="mt-2 grid gap-2">
            {misCupones.map((cupon) => {
              const aplicado = fuegos?.cupon.codigo === cupon.codigo;

              return (
                <li key={cupon.codigo} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs font-bold tracking-wide">{cupon.codigo}</p>
                    <p className="text-xs text-muted-foreground">{cupon.premio}</p>
                  </div>
                  <Button
                    className="h-8 shrink-0 px-3 text-xs"
                    disabled={aplicado || loading}
                    variant="brand"
                    onClick={() => {
                      setCode(cupon.codigo);
                      onApply(cupon.codigo);
                    }}
                  >
                    {aplicado ? "Aplicado ✓" : "Usarlo"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      <p className="text-sm font-medium">¿Tenés un cupón?</p>
      <div className="flex gap-2">
        <Input
          placeholder="Ingresá tu código"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
          }}
        />
        <Button
          disabled={loading}
          variant="ghost"
          onClick={() => {
            onApply(code);
          }}
        >
          {loading ? "Revisando…" : "Aplicar"}
        </Button>
      </div>
      {fuegos && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-orange-300 bg-orange-50/80 p-3 text-sm">
          <p>
            🔥 <span className="font-semibold">{fuegos.cupon.codigo}</span> aplicado:{" "}
            <span className="font-semibold">{fuegos.cupon.premio}</span>
            {fuegos.cupon.tipo === "regalo" ? " de regalo 🎁" : " en tu pedido"}
          </p>
          <button
            className="whitespace-nowrap text-muted-foreground underline"
            type="button"
            onClick={() => {
              setCode("");
              onApply("");
            }}
          >
            Quitar
          </button>
        </div>
      )}
      {appliedCoupon && Boolean(giftQuantity) && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-white/60 bg-white/50 p-3 text-sm">
          <p>
            <span className="font-semibold">{appliedCoupon.codigo}</span> aplicado: +{giftQuantity}{" "}
            {getCouponGiftLabel(appliedCoupon, giftQuantity)} de regalo 🎁
          </p>
          <button
            className="whitespace-nowrap text-muted-foreground underline"
            type="button"
            onClick={() => {
              setCode("");
              onApply("");
            }}
          >
            Quitar
          </button>
        </div>
      )}
      {couponError && <p className="text-sm font-medium text-destructive">{couponError}</p>}
    </div>
  );
}

export default Coupon;
