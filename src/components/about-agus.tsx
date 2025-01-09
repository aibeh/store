import type {Store} from "~/store/types";

import Image from "next/image";

export function AboutAgus({store}: {store: Store}) {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-12 md:flex-row">
          <div>
            <Image alt="Agus" className="rounded-full" height={300} src={store.logo} width={300} />
          </div>
          <div className="w-full flex-1 text-center md:text-left">
            <h2 className="mb-4 text-3xl font-light">¡Hola! Soy Agus :)</h2>
            <p className="mb-4 text-muted-foreground">
              Estudiante de Lic. Nutrición (UBA). Mi misión es ayudarte a adoptar hábitos
              alimenticios más saludables, brindándote opciones ricas, nutritivas, y sobre todo,
              fáciles de incorporar en tu vida diaria a través de nuestras Viandas AIBEH.
            </p>
            <p className="mb-6 text-muted-foreground">
              Aibeh, tiene el compromiso de ofrecer porciones variadas, reales y completas para
              acompañarte en tu día a día. Mi objetivo no es solo ofrecerte un producto, sino
              acompañarte en el camino de una alimentación más consciente, para que puedas sentirte
              mejor, más energizado y saludable.
            </p>
            <ul className="mb-6 flex list-disc flex-col gap-4 text-muted-foreground">
              <li>
                Bauti, mi novio y Prof. de Educación Física, se encarga de las redes, logística y
                proveedores. Su dedicación asegura que todo funcione de manera fluida. Pero... No
                pisa la cocina... jaja!
              </li>
              <li>
                Eli, mi increíble ayudante de cocina, comparte mi pasión por la buena alimentación y
                siempre está dispuesta a aportar su toque de creatividad y perfección en cada
                receta.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Si llegaste hasta acá, ¡Gracias por confiar en Aibeh!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
