export function HowItWorks() {
  return (
    <section className="py-12">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-8 text-3xl font-light text-foreground">
          ¿Cómo funciona AIBEH?
        </h2>

        <p className="mb-4 text-muted-foreground">
          En AIBEH ofrecemos un <span className="font-medium">menú saludable</span> con{" "}
          <span className="font-medium">6 opciones</span> que se renueva todas las semanas.
        </p>

        <p className="mb-4 text-muted-foreground">
          Podés elegir <span className="font-medium">packs de 5, 10 o 15 viandas</span>, combinando
          libremente las opciones que más te gusten (¡podés repetir tus favoritas sin problema!).
        </p>

        <p className="mb-8 text-muted-foreground">
          Al momento de hacer el pedido, también tenés la opción de{" "}
          <span className="font-medium">agrandar tu vianda</span>.
        </p>

        <div className="mb-6">
          <h3 className="mb-2 font-medium text-foreground">📅 Pedidos</h3>
          <p className="text-muted-foreground">
            Tomamos pedidos de <span className="font-medium">viernes a domingo</span>.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 font-medium text-foreground">🚚 Entregas a domicilio</h3>
          <p className="text-muted-foreground">
            <span className="font-medium">Miércoles:</span> Wilde, Don Bosco, Bernal y Quilmes
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Jueves:</span> Berazategui y Hudson
          </p>
          <p className="mt-1 text-muted-foreground">
            ⏰ Horario de entrega:{" "}
            <span className="font-medium">18:00 a 21:00 hs</span>
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-medium text-foreground">📍 Retiro por punto fijo</h3>
          <p className="text-muted-foreground">
            También podés retirar tu pedido por{" "}
            <span className="font-medium">Bernal Centro o Wilde</span>, los{" "}
            <span className="font-medium">jueves de 19:00 a 20:00 hs</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
