import type {Store} from "~/store/types";

import Image from "next/image";

const EVOLUTION = [
  {
    icon: "🍽️",
    label: "+2.000 viandas mensuales",
    description: "Que se convierten en almuerzos y cenas en la mesa de nuestros clientes",
  },
  {
    icon: "👨‍🍳",
    label: "Hoy",
    description: "Cocina 100% equipada y equipo fijo comprometido con cada detalle",
  },
  {
    icon: "🎯",
    label: "Nuestra misión",
    description: "Que comer rico y sano deje de ser un esfuerzo y sea parte natural de tu semana",
  },
];

export function AboutAgus({store}: {store: Store}) {
  return (
    <section className="border-t-2 border-foreground/20 py-16">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center font-heading text-4xl tracking-wide">Sobre Nosotros</h2>
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start">
          <div>
            <Image
              alt="Agus y Bauti — fundadores de AIBEH"
              className="rounded-full object-cover"
              height={220}
              src={store.logo}
              width={220}
            />
          </div>
          <div className="w-full flex-1 text-center md:text-left">
            <h3 className="mb-3 font-poppins text-xl font-bold">Somos Agus y Bauti 👋</h3>
            <p className="mb-4 text-muted-foreground">
              Todo empezó en la cocina de nuestro primer departamento en el 2024. Agus, estudiante de
              Nutrición, y Bauti, Profesor de Educación Física, con una misión en común: que comer
              rico y sano deje de ser un esfuerzo y se convierta en parte natural de tu semana.
            </p>
            <p className="mb-4 text-muted-foreground">
              Con el correr del tiempo, AIBEH se convirtió en nuestra mini empresa familiar. Detrás de
              cada vianda que recibís hay un equipo de personas trabajando con el mismo cuidado de
              siempre — en la cocina, en la logística y en cada detalle para que llegue perfecta a tu
              mesa. 💚
            </p>
            <ul className="mb-4 flex flex-col gap-2 text-muted-foreground">
              <li className="relative pl-5">
                <span className="absolute left-0 top-1 text-[.6rem] text-brand-500">✦</span>
                Cocina equipada profesionalmente.
              </li>
              <li className="relative pl-5">
                <span className="absolute left-0 top-1 text-[.6rem] text-brand-500">✦</span>
                Control nutricional en cada preparación.
              </li>
              <li className="relative pl-5">
                <span className="absolute left-0 top-1 text-[.6rem] text-brand-500">✦</span>
                Equipo comprometido con la alimentación saludable.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Gracias a quienes confían en nosotros día a día — son la razón por la que seguimos
              creciendo. 💚
            </p>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-8 rounded-xl bg-secondary px-8 py-6">
          {EVOLUTION.map((item) => (
            <div key={item.label} className="min-w-[140px] flex-1 text-center">
              <div className="mb-2 text-2xl">{item.icon}</div>
              <p className="font-poppins text-sm font-semibold">{item.label}</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
