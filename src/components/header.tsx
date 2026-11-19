import type {Store} from "@/modules/store/types";

import Link from "next/link";

import Whatsapp from "./icons/whatsapp";
import Instagram from "./icons/instagram";
import {Cuenta} from "./cuenta";
import {MenuPrincipal} from "./menu-principal";

const MENSAJES = ["Cocina saludable", "Materias primas de primera calidad", "Producción fresca", "Menú nuevo cada semana"];

function BarraMensajes() {
  const fila = (copia: boolean) => (
    <div aria-hidden={copia} className={`flex shrink-0 items-center ${copia ? "md:hidden" : "md:[&>span:last-child>span:last-child]:hidden"}`}>
      {MENSAJES.map((m) => (
        <span key={m} className="flex items-center whitespace-nowrap">
          <span className="px-4 md:px-5">{m}</span>
          <span className="text-orange-400">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden bg-[#1f1b16] py-2 font-poppins text-xs font-semibold tracking-wide text-white md:text-sm">
      <div className="aibeh-marquee flex w-max md:w-full md:justify-center">
        {fila(false)}
        {fila(true)}
      </div>
    </div>
  );
}

export function Header({store}: {store: Store}) {
  return (
    // Ocupa todo el ancho de la pantalla aunque la web esté centrada.
    <header className="ml-[calc(50%-50vw)] w-screen" id="inicio">
      <BarraMensajes />
      <div className="border-b border-[#e2d9bc] bg-[#f0ead3] px-4">
        <div className="mx-auto grid max-w-screen-xl grid-cols-[1fr_auto_1fr] items-center gap-4 py-3 text-sm text-black md:px-4">
          <div className="flex items-center gap-3 md:gap-4">
            <MenuPrincipal instagram={store.instagram} whatsapp={store.whatsapp} />
            <Link
              className="flex items-center gap-2 transition hover:opacity-60"
              href={store.instagram}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Instagram />
              <span className="hidden md:block">{store.instagram.split("/")[3]}</span>
            </Link>
            <Link
              className="flex items-center gap-2 transition hover:opacity-60"
              href={store.whatsapp}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Whatsapp />
              <span className="hidden md:block">
                {store.phone.slice(3, 5)} {store.phone.slice(5, 9)}-{store.phone.slice(9)}
              </span>
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="AIBEH" className="h-7 w-auto select-none md:h-9" draggable={false} src="/assets/aibeh-logo.png" />
          <div className="flex justify-end">
            <Cuenta telefono={store.phone} />
          </div>
        </div>
      </div>
    </header>
  );
}
