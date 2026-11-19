"use client";

import {useState} from "react";
import {ArrowRight, Menu, X} from "lucide-react";

import {Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet";

import Whatsapp from "./icons/whatsapp";
import Instagram from "./icons/instagram";

const SECCIONES = [
  ["Inicio", "#inicio"],
  ["¿Cómo funciona?", "#como-funciona"],
  ["Hacé tu pedido", "#hace-tu-pedido"],
  ["Preguntas frecuentes", "#preguntas-frecuentes"],
  ["Opiniones", "#opiniones"],
  ["Sobre nosotros", "#nosotros"],
] as const;

export function MenuPrincipal({instagram, whatsapp}: {instagram: string; whatsapp: string}) {
  const [open, setOpen] = useState(false);

  // El menú bloquea el scroll mientras está abierto: primero se cierra y después se baja a la sección.
  function ir(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => {
      const destino = href === "#inicio" ? document.body : document.querySelector(href);

      destino?.scrollIntoView({behavior: "smooth", block: "start"});
      history.replaceState(null, "", href);
    }, 550);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label="Abrir menú" className="-ml-1 rounded-full p-1 transition hover:bg-black/5" type="button">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        className="flex w-[85%] flex-col bg-[#f0ead3] p-0 sm:max-w-sm"
        side="left"
      >
        <div className="flex items-center justify-between border-b border-[#e2d9bc] px-5 py-4">
          <SheetTitle className="sr-only">Menú</SheetTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="AIBEH" className="h-7 w-auto" src="/assets/aibeh-logo.png" />
          <SheetClose aria-label="Cerrar menú" className="rounded-full p-1 hover:bg-black/5">
            <X className="h-6 w-6" />
          </SheetClose>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="divide-y divide-[#e2d9bc]">
            {SECCIONES.map(([texto, href]) => (
              <li key={href}>
                <a
                  className="flex items-center justify-between py-4 font-heading text-3xl tracking-wide text-[#1f1b16] transition hover:text-orange-600"
                  href={href}
                  onClick={(e) => ir(e, href)}
                >
                  {texto}
                  <ArrowRight className="h-5 w-5 opacity-40" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-[#e2d9bc] px-5 py-5">
          <a
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1f1b16] py-3.5 font-poppins font-semibold text-white"
            href="#hace-tu-pedido"
            onClick={(e) => ir(e, "#hace-tu-pedido")}
          >
            Comprar <ArrowRight className="h-4 w-4" />
          </a>
          <div className="flex justify-center gap-6 pt-1 text-sm text-black">
            <a className="flex items-center gap-2 hover:opacity-60" href={instagram} rel="noopener noreferrer" target="_blank">
              <Instagram size={20} /> Instagram
            </a>
            <a className="flex items-center gap-2 hover:opacity-60" href={whatsapp} rel="noopener noreferrer" target="_blank">
              <Whatsapp /> WhatsApp
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
