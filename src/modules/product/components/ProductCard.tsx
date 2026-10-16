"use client";

import type {Product} from "../types";

import {ImageOff} from "lucide-react";

import {parseCurrency} from "~/currency/utils";

const CASH_DISCOUNT_RATE = 0.1;

function ProductCard({product}: {product: Product}) {
  const cashPrice = Math.round(product.price * (1 - CASH_DISCOUNT_RATE));

  return (
    <div
      key={product.id}
      className="border-white/300 flex items-center justify-between gap-3 rounded-md border bg-muted"
      data-testid="product"
    >
      <div className="flex h-full w-full gap-4 p-4">
        <div className="flex w-full flex-col justify-between gap-1">
          <div className="flex flex-col gap-1">
            <p className="line-clamp-[1] font-medium sm:line-clamp-[2]">{product.title}</p>
            <p className="line-clamp-[2] text-sm text-muted-foreground sm:line-clamp-3">
              {product.description}
            </p>
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <p className="text-sm">
              <span className="font-medium text-foreground">{parseCurrency(product.price)}</span>{" "}
              <span className="text-xs text-muted-foreground">Transferencia</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold text-incentive">{parseCurrency(cashPrice)}</span>{" "}
              <span className="text-xs font-medium text-incentive">Efectivo</span>
            </p>
          </div>
        </div>
        <div className="relative h-24 w-24 min-w-24 sm:h-36 sm:w-36 sm:min-w-36">
          {product.image ? (
            <img
              alt={product.title}
              className="aspect-square h-full w-full rounded-md bg-muted/50 object-cover"
              loading="lazy"
              src={product.image}
            />
          ) : (
            <div className="flex aspect-square h-full w-full items-center justify-center rounded-md bg-muted/50">
              <ImageOff className="m-auto h-12 w-12 opacity-10 sm:h-16 sm:w-16" />
            </div>
          )}
          <span className="absolute left-1.5 top-1.5 rounded-md bg-green-700 px-1.5 py-0.5 text-[11px] font-semibold leading-tight text-white">
            -10%
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
