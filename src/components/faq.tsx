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
    answer: "Aceptamos transferencia bancaria, efectivo y Cuenta DNI (tenés reintegro por cada compra 😎).",
  },
  {
    question: "¿Cuáles son sus zonas de entrega?",
    answer:
      "Nos manejamos exclusivamente con entregas a domicilio. Los días Miércoles entregamos en Zona Sur: Bernal centro y alrededores entre las 17 y 19 hs. · Quilmes centro y alrededores entre las 19 y 21 hs. · Wilde y alrededores entre las 20 y 21 hs. Los días Jueves entregamos en Berazategui y Hudson: entre las 19 y 21 hs.",
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
                    "max-h-[320px] pb-4": isOpen,
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
