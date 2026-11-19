import Image from "next/image";

// Dibujitos de fondo (los de "Hacé tu pedido"), muy sutiles y a todo el ancho de la pantalla.
// Va dentro de una sección con "relative isolate".
export function FondoDibujos() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden"
    >
      <Image
        fill
        alt=""
        className="select-none object-cover opacity-[0.03] mix-blend-multiply"
        sizes="100vw"
        src="/assets/order-bg-deco.webp"
      />
    </div>
  );
}
