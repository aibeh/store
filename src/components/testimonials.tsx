"use client";

import {useRef, useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";

import {cn} from "@/lib/utils";

const TESTIMONIALS: {text: string; author: string; zone?: string}[] = [
  {
    text: "Hola! Quería decirles que ya probé varias viandas y la verdad estoy re contenta. Son súper abundantes, tienen muchísimo sabor y se nota que usan ingredientes de buena calidad. Me están salvando un montón en la semana. ❤️",
    author: "Alejandra",
    zone: "Quilmes",
  },
  {
    text: "Realmente probé un montón de viandas antes de llegar a ustedes. Algunas estaban ricas pero las porciones eran chicas, otras al revés. Acá encontré el equilibrio justo. Se ganaron una clienta fija.",
    author: "Magali",
    zone: "Quilmes",
  },
  {
    text: "Una de las cosas que más valoro es la buena onda de ustedes y la garra que le ponen al negocio. Siempre llegan en el horario que dicen y si tengo alguna duda me responden sin importar horario. Se nota el amor que le ponen a todo! Los felicito.",
    author: "Bárbara",
    zone: "Bernal",
  },
  {
    text: "Recién almorcé la primera vianda y necesitaba escribirles. Qué rica estaba! Sinceramente me sorprendio que tenga tanto sabor, y a la vez, sea saludable. Graciassss!",
    author: "Silvana",
  },
  {
    text: "Hace un mes que les compro y la diferencia es enorme. Estoy comiendo mucho mejor, ahorro un montón de tiempo y nunca me canso porque el menú cambia todas las semanas. Los felicito por el trabajo que hacen.",
    author: "Micaela",
  },
  {
    text: "Quería agradecerles porque hacía mucho que buscaba unas viandas saludables que realmente fueran ricas. Siempre llegan impecables, las porciones son generosas y se nota el cuidado en cada detalle.",
    author: "Andrea",
  },
  {
    text: "Ya probé casi todas las opciones y no hubo una sola que no me gustara. Se sienten caseras, bien condimentadas y nada secas. Además, recalientan perfecto. Son lo mas chicos!",
    author: "Matias",
  },
  {
    text: "Solo quería contarles que ya convencí a mi marido de comer las viandas conmigo. 😂 Al principio decía que se iba a quedar con hambre y ahora cada vez que abrimos el freezer me pregunta cuál toca hoy.",
    author: "Viviana",
  },
  {
    text: "Lo que más me gusta es que puedo comer rico sin tener que pensar qué cocinar todos los días. Llego del trabajo, caliento la vianda y en cinco minutos estoy almorzando. Me cambió completamente la rutina.",
    author: "Paula",
  },
  {
    text: "Gracias por hacer que comer saludable sea tan fácil. Se nota el amor y el tiempo que le ponen a cada preparación. Da gusto encontrar un servicio así.",
    author: "Jorge",
  },
];

const AVATAR_COLORS = ["bg-brand-500", "bg-secondary text-foreground", "bg-foreground/80"];

function TestimonialCard({testimonial, index}: {testimonial: (typeof TESTIMONIALS)[number]; index: number}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-[280px] shrink-0 snap-start rounded-lg border bg-background p-5 sm:w-[320px]">
      <div className="mb-2 text-amber-500">★★★★★</div>
      <p
        className={cn("mb-1 text-sm italic leading-relaxed text-muted-foreground", {
          "line-clamp-4": !expanded,
        })}
      >
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <button
        className="mb-3 text-sm font-medium underline underline-offset-2"
        onClick={() => {
          setExpanded((value) => !value);
        }}
      >
        {expanded ? "Ver menos" : "Ver más"}
      </button>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
            AVATAR_COLORS[index % AVATAR_COLORS.length],
          )}
        >
          {testimonial.author[0]}
        </div>
        <div>
          <p className="text-sm font-semibold">{testimonial.author}</p>
          {Boolean(testimonial.zone) && (
            <p className="text-xs text-muted-foreground/70">{testimonial.zone}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({left: direction * 300, behavior: "smooth"});
  }

  return (
    <section className="border-t-2 border-foreground/20 px-4 py-12">
      <div className="container mx-auto">
        <div className="mb-6 text-center">
          <h2 className="font-heading text-4xl tracking-wide">Lo que dicen nuestros clientes</h2>
          <p className="font-script text-3xl text-muted-foreground">
            Cada semana, más personas confían en nosotros 🧡
          </p>
        </div>
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={testimonial.author} index={index} testimonial={testimonial} />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            aria-label="Ver testimonios anteriores"
            className="flex h-9 w-9 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-secondary"
            onClick={() => {
              scrollByCard(-1);
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Ver más testimonios"
            className="flex h-9 w-9 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-secondary"
            onClick={() => {
              scrollByCard(1);
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
