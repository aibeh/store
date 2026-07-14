import type {Store} from "~/store/types";

export function Hero({store}: {store: Store}) {
  return (
    <div className="relative h-[500px] w-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${store.banner})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
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
      </div>
    </div>
  );
}
