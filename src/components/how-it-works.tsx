import {WeeklyMenuPopup} from "./weekly-menu-popup";

const STEPS = [
  {
    emoji: "✅",
    title: "Elegís tu pack",
    description: "Packs de 5, 10 o 15 viandas",
  },
  {
    emoji: "🧡",
    title: "Seleccionás las viandas que más te gustan",
    description: "Combinalas libremente entre las 6 opciones que ofrecemos",
  },
  {
    emoji: "📱",
    title: "Enviás el pedido por WhatsApp",
    description: "Te confirmamos el pedido y los datos de pago",
  },
  {
    emoji: "🛵",
    title: "Entrega a domicilio",
    description: "Miércoles / Jueves según tu zona",
  },
];

export function HowItWorks({weeklyMenu}: {weeklyMenu: string[]}) {
  return (
    <section className="py-12">
      <div className="container mx-auto text-center">
        <h2 className="mb-8 font-heading text-4xl tracking-wide text-foreground">
          ¿Cómo funciona AIBEH?
        </h2>
        <p className="mx-auto max-w-3xl text-muted-foreground">
          En AIBEH, ofrecemos un <span className="font-medium">Menú saludable</span> con{" "}
          <span className="font-medium">6 (seis)</span> opciones que se renueva todas las semanas. Podes
          elegir entre <span className="font-medium">Packs  de 5, 10 o 15 viandas</span> , combinando libremente las
          opciones que más te gusten (¡podes repetir tus favoritas sin problema!). Al momento de hacer el pedido, tenes la opción de agrandar tus viandas.
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
          Tomamos pedidos de <span className="font-medium">Viernes</span> a{" "}
          <span className="font-medium">Domingo</span>, y realizamos las{" "}
          <span className="italic">entregas a domicilio los días</span>{" "}
          <span className="font-medium">Miércoles</span> (Wilde, Don Bosco, Bernal y Quilmes) y{" "}
          <span className="font-medium">Jueves</span> (Berazategui y Hudson) de{" "}
          <span className="font-medium">18:00 a 21:00 hs.</span>
        </p>

        <div className="mx-auto mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-lg bg-secondary p-6 text-center">
              <span className="mb-2 block text-2xl">{step.emoji}</span>
              <h3 className="mb-1 text-sm font-semibold leading-snug">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        {Boolean(weeklyMenu.length) && (
          <div className="mt-10">
            <WeeklyMenuPopup items={weeklyMenu} />
          </div>
        )}
      </div>
    </section>
  );
}
