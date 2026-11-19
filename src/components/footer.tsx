import type {Store} from "~/store/types";

import Link from "next/link";

import Whatsapp from "./icons/whatsapp";
import Instagram from "./icons/instagram";
import {FondoDibujos} from "./fondo-dibujos";

export function Footer({store}: {store: Store}) {
  return (
    // Naranja de la marca, que aparece difuminado desde el beige (como las otras franjas).
    <footer className="relative isolate ml-[calc(50%-50vw)] w-screen bg-[linear-gradient(to_bottom,#f0ead3_0,#F3A14B_170px,#F3A14B_100%)] px-4 pb-12 pt-40 text-center text-[#1f1b16]">
      <FondoDibujos />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="aibeh." className="mx-auto h-12 w-auto" src="/assets/aibeh-logo.png" />
      <p className="mb-7 mt-2 font-heading text-base tracking-[.12em] text-[#1f1b16]">
        Comer rico y sano, nunca fue tan fácil
      </p>

      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-[#1f1b16]/15 bg-white/40 px-5 py-2 font-poppins text-sm font-semibold text-[#1f1b16] transition hover:bg-white/60"
          href={store.instagram}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Instagram size={18} />
          {store.instagram.split("/")[3]}
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-[#1f1b16]/15 bg-white/40 px-5 py-2 font-poppins text-sm font-semibold text-[#1f1b16] transition hover:bg-white/60"
          href={store.whatsapp}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Whatsapp size={18} />
          {store.phone.slice(3, 5)} {store.phone.slice(5, 9)}-{store.phone.slice(9)}
        </Link>
      </div>

      <p className="mb-6 font-poppins text-sm leading-loose text-[#1f1b16]/75">
        📍 Bernal, Quilmes - Buenos Aires.
      </p>

      <hr className="mx-auto my-6 w-10 border-[#1f1b16]/20" />

      <p className="font-poppins text-xs text-[#1f1b16]/60">
        © {new Date().getFullYear()} {store.title}. Todos los derechos reservados.
      </p>
    </footer>
  );
}
