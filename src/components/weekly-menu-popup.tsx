"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {X} from "lucide-react";

export function WeeklyMenuPopup({items}: {items: string[]}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3 font-poppins text-sm font-semibold text-white/90 shadow-lg transition hover:bg-brand-600">
          🥗 Conocé el menú de esta semana
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[300] bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[300] w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="sr-only">Menú semanal</Dialog.Title>
          <div className="relative">
            <Dialog.Close className="absolute -right-3.5 -top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-lg transition hover:bg-secondary">
              <X className="h-4 w-4" />
            </Dialog.Close>
            <div className="max-h-[88vh] overflow-y-auto rounded-2xl bg-[#1a1a1a] shadow-[0_24px_60px_rgba(0,0,0,.6)] [scrollbar-width:none]">
              <div className="bg-white/[.04] px-5 pb-2 pt-5">
                <p className="font-heading text-3xl leading-none tracking-wide text-white">
                  Menú Semanal
                </p>
                <p className="mt-1 font-poppins text-[.65rem] uppercase tracking-[.12em] text-white/65">
                  Tomamos pedidos de viernes a domingo
                </p>
              </div>

              <div className="flex flex-col gap-3.5 px-5 pb-4 pt-5">
                {items.map((title, index) => (
                  <div key={title} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 font-poppins text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="font-poppins text-sm font-bold leading-snug text-white">{title}</p>
                  </div>
                ))}
              </div>

              <div className="my-3 text-center">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#f3a14b] bg-orange-50 px-3.5 py-1 font-poppins text-xs font-semibold text-[#c27a1e]">
                  💵 10% OFF pagando en efectivo
                </span>
              </div>
              <p className="border-t border-white/10 px-5 pb-4 pt-3 text-center font-poppins text-[.6rem] font-bold uppercase tracking-[.2em] text-white/40">
                Comer rico y sano, nunca fue tan fácil
              </p>
            </div>
            <p className="mt-3 text-center font-poppins text-xs text-white/70">
              Tocá fuera de la tarjeta para cerrar
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
