import type {Checkout, Field} from "../../types";

import {parseCurrency} from "~/currency/utils";

import {Alert} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function TextField({
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "onChange"> & {
  onChange: (value: string) => void;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      {...props}
    />
  );
}

function RadioField({
  value,
  onChange,
  options,
  isInvalid,
}: {
  options: string[];
  onChange: (value: string) => void;
  value: string;
  isInvalid?: boolean;
}) {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <div
        className={
          isInvalid ? "flex flex-col gap-4 rounded-md border border-destructive p-3" : "flex flex-col gap-4"
        }
      >
        {options.map((option) => (
          <div key={option} className="flex items-start gap-x-3">
            <RadioGroupItem className="mt-1" id={option} value={option}>
              {option}
            </RadioGroupItem>
            <Label htmlFor={option}>
              <p>{option}</p>
              {normalize(option).includes(RECOMMENDED_OPTION_KEYWORD) && (
                <p className="italic text-muted-foreground">(opción recomendada)</p>
              )}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}

const CASH_DISCOUNT_RATE = 0.1;
const RECOMMENDED_OPTION_KEYWORD = "efectivo";

function Fields({
  fields,
  checkout,
  totalAmount,
  showErrors,
  onChange,
}: {
  fields: Field[];
  checkout: Checkout;
  totalAmount: number;
  showErrors: boolean;
  onChange: (id: string, value: string) => void;
}) {
  const paymentField = fields.find(
    (field) => field.type === "radio" && normalize(field.title).includes("pago"),
  );
  const paymentValue = paymentField ? checkout.get(paymentField.title) : undefined;
  const isCashPayment = Boolean(paymentValue && normalize(paymentValue).includes("efectivo"));
  const discountedTotal = totalAmount * (1 - CASH_DISCOUNT_RATE);

  // Show the customer's name, then the shipping address, then everything else
  // (payment method, etc.), regardless of the order in the sheet.
  function getFieldPriority(field: Field): number {
    if (field.type === "text" && normalize(field.title).includes("nombre")) return 0;
    if (field.type === "text" && normalize(field.title).includes("direcci")) return 1;

    return 2;
  }

  const orderedFields = [...fields].sort((a, b) => getFieldPriority(a) - getFieldPriority(b));

  return (
    <div className="flex flex-col gap-8">
      {orderedFields.map((field) => {
        const value = checkout.get(field.title) || "";
        // "Dirección" muestra el aviso de obligatoriedad (lo dice su título)
        // aunque no bloquee el envío: muchos clientes recurrentes no la
        // completan porque ya tenemos su dirección cargada de pedidos previos.
        const isVisuallyRequired = field.required || normalize(field.title).includes("obligatorio");
        const isInvalid = showErrors && isVisuallyRequired && !value.trim();

        return (
        <div key={field.title} className="flex flex-col gap-4">
          <p className="text-lg font-medium">{field.title}</p>
          <div className="flex flex-col gap-4">
            {field.type === "text" && (
              <TextField
                placeholder={field.placeholder}
                value={value}
                className={isInvalid ? "border-destructive focus-visible:ring-destructive" : undefined}
                onChange={(value: string) => {
                  onChange(field.title, value);
                }}
              />
            )}
            {field.type === "radio" && (
              <RadioField
                options={field.options}
                value={value}
                isInvalid={isInvalid}
                onChange={(value: string) => {
                  onChange(field.title, value);
                }}
              />
            )}
            {isInvalid && <p className="text-sm font-medium text-destructive">Completá para finalizar</p>}
            {field.note ? <Alert>{field.note}</Alert> : null}
          </div>
          {Boolean(paymentValue) &&
            field.type === "radio" &&
            normalize(field.title).includes("pago") &&
            (isCashPayment ? (
              <div className="flex flex-col gap-1 rounded-md bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Total con 10% OFF en efectivo</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-sm text-muted-foreground line-through">
                    {parseCurrency(totalAmount)}
                  </p>
                  <p className="text-lg font-semibold text-incentive">
                    {parseCurrency(discountedTotal)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 rounded-md bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{parseCurrency(totalAmount)}</p>
              </div>
            ))}
        </div>
        );
      })}
    </div>
  );
}

export default Fields;
