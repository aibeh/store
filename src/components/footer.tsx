import type {Store} from "~/store/types";

import Link from "next/link";

import Whatsapp from "./icons/whatsapp";
import Instagram from "./icons/instagram";

export function Footer({store}: {store: Store}) {
  return (
    <footer className="-mx-4 bg-neutral-800 px-4 py-12 text-center text-neutral-200">
      <p className="font-script text-5xl leading-none text-brand-400">aibeh.</p>
      <p className="mb-7 mt-1 font-heading text-base tracking-[.12em] text-brand-400">
        Comer rico y sano, nunca fue tan fácil
      </p>

      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 font-poppins text-sm font-semibold text-white transition hover:bg-white/20"
          href={store.instagram}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Instagram size={18} />
          {store.instagram.split("/")[3]}
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 font-poppins text-sm font-semibold text-white transition hover:bg-white/20"
          href={store.whatsapp}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Whatsapp size={18} />
          {store.phone.slice(3, 5)} {store.phone.slice(5, 9)}-{store.phone.slice(9)}
        </Link>
      </div>

      <p className="mb-6 font-poppins text-sm leading-loose text-neutral-400">
        📍 Bernal, Quilmes - Buenos Aires.
      </p>

      <hr className="mx-auto my-6 w-10 border-white/15" />

      <p className="font-poppins text-xs text-neutral-500">
        © {new Date().getFullYear()} {store.title}. Todos los derechos reservados.
      </p>
    </footer>
  );
}
