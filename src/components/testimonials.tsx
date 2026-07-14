const TESTIMONIALS = [
  {
    text: "Entre el trabajo, los chicos y el gimnasio no me quedaba tiempo para cocinar. Empecé con sus viandas y hoy no me quiero imaginar una semana sin vianditasssss jajajaja. Me salvan... Llego a casa, caliento y comemos.",
    author: "Alejandra",
    zone: "Quilmes",
  },
  {
    text: "Realmente probé un montón de viandas antes de llegar a ustedes. Algunas estaban ricas pero las porciones eran chicas, otras al revés. Acá encontré el equilibrio justo. Se ganaron una clienta fija.",
    author: "Maga F.",
    zone: "Quilmes",
  },
  {
    text: "Una de las cosas que más valoro es la buena onda de ustedes y la garra que le ponen al negocio. Siempre llegan en el horario que dicen y si tengo alguna duda me responden sin importar horario. Se nota el amor que le ponen a todo! Los felicito.",
    author: "Bárbara",
    zone: "Bernal",
  },
];

export function Testimonials() {
  return (
    <section className="border-t-2 border-foreground/20 px-4 py-12">
      <div className="container mx-auto">
        <div className="mb-6 text-center">
          <h2 className="font-heading text-4xl tracking-wide">Lo que dicen nuestros clientes</h2>
          <p className="font-script text-3xl text-muted-foreground">
            Cada semana, más personas confían en nosotros 🧡
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.author} className="rounded-lg border p-5">
              <div className="mb-2 text-amber-500">★★★★★</div>
              <p className="mb-3 text-sm italic leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <p className="text-sm font-semibold">{testimonial.author}</p>
              <p className="text-xs text-muted-foreground/70">{testimonial.zone}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
