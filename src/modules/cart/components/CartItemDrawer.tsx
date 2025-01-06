import type {Option, OptionCategory} from "~/product/types";

import type {CartItem} from "../types";
import type {ComponentProps} from "react";

import {useState, useMemo} from "react";
import {X} from "lucide-react";

import {parseCurrency} from "~/currency/utils";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Stepper} from "@/components/ui/stepper";

import {getCartItemPrice} from "../utils";

function CartItemDrawer({
  item,
  onClose,
  onSubmit,
  ...props
}: ComponentProps<typeof Sheet> & {
  item: CartItem;
  onClose: VoidFunction;
  onSubmit: (item: CartItem) => void;
}) {
  const [formData, setFormData] = useState<CartItem>(() => ({...item, options: {}}));
  const total = useMemo(() => parseCurrency(getCartItemPrice(formData)), [formData]);
  const options = useMemo(
    () =>
      item.options
        ? Object.entries(item.options).map(([title, _options]) => ({
            title,
            condition: _options.condition,
            options: _options.options,
          }))
        : [],
    [item],
  );

  function parseCondition(condition: string) {
    if (!condition) return null;

    // First try to parse as a plain number
    const plainNumber = parseInt(condition, 10);

    if (!isNaN(plainNumber)) {
      return {
        operator: "=",
        value: plainNumber,
      };
    }

    // Then try to parse as an operator + number
    const match = /^([><=])(\d+)$/.exec(condition);

    if (!match) return null;

    return {
      operator: match[1] as ">" | "<" | "=",
      value: parseInt(match[2], 10),
    };
  }

  function handleSelectOption(option: Option, category: OptionCategory, quantity?: number) {
    setFormData((_formData) => {
      const currentOptions = _formData.options?.[option.category]?.options || [];

      // Find if this option already exists
      const existingOptionIndex = currentOptions.findIndex(
        (opt) => opt.title.split(" x ")[0] === option.title,
      );

      let newOptions: Option[];

      if (quantity !== undefined) {
        // Stepper case
        if (existingOptionIndex >= 0) {
          // Update existing option
          newOptions = currentOptions.map((opt, index) =>
            index === existingOptionIndex
              ? {
                  ...option,
                  quantity,
                  title: `${option.title} x ${quantity}`,
                }
              : opt,
          );
        } else {
          // Add new option
          newOptions = [
            ...currentOptions,
            {
              ...option,
              quantity,
              title: `${option.title} x ${quantity}`,
            },
          ];
        }
      } else {
        // Radio case - replace all options
        newOptions = [option];
      }

      // Filter out options with quantity 0
      const filteredOptions = newOptions.filter((opt) => !opt.quantity || opt.quantity > 0);

      return {
        ..._formData,
        options: {
          ..._formData.options,
          [option.category]: {
            options: filteredOptions,
            condition: item.options?.[option.category]?.condition || "",
          },
        },
      };
    });
  }

  function validateConditions(): boolean {
    if (!item.options) return true;

    return Object.entries(item.options).every(([categoryTitle, category]) => {
      if (!category.condition) return true;

      const condition = parseCondition(category.condition);

      if (!condition) return true;

      const totalQuantity =
        formData.options?.[categoryTitle]?.options.reduce(
          (sum, opt) => sum + (opt.quantity || 0),
          0,
        ) || 0;

      switch (condition.operator) {
        case "=":
          return totalQuantity === condition.value;
        case ">":
          return totalQuantity > condition.value;
        case "<":
          return totalQuantity < condition.value;
        default:
          return true;
      }
    });
  }

  return (
    <Sheet open={props.open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="grid grid-rows-[auto_1fr_auto]">
        <SheetHeader>
          <SheetClose className="z-20 -mx-6 ml-auto h-12 w-14 rounded-l-lg border border-border bg-background py-2 pl-2 pr-4 shadow-lg">
            <X className="h-8 w-8" />
          </SheetClose>
        </SheetHeader>

        <div
          className={cn("overflow-y-auto", {"-mt-16": item.image})}
          data-testid="cart-item-drawer"
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              {Boolean(item.image) && (
                <img
                  alt={item.title}
                  className="h-[240px] w-full bg-secondary object-contain sm:h-[320px]"
                  src={item.image}
                />
              )}
              <SheetTitle className="text-2xl font-medium">{item.title}</SheetTitle>
              <SheetDescription className="text-md whitespace-pre-wrap text-muted-foreground sm:text-lg">
                {item.description}
              </SheetDescription>
            </div>
            {Boolean(options.length) && (
              <div className="flex flex-col gap-8">
                {options.map((category) => {
                  return (
                    <div key={category.title} className="flex w-full flex-col gap-4">
                      <p className="text-lg font-medium">{category.title}</p>
                      {category.condition ? (
                        // Stepper case
                        category.options.map((option) => {
                          const condition = parseCondition(category.condition);
                          const currentOption = formData.options?.[category.title]?.options.find(
                            (opt) => opt.title.split(" x ")[0] === option.title,
                          );
                          const quantity = currentOption?.quantity || 0;

                          let min = 0;
                          let max: number | undefined;

                          if (condition) {
                            switch (condition.operator) {
                              case ">":
                                min = condition.value + 1;
                                break;
                              case "=":
                                max = condition.value;
                                break;
                              case "<":
                                max = condition.value - 1;
                                break;
                            }
                          }

                          return (
                            <div
                              key={option.title}
                              className="flex items-center justify-between gap-x-3"
                            >
                              <Label className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span>{option.title}</span>
                                  {Boolean(option.price) && (
                                    <div className="flex items-center gap-1">
                                      <p className="text-muted-foreground">
                                        {option.price < 0 ? "-" : "+"}
                                      </p>
                                      <p className="font-medium">
                                        {parseCurrency(Math.abs(option.price))}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </Label>
                              <Stepper
                                max={max}
                                min={min}
                                value={quantity}
                                onChange={(value) => handleSelectOption(option, category, value)}
                              />
                            </div>
                          );
                        })
                      ) : (
                        // Radio group case
                        <RadioGroup
                          defaultValue={formData.options?.[category.title]?.options[0]?.title}
                          onValueChange={(value) => {
                            const selectedOption = category.options.find(
                              (opt) => opt.title === value,
                            );

                            if (selectedOption) {
                              handleSelectOption(selectedOption, category);
                            }
                          }}
                        >
                          <div className="flex flex-col gap-4">
                            {category.options.map((option) => (
                              <div key={option.title} className="flex items-center gap-x-3">
                                <RadioGroupItem id={option.title} value={option.title} />
                                <Label className="w-full" htmlFor={option.title}>
                                  <div className="flex w-full items-center justify-between gap-2">
                                    <p>{option.title}</p>
                                    {Boolean(option.price) && (
                                      <div className="flex items-center gap-1">
                                        <p className="text-muted-foreground">
                                          {option.price < 0 ? "-" : "+"}
                                        </p>
                                        <p className="font-medium">
                                          {parseCurrency(Math.abs(option.price))}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}
                      {category.condition ? (
                        <div className="text-sm text-muted-foreground">
                          {(() => {
                            const condition = parseCondition(category.condition);

                            if (!condition) return null;

                            const totalQuantity =
                              formData.options?.[category.title]?.options.reduce(
                                (sum, opt) => sum + (opt.quantity || 0),
                                0,
                              ) || 0;

                            switch (condition.operator) {
                              case "=":
                                const remaining = condition.value - totalQuantity;

                                return remaining === 0
                                  ? "✓ Cantidad correcta"
                                  : `Seleccione ${remaining} más`;
                              case ">":
                                return totalQuantity > condition.value
                                  ? "✓ Cantidad correcta"
                                  : `Seleccione más de ${condition.value}`;
                              case "<":
                                return totalQuantity < condition.value
                                  ? "✓ Cantidad correcta"
                                  : `Seleccione menos de ${condition.value}`;
                              default:
                                return null;
                            }
                          })()}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <SheetFooter>
          <div className="flex w-full flex-col gap-4">
            <hr />
            <div className="flex items-center justify-between text-lg font-medium">
              <p>Total</p>
              <p>{total}</p>
            </div>
            <Button
              className="w-full"
              disabled={!validateConditions()}
              size="lg"
              variant="brand"
              onClick={() => {
                if (validateConditions()) {
                  onSubmit(formData);
                }
              }}
            >
              {validateConditions() ? "Agregar al pedido" : "Complete las opciones requeridas"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default CartItemDrawer;
