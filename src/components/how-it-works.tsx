import {WeeklyMenuPopup} from "./weekly-menu-popup";

const STEPS = [
  {
    emoji: "✅",
    title: "Elegís tu pack",
    description: "Packs de 5, 10 o 15 viandas",
  },
  {
    emoji: "🧡",
    title: "Seleccionas las viandas que más te gusten",
    description: "Combinalas libremente",
  },
  {
    emoji: "📱",
    title: "Envias el pedido por WhatsApp",
    description: "Te confirmamos el pedido",
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
          elegir el <span className="font-medium">Pack</span> que desees y combinarlo libremente con las
          opciones que más te gusten (¡si, podes repetirlas sin problema!). Al momento de hacer el pedido,
          tenés la opción de agrandar tus viandas.
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
          Tomamos pedidos de <span className="font-medium">Viernes</span> a{" "}
          <span className="font-medium">Domingo</span>, y realizamos las{" "}
          <span className="italic">entregas los días</span>{" "}
          <span className="font-medium">Miércoles</span> (Wilde, Don Bosco, Bernal y Quilmes) y{" "}
          <span className="font-medium">Jueves</span> (Berazategui y Hudson) de{" "}
          <span className="font-medium">17:00 a 21:00 Hs.</span>
        </p>

        <div className="mx-auto mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-lg bg-secondary p-3 text-center sm:p-6">
              <span className="mb-1 block text-xl sm:mb-2 sm:text-2xl">{step.emoji}</span>
              <h3 className="mb-1 text-xs font-semibold leading-snug sm:text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">{step.description}</p>
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
