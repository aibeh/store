import type {Store} from "~/store/types";

import {ArrowRight} from "lucide-react";

export function Hero({store}: {store: Store}) {
  return (
    // Ocupa la pantalla hasta abajo (descontando la barra y el encabezado), como giapura.
    <div className="relative ml-[calc(50%-50vw)] h-[calc(100svh-100px)] min-h-[520px] w-screen md:h-[calc(100vh-110px)]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${store.banner})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        {/* Difuminado hacia el beige de la marca (como giapura) */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#f0ead3]/60 to-[#f0ead3]" />
      </div>
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-3 font-heading text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] tracking-wide drop-shadow-[0_2px_20px_rgba(0,0,0,.5)]">
          Comer rico y sano, nunca fue tan fácil
        </h1>
        <div className="flex items-center gap-4 font-poppins text-sm font-bold uppercase tracking-[.18em]">
          <div className="h-px w-12 bg-white" />
          <h2>Viandas Saludables</h2>
          <div className="h-px w-12 bg-white" />
        </div>
        <a
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#f0ead3] px-9 py-4 font-poppins text-lg font-semibold text-[#1f1b16] shadow-[0_10px_30px_rgba(0,0,0,.25)] transition hover:-translate-y-0.5 hover:bg-white"
          href="#hace-tu-pedido"
        >
          Comprar <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
