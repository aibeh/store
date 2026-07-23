"use client";

import {useState} from "react";
import {ChevronDown} from "lucide-react";

import {cn} from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "¿Cuánto contiene cada vianda? ¿Qué significa que se pueden agrandar?",
    answer:
      "Cada vianda contiene entre 350 - 400 g. Podés agrandar el pack de viandas por un monto adicional, y cada vianda va a contener (+) 200 g.",
  },
  {
    question: "¿Hasta cuándo puedo hacer mi pedido?",
    answer:
      "Tomamos pedidos de viernes a domingo. Si hacés tu pedido antes del domingo a la noche, lo recibís esa semana en tu zona.",
  },
  {
    question: "¿Puedo repetir la misma vianda en un pack?",
    answer:
      "¡Sí! Podés combinar libremente y repetir tus favoritas sin problema. Si querés 5 veces el mismo plato, no hay problema. De igual modo, te recomendamos variar.",
  },
  {
    question: "¿Las viandas se pueden freezar?",
    answer:
      "¡Sí! Si bien todas nuestras viandas son suuper frescas, la mayoría son aptas freezer, salvo aquellas que tienen ensaladas.",
  },
  {
    question: "¿Cuáles son los métodos de pago?",
    answer: (
      <ul className="list-disc space-y-1 pl-4">
        <li>Efectivo (10% OFF)</li>
        <li>Transferencia bancaria</li>
        <li>Cuenta Dni (Tenes reintegro por cada compra)</li>
      </ul>
    ),
  },
  {
    question: "¿Cuáles son sus zonas de entrega?",
    answer: (
      <div className="flex flex-col gap-2">
        <div>
          <p className="font-semibold text-foreground">Miércoles</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Bernal y alrededores (17:00 a 19:00)</li>
            <li>Quilmes y alrededores (19:00 a 21:00)</li>
            <li>Wilde y alrededores (20:00 a 21:00)</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-foreground">Jueves</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Berazategui y Hudson (19:00 a 21:00)</li>
          </ul>
        </div>
      </div>
    ),
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t-2 border-foreground/20 px-4 py-12">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center font-heading text-4xl tracking-wide">
          Preguntas frecuentes
        </h2>
        <div className="mx-auto max-w-2xl">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question} className="border-b">
                <button
                  className="flex w-full items-center justify-between gap-2 py-4 text-left text-sm font-medium sm:text-base"
                  onClick={() => {
                    setOpenIndex(isOpen ? null : index);
                  }}
                >
                  {item.question}
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", {
                      "rotate-180": isOpen,
                    })}
                  />
                </button>
                <div
                  className={cn("overflow-hidden text-sm leading-relaxed text-muted-foreground transition-[max-height,padding-bottom]", {
                    "max-h-[480px] pb-4": isOpen,
                    "max-h-0": !isOpen,
                  })}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
