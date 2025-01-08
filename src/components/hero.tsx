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
      <div className="relative flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="mb-2 text-4xl font-light shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] drop-shadow-2xl">
          Comer rico y sano, nunca fue tan fácil
        </h1>
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-white" />
          <h2 className="text-lg font-medium tracking-wide">VIANDAS SALUDABLES</h2>
          <div className="h-px w-12 bg-white" />
        </div>
      </div>
    </div>
  );
}
