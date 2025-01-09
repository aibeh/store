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
              Estudiante de Lic. Nutrición en la UBA, y mi misión es ayudarte a incorporar hábitos
              alimenticios más saludables a tu vida. A través de nuestras Viandas AIBEH, quiero
              ofrecerte opciones deliciosas, nutritivas y, sobre todo, fáciles de incluir en tu
              rutina diaria.
            </p>
            <p className="mb-6 text-muted-foreground">
              En AIBEH, nos comprometemos a brindarte porciones variadas, reales y completas para
              acompañarte a lo largo de tu jornada. Mi objetivo es ser parte de tu proceso hacia una
              alimentación más consciente, para que te sientas mejor, más energizado y saludable.
            </p>
            <p className="mb-6 text-muted-foreground">
              Además, cuento con un excelente equipo que ayuda para que todo esto sea posible:
            </p>
            <ul className="mb-6 flex list-disc flex-col gap-4 text-muted-foreground">
              <li>
                Bauti, mi novio y Prof. de Educación Física, se encarga de las redes sociales, la
                logística y la gestión de proveedores, asegurando que todo funcione de manera
                perfecta. Eso sí, ¡en la cocina no pisa! 😄
              </li>
              <li>
                Eli, mi increíble ayudante de cocina, comparte mi pasión por una alimentación
                equilibrada y siempre aporta su toque de creatividad y perfección a cada receta.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Si llegaste hasta acá, ¡Gracias por confiar en AIBEH!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
