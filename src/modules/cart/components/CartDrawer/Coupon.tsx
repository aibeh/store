import type {Coupon as CouponData} from "../../types";

import {useState} from "react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

function Coupon({
  appliedCoupon,
  giftQuantity,
  couponError,
  onApply,
}: {
  appliedCoupon: CouponData | null;
  giftQuantity: number;
  couponError: string | null;
  onApply: (code: string) => void;
}) {
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-col gap-2">
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
          variant="ghost"
          onClick={() => {
            onApply(code);
          }}
        >
          Aplicar
        </Button>
      </div>
      {appliedCoupon && Boolean(giftQuantity) && (
        <div className="flex items-center justify-between gap-2 rounded-md bg-secondary p-3 text-sm">
          <p>
            <span className="font-semibold">{appliedCoupon.codigo}</span> aplicado: +{giftQuantity}{" "}
            vianda{giftQuantity > 1 ? "s" : ""} congelada{giftQuantity > 1 ? "s" : ""} de regalo 🎁
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
