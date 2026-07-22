import type {ShippingZone} from "../../shipping";

import {parseCurrency} from "~/currency/utils";

import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

import {SHIPPING_ZONES} from "../../shipping";

function Shipping({
  subtotal,
  shipping,
  onChange,
}: {
  subtotal: string;
  shipping: ShippingZone | null;
  onChange: (zone: ShippingZone) => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-4 border-t pt-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <p>Subtotal</p>
        <p>{subtotal}</p>
      </div>
      <p className="text-lg font-medium">Costo de envío:</p>
      <RadioGroup
        value={shipping?.title}
        onValueChange={(value) => {
          const zone = SHIPPING_ZONES.find((zone) => zone.title === value);

          if (zone) onChange(zone);
        }}
      >
        <div className="flex flex-col gap-4">
          {SHIPPING_ZONES.map((zone) => (
            <div key={zone.title} className="flex items-center gap-x-3">
              <RadioGroupItem id={zone.title} value={zone.title} />
              <Label className="w-full" htmlFor={zone.title}>
                <div className="flex w-full items-center justify-between gap-2">
                  <p>{zone.title}</p>
                  <p className="font-medium">{parseCurrency(zone.price)}</p>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      {!shipping && (
        <p className="text-sm text-muted-foreground">Seleccioná una zona para continuar</p>
      )}
    </div>
  );
}

export default Shipping;
