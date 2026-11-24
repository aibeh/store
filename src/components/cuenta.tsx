"use client";

// Cuentas de cliente + fueguitos. Los datos vienen de la planilla (hoja "Clientes") a través de /api/cuenta.

import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import {
  Cake,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  Eye,
  EyeOff,
  Flame,
  Gift,
  KeyRound,
  LogOut,
  ShoppingBag,
  User,
  Users,
  X,
} from "lucide-react";

interface PerfilCliente {
  nombre: string;
  usuario: string;
  whatsapp: string;
  fueguitos: number;
  racha: number;
  cumple: { dia: number; mes: number } | null;
  historial: { fecha: string; motivo: string; fueguitos: number }[];
  cupones?: CuponFueguitos[];
  avatar?: string;
}

interface CuponFueguitos {
  codigo: string;
  premio: string;
  tipo: string;
  estado: string;
  fecha?: string;
}

async function api<T = { ok: boolean }>(
  url: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };

  if (!response.ok)
    throw new Error(data.error || "Algo salió mal. Probá de nuevo.");

  return data;
}

function ErrorMsg({ text }: { text: string }) {
  return text ? (
    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {text}
    </p>
  ) : null;
}

const NIVELES = [
  { fuegos: 15, emoji: "🥞", premio: "1 pancake", plata: null },
  {
    fuegos: 30,
    emoji: "🍱",
    premio: "1 vianda + 2 pancakes",
    plata: "$5.000 OFF",
  },
  {
    fuegos: 60,
    emoji: "🍞",
    premio: "2 viandas + 1 pan AIBEH",
    plata: "$10.000 OFF",
  },
  { fuegos: 100, emoji: "🎁", premio: "4 viandas", plata: "$15.000 OFF" },
];

const COMO_SUMAR = [
  { icon: ShoppingBag, titulo: "Cada vianda que pedís", fuegos: "1 🔥 c/u" },
  { icon: Flame, titulo: "4 semanas seguidas pidiendo", fuegos: "+5 🔥" },
  { icon: Gift, titulo: "Fueguitos de bienvenida", fuegos: "+10 🔥" },
  { icon: Users, titulo: "Un amigo pide con tu nombre", fuegos: "+15 🔥" },
  {
    icon: Camera,
    titulo: "Subís una historia y nos etiquetás",
    fuegos: "+5 🔥",
  },
  { icon: Cake, titulo: "Tu cumpleaños", fuegos: "+10 🔥" },
];

const FAQ = [
  [
    "¿Cuándo se acreditan mis fueguitos?",
    "Cuando confirmamos y entregamos tu pedido. Los ves en tu panel esa misma semana.",
  ],
  [
    "¿Cómo canjeo un premio?",
    "Elegís tu premio, confirmás y te damos un cupón único. Lo pegás en “¿Tenés un cupón?” cuando hacés tu pedido y el regalo (o el descuento) se suma solo. Si es una vianda, la elegís del menú de esa semana. Cada cupón sirve una sola vez.",
  ],
  [
    "¿Qué pasa si una semana no pido?",
    "Tus fueguitos no se pierden. Solo se reinicia el contador de racha (las semanas seguidas).",
  ],
  [
    "Me olvidé la contraseña",
    "Escribinos por WhatsApp y te pasamos una nueva al toque.",
  ],
];

type GuestView = "inicio" | "entrar" | "registro" | "registrado";
type Tab = "fueguitos" | "perfil" | "cupones";

export function Cuenta({ telefono }: { telefono: string }) {
  const [open, setOpen] = useState(false);
  const [perfil, setPerfil] = useState<PerfilCliente | null>(null);
  const [guestView, setGuestView] = useState<GuestView>("inicio");
  const [tab, setTab] = useState<Tab>("fueguitos");

  const refrescar = useCallback(async () => {
    try {
      const data = await api<{ perfil: PerfilCliente | null }>(
        "/api/cuenta/perfil",
      );

      setPerfil(data.perfil);
    } catch {
      // Si la planilla no responde, la web sigue funcionando igual.
    }
  }, []);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  // Cada vez que abre el panel, traemos los fueguitos actualizados.
  useEffect(() => {
    if (open && perfil) void refrescar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function login() {
    await refrescar();
    setTab("fueguitos");
  }

  async function logout() {
    await api("/api/cuenta/logout", {}).catch(() => {});
    setPerfil(null);
    setGuestView("inicio");
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {perfil ? (
          <button
            className="flex items-center gap-2 rounded-full border border-foreground/15 py-1 pl-1 pr-3 text-foreground transition hover:border-foreground/40"
            type="button"
          >
            <Avatar perfil={perfil} tamano="chico" />
            <span className="flex items-center gap-1 font-poppins font-semibold">
              <Fueguito className="h-5 w-5" />
              {perfil.fueguitos}
            </span>
          </button>
        ) : (
          <button
            aria-label="Ingresar"
            className="flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-background transition hover:opacity-85"
            type="button"
          >
            <User className="h-4 w-4" />
            <Fueguito className="h-[18px] w-[18px]" />
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-background shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:inset-y-3 sm:right-3 sm:max-w-md sm:rounded-2xl"
        >
          {perfil ? (
            <UserPanel
              perfil={perfil}
              tab={tab}
              telefono={telefono}
              onCambio={refrescar}
              onLogout={logout}
              onTab={setTab}
            />
          ) : (
            <GuestPanel
              view={guestView}
              onLogin={login}
              onView={setGuestView}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ---------- Fueguito (imagen) ---------- */

function Fueguito({
  className = "",
  apagado = false,
}: {
  className?: string;
  apagado?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      className={`${className} ${apagado ? "opacity-30 grayscale" : ""}`}
      draggable={false}
      src="/assets/fueguito.png"
    />
  );
}

/* Barber Chop no trae tildes ni ñ: las dibujamos encima de la letra, sin modificar la fuente. */
const BARBER = { fontFamily: '"Barber Chop", var(--font-bebas), sans-serif' };
const ACENTOS: Record<string, [string, "aguda" | "enie"]> = {
  Á: ["A", "aguda"],
  É: ["E", "aguda"],
  Í: ["I", "aguda"],
  Ó: ["O", "aguda"],
  Ú: ["U", "aguda"],
  Ñ: ["N", "enie"],
};

function BarberText({ text }: { text: string }) {
  return (
    <span aria-label={text} role="text">
      <span aria-hidden="true">
        {Array.from(text.toUpperCase()).map((ch, i) => {
          const acento = ACENTOS[ch];

          if (!acento) return ch;

          return (
            <span key={i} className="relative inline-block">
              {acento[0]}
              {acento[1] === "aguda" ? (
                <span className="absolute left-[55%] top-[-0.2em] h-[0.2em] w-[0.11em] -translate-x-1/2 rotate-[38deg] rounded-[1px] bg-current" />
              ) : (
                <span className="absolute left-1/2 top-[-0.55em] -translate-x-1/2 text-[0.8em] leading-none">
                  ~
                </span>
              )}
            </span>
          );
        })}
      </span>
    </span>
  );
}

/* ---------- Encabezado del panel ---------- */

function PanelHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b px-5 py-4">
      <div className="w-8">
        {onBack ? (
          <button
            aria-label="Volver"
            className="rounded-full p-1 hover:bg-secondary"
            type="button"
            onClick={onBack}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}
      </div>
      <Dialog.Title
        className="pt-1 text-2xl leading-none tracking-wide"
        style={BARBER}
      >
        <BarberText text={title} />
      </Dialog.Title>
      <Dialog.Close
        aria-label="Cerrar"
        className="w-8 rounded-full p-1 hover:bg-secondary"
      >
        <X className="h-5 w-5" />
      </Dialog.Close>
    </div>
  );
}

/* ---------- Visitante (sin cuenta) ---------- */

function GuestPanel({
  view,
  onView,
  onLogin,
}: {
  view: GuestView;
  onView: (v: GuestView) => void;
  onLogin: () => Promise<void>;
}) {
  if (view === "entrar") {
    return (
      <>
        <PanelHeader title="Entrar" onBack={() => onView("inicio")} />
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <LoginForm onLogin={onLogin} />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Todavía no tenés cuenta?{" "}
            <button
              className="font-semibold text-foreground underline"
              type="button"
              onClick={() => onView("registro")}
            >
              Creala en 30 segundos
            </button>
          </p>
        </div>
      </>
    );
  }

  if (view === "registro") {
    return (
      <>
        <PanelHeader title="Crear cuenta" onBack={() => onView("inicio")} />
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <RegisterForm onDone={() => onView("registrado")} />
        </div>
      </>
    );
  }

  if (view === "registrado") {
    return (
      <>
        <PanelHeader title="¡Listo!" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-6 py-8 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-orange-100">
            <Fueguito className="h-11 w-11" />
          </div>
          <h3 className="font-heading text-3xl tracking-wide">
            Ya sos parte de la racha
          </h3>
          <p className="text-muted-foreground">
            En un ratito te mandamos por{" "}
            <span className="font-semibold text-foreground">WhatsApp</span> tu{" "}
            <span className="font-semibold text-foreground">
              usuario y contraseña
            </span>
            .
          </p>
          <div className="w-full rounded-xl bg-secondary p-4 text-left text-sm">
            <p className="mb-1 font-semibold">Mientras tanto…</p>
            <p className="text-muted-foreground">
              Hacé tu pedido normal. Los fueguitos de esta semana te quedan
              guardados igual. 🔥
            </p>
          </div>
          <p className="font-script text-2xl text-muted-foreground">
            Tip: después podés cambiar la contraseña desde tu Perfil.
          </p>
          <button
            className="mt-2 w-full rounded-xl bg-foreground py-3 font-semibold text-background"
            type="button"
            onClick={() => onView("entrar")}
          >
            Ya tengo mis datos, entrar
          </button>
        </div>
      </>
    );
  }

  // inicio
  return (
    <>
      <PanelHeader title="Bienvenido" />
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="relative mt-5 overflow-hidden rounded-2xl bg-foreground px-6 pb-7 pt-8 text-center text-background">
          <div className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-orange-500/40 blur-3xl" />
          <div className="relative mb-4 flex items-end justify-center gap-1">
            <Fueguito className="h-9 w-9 -rotate-12 opacity-80" />
            <Fueguito className="h-16 w-16 drop-shadow-[0_0_20px_rgba(249,115,22,.6)]" />
            <Fueguito className="h-9 w-9 rotate-12 opacity-80" />
          </div>
          <h3 className="relative pt-1 text-4xl leading-[1.15]" style={BARBER}>
            <BarberText text="Sumá fueguitos," />
            <br />
            <BarberText text="pagá menos" />
          </h3>
          <p className="relative mt-3 font-poppins text-base font-semibold text-background">
            ¡Tu compra ahora rinde más!
          </p>
          <p className="relative mt-1 flex items-center justify-center gap-1 text-sm text-background/70">
            Acumulá fueguitos con cada vianda que pedís
            <Fueguito className="h-4 w-4" />
          </p>
        </div>

        <div className="mt-4 grid gap-2">
          <button
            className="rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
            type="button"
            onClick={() => onView("registro")}
          >
            Crear mi cuenta · 30 seg
          </button>
          <button
            className="rounded-xl border border-foreground/20 py-3 font-semibold transition hover:bg-secondary"
            type="button"
            onClick={() => onView("entrar")}
          >
            Ya tengo cuenta
          </button>
        </div>

        <Section title="¿Cómo funciona?" subtitle="Solo son 3 pasos">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["1", "Pedís", "Tu pack de siempre"],
              ["2", "Sumás", "1 🔥 por vianda"],
              ["3", "Canjeás", "Regalos en tu pedido"],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-xl bg-secondary p-3 text-center">
                <span className="mx-auto mb-1 grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
                  {n}
                </span>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Premios" subtitle="Lo que podés conseguir">
          <Niveles fueguitos={0} />
        </Section>

        <Section title="Cómo sumar" subtitle="Más formas de ganar fueguitos">
          <ComoSumar />
        </Section>

        <Section title="Dudas frecuentes">
          <Faq />
        </Section>
      </div>
    </>
  );
}

function Field({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none transition focus:border-foreground"
        {...props}
      />
      {hint ? (
        <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

function PasswordField({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const [show, setShow] = useState(false);

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <div className="relative">
        <input
          className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 pr-12 text-base outline-none transition focus:border-foreground"
          type={show ? "text" : "password"}
          {...props}
        />
        <button
          aria-label={show ? "Ocultar" : "Mostrar"}
          className="absolute inset-y-0 right-0 px-4 text-muted-foreground"
          type="button"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}

function LoginForm({ onLogin }: { onLogin: () => Promise<void> }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [recordar, setRecordar] = useState(true);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setEnviando(true);
        try {
          await api("/api/cuenta/login", {
            usuario: usuario.trim(),
            password,
            recordar,
          });
          await onLogin();
        } catch (err) {
          setError(err instanceof Error ? err.message : "No pudimos entrar.");
        } finally {
          setEnviando(false);
        }
      }}
    >
      <p className="text-sm text-muted-foreground">
        Usá el usuario y la contraseña que te pasamos por WhatsApp.
      </p>
      <Field
        required
        autoCapitalize="none"
        autoComplete="username"
        label="Usuario"
        placeholder="ej: sofia.gomez"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <PasswordField
        required
        autoComplete="current-password"
        label="Contraseña"
        placeholder="••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          checked={recordar}
          className="h-4 w-4 accent-orange-500"
          type="checkbox"
          onChange={(e) => setRecordar(e.target.checked)}
        />
        Mantenerme conectado
      </label>
      <ErrorMsg text={error} />
      <button
        className="rounded-xl bg-foreground py-3 font-semibold text-background disabled:opacity-50"
        disabled={enviando}
        type="submit"
      >
        {enviando ? "Entrando…" : "Entrar"}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        ¿Te olvidaste la contraseña? Escribinos por WhatsApp y te pasamos una
        nueva.
      </p>
    </form>
  );
}

function RegisterForm({ onDone }: { onDone: () => void }) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setEnviando(true);
        try {
          await api("/api/cuenta/registro", {
            nombre: nombre.trim(),
            whatsapp: whatsapp.trim(),
          });
          onDone();
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "No pudimos crear tu cuenta.",
          );
        } finally {
          setEnviando(false);
        }
      }}
    >
      <div className="flex items-center gap-3 rounded-xl bg-orange-50 p-3 text-sm">
        <Fueguito className="h-7 w-7 shrink-0" />
        <p>
          Solo necesitamos 2 datos.{" "}
          <span className="font-semibold">
            Te regalamos 10 🔥 de bienvenida.
          </span>
        </p>
      </div>
      <Field
        required
        autoComplete="name"
        label="Nombre y apellido"
        placeholder="Sofía Gómez"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <Field
        required
        autoComplete="tel"
        hint="Ahí te mandamos tu usuario y contraseña."
        inputMode="tel"
        label="WhatsApp"
        placeholder="11 2345-6789"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
      />
      <ErrorMsg text={error} />
      <button
        className="rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
        disabled={enviando}
        type="submit"
      >
        {enviando ? "Creando…" : "Crear mi cuenta"}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Sin mails, sin apps, sin vueltas.
      </p>
    </form>
  );
}

/* ---------- Cliente con sesión iniciada ---------- */

function UserPanel({
  perfil,
  telefono,
  tab,
  onTab,
  onLogout,
  onCambio,
}: {
  perfil: PerfilCliente;
  telefono: string;
  tab: Tab;
  onTab: (t: Tab) => void;
  onLogout: () => void;
  onCambio: () => Promise<void>;
}) {
  return (
    <>
      <PanelHeader title={`Hola, ${perfil.nombre.split(" ")[0]}`} />
      <div className="flex gap-1 border-b px-5">
        {(
          [
            ["fueguitos", "Mis fueguitos"],
            ["perfil", "Perfil"],
            ["cupones", "Mis cupones"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            className={`-mb-px border-b-2 px-3 py-3 text-sm font-semibold transition ${
              tab === id
                ? "border-orange-500 text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
            type="button"
            onClick={() => onTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {tab === "fueguitos" ? (
          <Fueguitos perfil={perfil} telefono={telefono} onCambio={onCambio} />
        ) : tab === "perfil" ? (
          <Perfil perfil={perfil} onCambio={onCambio} onLogout={onLogout} />
        ) : (
          <MisCupones perfil={perfil} />
        )}
      </div>
    </>
  );
}

function Fueguitos({
  perfil,
  onCambio,
}: {
  perfil: PerfilCliente;
  telefono: string;
  onCambio: () => Promise<void>;
}) {
  const { fueguitos, racha } = perfil;
  const siguiente = NIVELES.find((n) => n.fuegos > fueguitos);
  const anterior = [...NIVELES].reverse().find((n) => n.fuegos <= fueguitos);
  const desde = anterior?.fuegos ?? 0;
  const progreso = siguiente
    ? ((fueguitos - desde) / (siguiente.fuegos - desde)) * 100
    : 100;

  return (
    <>
      {/* Saldo */}
      <div className="relative mt-5 overflow-hidden rounded-2xl bg-foreground p-6 text-background">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/40 blur-3xl" />
        <p className="relative font-poppins text-xs font-semibold uppercase tracking-[.2em] text-background/60">
          Tus fueguitos
        </p>
        <div className="relative mt-2 flex items-center gap-3">
          <Fueguito className="h-14 w-14 drop-shadow-[0_0_18px_rgba(249,115,22,.55)]" />
          <span className="font-poppins text-6xl font-bold leading-none tracking-tight">
            {fueguitos}
          </span>
        </div>
        {siguiente ? (
          <>
            <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-background/15">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${progreso}%` }}
              />
            </div>
            <p className="relative mt-2 font-poppins text-sm text-background/80">
              Te faltan{" "}
              <span className="font-semibold text-background">
                {siguiente.fuegos - fueguitos} 🔥
              </span>{" "}
              para{" "}
              <span className="font-semibold text-background">
                {siguiente.premio}
              </span>
            </p>
          </>
        ) : null}
      </div>

      {/* Racha */}
      <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p
            className="pt-1 text-2xl leading-none tracking-wide"
            style={BARBER}
          >
            <BarberText
              text={
                racha
                  ? `Racha de ${racha} ${racha === 1 ? "semana" : "semanas"}`
                  : "Arrancá tu racha"
              }
            />
          </p>
          {racha ? (
            <span className="text-xs font-semibold text-orange-600">
              ¡No la cortes!
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex justify-between">
          {Array.from({ length: 4 }).map((_, i) => {
            // 4 círculos: cada 4 semanas seguidas hay premio y el ciclo vuelve a empezar.
            const enCiclo = racha > 0 ? racha % 4 || 4 : 0;
            const on = i < enCiclo;

            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-full ${
                    on
                      ? "border-2 border-orange-400 bg-background shadow-[0_0_12px_rgba(249,115,22,.35)]"
                      : "border-2 border-dashed border-orange-300 bg-background"
                  }`}
                >
                  <Fueguito apagado={!on} className="h-6 w-6" />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  S{i + 1}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Pedí antes del{" "}
          <span className="font-semibold text-foreground">domingo</span>{" "}
          {racha
            ? `para llegar a ${racha + 1} semanas`
            : "para arrancar tu racha"}
          .{" "}
          {racha % 4 === 3 ? (
            <>
              ¡Con una semana más sumás{" "}
              <span className="font-semibold text-foreground">+5 🔥 extra</span>
              !
            </>
          ) : (
            <>
              Cada 4 semanas seguidas te sumamos{" "}
              <span className="font-semibold text-foreground">+5 🔥 extra</span>
              .
            </>
          )}
        </p>
      </div>

      <Section title="Canjear" subtitle="Elegí tu regalo">
        <Niveles canjeable fueguitos={fueguitos} onCanje={onCambio} />
      </Section>

      <Section title="Cómo sumar" subtitle="Más formas de ganar fueguitos">
        <ComoSumar />
      </Section>

      <Section title="Historial">
        {perfil.historial.length ? (
          <ul className="divide-y rounded-xl border">
            {perfil.historial.map((h, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{h.motivo}</p>
                  <p className="text-xs text-muted-foreground">{h.fecha}</p>
                </div>
                <span
                  className={`font-semibold ${h.fueguitos < 0 ? "text-muted-foreground" : "text-orange-600"}`}
                >
                  {h.fueguitos > 0 ? "+" : ""}
                  {h.fueguitos} 🔥
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
            Todavía no tenés movimientos.
          </p>
        )}
      </Section>

      <Section title="Dudas frecuentes">
        <Faq />
      </Section>
    </>
  );
}

function MisCupones({ perfil }: { perfil: PerfilCliente }) {
  const cupones = perfil.cupones || [];

  if (!cupones.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-orange-300 bg-orange-50/70 p-6 text-center">
        <Fueguito className="mx-auto h-10 w-10" />
        <p className="mt-3 font-poppins text-sm font-semibold">
          Todavía no tenés cupones
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Cuando canjees tus fueguitos en “Mis fueguitos”, tu cupón va a
          aparecer acá.
        </p>
      </div>
    );
  }

  return (
    <>
      <Section
        title="Mis cupones"
        subtitle="Pegalos en “¿Tenés un cupón?” cuando hagas tu pedido, o usalos desde el carrito"
      >
        <ul className="grid gap-2">
          {cupones.map((c) => {
            const usado = c.estado !== "Sin usar";

            return (
              <li
                key={c.codigo}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                  usado
                    ? "border-black/10 bg-white/30 opacity-60"
                    : "border-orange-300 bg-orange-50"
                }`}
              >
                <div className="min-w-0">
                  <p
                    className={`truncate font-mono text-sm font-bold tracking-wide ${usado ? "line-through" : ""}`}
                  >
                    {c.codigo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.premio} · {usado ? "Usado" : "Sin usar"}
                  </p>
                </div>
                {usado ? null : <BotonCopiar texto={c.codigo} />}
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}

// Frutas y verduras para el avatar (la misma lista que acepta la planilla).
const AVATARES = [
  "🥑",
  "🥕",
  "🥦",
  "🍅",
  "🌽",
  "🥬",
  "🥒",
  "🍆",
  "🫑",
  "🧅",
  "🧄",
  "🥔",
  "🍠",
  "🍄",
  "🍎",
  "🍐",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🌶️",
];

function Avatar({
  perfil,
  tamano,
}: {
  perfil: PerfilCliente;
  tamano: "chico" | "grande";
}) {
  const clases =
    tamano === "grande" ? "h-16 w-16 text-3xl" : "h-7 w-7 text-base";

  if (perfil.avatar) {
    return (
      <span
        className={`grid ${clases} place-items-center rounded-full bg-orange-100 leading-none`}
      >
        <span className={tamano === "grande" ? "text-4xl" : "text-lg"}>
          {perfil.avatar}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`grid ${clases} place-items-center rounded-full bg-foreground font-heading text-background`}
    >
      {perfil.nombre[0]?.toUpperCase()}
    </span>
  );
}

function BotonCopiar({
  texto,
  grande = false,
}: {
  texto: string;
  grande?: boolean;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const area = document.createElement("textarea");

      area.value = texto;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      className={`shrink-0 rounded-lg font-poppins font-semibold transition ${
        grande
          ? "w-full bg-[#1f1b16] px-4 py-3 text-sm text-white"
          : "bg-[#1f1b16] px-3 py-2 text-xs text-white"
      }`}
      type="button"
      onClick={() => void copiar()}
    >
      {copiado ? "¡Copiado!" : grande ? "Copiar cupón" : "Copiar"}
    </button>
  );
}

function Niveles({
  fueguitos,
  canjeable = false,
  onCanje,
}: {
  fueguitos: number;
  canjeable?: boolean;
  onCanje?: () => Promise<void>;
}) {
  const [eleccion, setEleccion] = useState<{
    nivel: number;
    opcion: "regalo" | "plata";
    texto: string;
  } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [nuevo, setNuevo] = useState<{ codigo: string; premio: string } | null>(
    null,
  );

  async function confirmar() {
    if (!eleccion) return;
    setError("");
    setEnviando(true);
    try {
      const data = await api<{ cupon: { codigo: string; premio: string } }>(
        "/api/cuenta/canjear",
        {
          nivel: eleccion.nivel,
          opcion: eleccion.opcion,
        },
      );

      setNuevo(data.cupon);
      setEleccion(null);
      await onCanje?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo canjear. Probá de nuevo.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="grid gap-2">
      {nuevo ? (
        <div className="mb-1 rounded-2xl border-2 border-dashed border-orange-400 bg-orange-50 p-5 text-center">
          <p className="font-poppins text-sm font-semibold">
            ¡Listo! Este es tu cupón 🎁
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{nuevo.premio}</p>
          <p className="my-3 select-all rounded-lg bg-white/70 px-3 py-3 font-mono text-xl font-bold tracking-wider text-[#1f1b16]">
            {nuevo.codigo}
          </p>
          <BotonCopiar grande texto={nuevo.codigo} />
          <p className="mt-3 font-poppins text-sm font-semibold text-[#1f1b16]">
            Ingresá este cupón a la hora de hacer tu pedido
          </p>
        </div>
      ) : null}

      {NIVELES.map((n) => {
        const alcanza = fueguitos >= n.fuegos;
        const activo = canjeable && alcanza;
        const confirmando = eleccion?.nivel === n.fuegos;

        return (
          <div
            key={n.fuegos}
            className={`rounded-xl p-3 ${activo ? "bg-foreground text-background" : "bg-secondary"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${
                  activo ? "bg-orange-500" : "bg-background"
                }`}
              >
                <span
                  className={`text-xl ${!canjeable || alcanza ? "" : "opacity-60 grayscale"}`}
                >
                  {n.emoji}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-poppins text-base font-bold leading-tight">
                  {n.premio}
                </p>
                <p
                  className={`mt-0.5 font-poppins text-xs font-normal ${activo ? "text-background/70" : "text-muted-foreground"}`}
                >
                  de regalo en tu pedido
                  {n.plata ? (
                    <>
                      {" "}
                      · o <span className="font-semibold">{n.plata}</span>
                    </>
                  ) : null}
                </p>
              </div>
              <span
                className={`text-sm font-semibold ${activo ? "text-orange-400" : ""}`}
              >
                {n.fuegos} 🔥
              </span>
            </div>

            {activo && !confirmando ? (
              n.plata ? (
                <div className="mt-3">
                  <p className="mb-2 font-poppins text-xs text-background/70">
                    Elegí qué preferís:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="rounded-lg bg-orange-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                      type="button"
                      onClick={() =>
                        setEleccion({
                          nivel: n.fuegos,
                          opcion: "regalo",
                          texto: n.premio,
                        })
                      }
                    >
                      🎁 {n.premio}
                    </button>
                    <button
                      className="rounded-lg border border-background/30 px-3 py-2.5 text-sm font-semibold text-background hover:bg-background/10"
                      type="button"
                      onClick={() =>
                        setEleccion({
                          nivel: n.fuegos,
                          opcion: "plata",
                          texto: n.plata!,
                        })
                      }
                    >
                      💸 {n.plata}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="mt-3 w-full rounded-lg bg-orange-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                  type="button"
                  onClick={() =>
                    setEleccion({
                      nivel: n.fuegos,
                      opcion: "regalo",
                      texto: n.premio,
                    })
                  }
                >
                  Quiero el regalo 🎁
                </button>
              )
            ) : null}

            {confirmando && eleccion ? (
              <div className="mt-3 rounded-lg bg-background/10 p-3 text-center">
                <p className="font-poppins text-sm">
                  Estás a punto de canjear{" "}
                  <span className="font-bold text-orange-400">
                    {n.fuegos} fueguitos
                  </span>{" "}
                  por el cupón de{" "}
                  <span className="font-bold">{eleccion.texto}</span>.
                </p>
                <p className="mt-1 font-poppins text-sm font-semibold">
                  ¿Estás de acuerdo?
                </p>
                {error ? (
                  <p className="mt-2 text-xs text-red-300">{error}</p>
                ) : null}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    className="rounded-lg bg-orange-500 px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    disabled={enviando}
                    type="button"
                    onClick={() => void confirmar()}
                  >
                    {enviando ? "Canjeando…" : "Sí, canjear"}
                  </button>
                  <button
                    className="rounded-lg border border-background/30 px-3 py-2.5 text-sm font-semibold text-background"
                    disabled={enviando}
                    type="button"
                    onClick={() => {
                      setEleccion(null);
                      setError("");
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ComoSumar() {
  return (
    <ul className="divide-y overflow-hidden rounded-xl bg-foreground text-background">
      {COMO_SUMAR.map(({ icon: Icon, titulo, fuegos }) => (
        <li
          key={titulo}
          className="flex items-center gap-3 border-background/10 px-4 py-3"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background/10">
            <Icon className="h-4 w-4" />
          </span>
          <span className="flex-1 text-sm font-medium">{titulo}</span>
          <span className="text-sm font-semibold text-orange-400">
            {fuegos}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Faq() {
  return (
    <div className="grid gap-2">
      {FAQ.map(([q, a]) => (
        <details key={q} className="group rounded-xl border px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium">
            {q}
            <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-sm text-muted-foreground">{a}</p>
        </details>
      ))}
    </div>
  );
}

function Perfil({
  perfil,
  onLogout,
  onCambio,
}: {
  perfil: PerfilCliente;
  onLogout: () => void;
  onCambio: () => Promise<void>;
}) {
  const [guardado, setGuardado] = useState(false);
  const [eligiendo, setEligiendo] = useState(false);
  const [guardandoAvatar, setGuardandoAvatar] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState("");

  async function elegirAvatar(emoji: string) {
    setErrorAvatar("");
    setGuardandoAvatar(true);
    try {
      await api("/api/cuenta/avatar", { emoji });
      await onCambio();
      setEligiendo(false);
    } catch (err) {
      setErrorAvatar(
        err instanceof Error ? err.message : "No se pudo guardar.",
      );
    } finally {
      setGuardandoAvatar(false);
    }
  }
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  return (
    <>
      <div className="mt-5 flex items-center gap-4">
        <button
          aria-label="Elegir mi avatar"
          className="relative"
          type="button"
          onClick={() => setEligiendo(!eligiendo)}
        >
          <Avatar perfil={perfil} tamano="grande" />
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-orange-500 text-xs text-white">
            ✎
          </span>
        </button>
        <div>
          <p className="font-heading text-3xl leading-none tracking-wide">
            {perfil.nombre}
          </p>
          <p className="text-sm text-muted-foreground">@{perfil.usuario}</p>
          <button
            className="mt-1 text-xs font-semibold text-orange-600 underline"
            type="button"
            onClick={() => setEligiendo(!eligiendo)}
          >
            {perfil.avatar ? "Cambiar mi avatar" : "Elegí tu avatar"}
          </button>
        </div>
      </div>

      {eligiendo ? (
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="font-poppins text-sm font-semibold">
            Elegí tu fruta o verdura 🥑
          </p>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {AVATARES.map((emoji) => (
              <button
                key={emoji}
                aria-label={`Elegir ${emoji}`}
                className={`grid aspect-square place-items-center rounded-xl text-2xl transition hover:bg-white ${
                  perfil.avatar === emoji
                    ? "bg-white ring-2 ring-orange-500"
                    : "bg-white/50"
                }`}
                disabled={guardandoAvatar}
                type="button"
                onClick={() => void elegirAvatar(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          {errorAvatar ? (
            <p className="mt-2 text-xs text-red-700">{errorAvatar}</p>
          ) : null}
        </div>
      ) : null}

      <Section title="Mis datos">
        <dl className="divide-y rounded-xl border text-sm">
          {[
            ["Usuario", perfil.usuario],
            ["WhatsApp", perfil.whatsapp],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-3">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
          <Cumple inicial={perfil.cumple} onCambio={onCambio} />
        </dl>
      </Section>

      <Section
        title="Cambiar contraseña"
        subtitle="Poné una que te acuerdes fácil"
      >
        {guardado ? (
          <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-800">
            <Check className="h-5 w-5" /> ¡Listo! La próxima vez entrá con tu
            nueva contraseña.
          </div>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              if (nueva.length < 4)
                return setError(
                  "La nueva contraseña tiene que tener al menos 4 caracteres.",
                );
              if (nueva !== repetir)
                return setError("Las contraseñas nuevas no coinciden.");
              setEnviando(true);
              try {
                await api("/api/cuenta/password", { actual, nueva });
                setGuardado(true);
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "No se pudo cambiar.",
                );
              } finally {
                setEnviando(false);
              }
            }}
          >
            <PasswordField
              required
              autoComplete="current-password"
              label="Contraseña actual"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
            />
            <PasswordField
              required
              autoComplete="new-password"
              label="Nueva contraseña"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
            />
            <PasswordField
              required
              autoComplete="new-password"
              label="Repetir nueva contraseña"
              value={repetir}
              onChange={(e) => setRepetir(e.target.value)}
            />
            <ErrorMsg text={error} />
            <button
              className="flex items-center justify-center gap-2 rounded-xl bg-foreground py-3 font-semibold text-background disabled:opacity-50"
              disabled={enviando}
              type="submit"
            >
              <KeyRound className="h-4 w-4" />{" "}
              {enviando ? "Guardando…" : "Guardar contraseña"}
            </button>
          </form>
        )}
      </Section>

      <button
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-foreground/20 py-3 text-sm font-semibold text-muted-foreground hover:bg-secondary"
        type="button"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4" /> Cerrar sesión
      </button>
    </>
  );
}

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function Cumple({
  inicial,
  onCambio,
}: {
  inicial: { dia: number; mes: number } | null;
  onCambio: () => Promise<void>;
}) {
  const [guardado, setGuardado] = useState(inicial);
  const [editando, setEditando] = useState(!inicial);
  const [dia, setDia] = useState(inicial?.dia ?? 0);
  const [mes, setMes] = useState(inicial?.mes ?? 0);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (guardado && !editando) {
    return (
      <div className="flex items-center justify-between px-4 py-3">
        <dt className="text-muted-foreground">Cumpleaños</dt>
        <dd className="flex items-center gap-2 font-medium">
          🎂 {guardado.dia} de {MESES[guardado.mes - 1]}
          <button
            className="text-xs font-semibold text-orange-600"
            type="button"
            onClick={() => setEditando(true)}
          >
            Editar
          </button>
        </dd>
      </div>
    );
  }

  const select =
    "rounded-lg border border-foreground/15 bg-background px-2 py-2 text-base outline-none focus:border-foreground";

  return (
    <div className="px-4 py-3">
      <dt className="text-muted-foreground">Cumpleaños</dt>
      <dd className="mt-2">
        <div className="flex gap-2">
          <select
            aria-label="Día"
            className={`${select} w-20`}
            value={dia}
            onChange={(e) => setDia(Number(e.target.value))}
          >
            <option value={0}>Día</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            aria-label="Mes"
            className={`${select} flex-1`}
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
          >
            <option value={0}>Mes</option>
            {MESES.map((m, i) => (
              <option key={m} value={i + 1}>
                {m[0].toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
          <button
            className="rounded-lg bg-foreground px-3 text-sm font-semibold text-background disabled:opacity-40"
            disabled={!dia || !mes || enviando}
            type="button"
            onClick={async () => {
              setError("");
              setEnviando(true);
              try {
                await api("/api/cuenta/cumple", { dia, mes });
                setGuardado({ dia, mes });
                setEditando(false);
                void onCambio();
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "No se pudo guardar.",
                );
              } finally {
                setEnviando(false);
              }
            }}
          >
            {enviando ? "…" : "Guardar"}
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          En tu cumple te regalamos 10 fueguitos{" "}
          <Fueguito className="h-3.5 w-3.5" />
        </p>
        {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
      </dd>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <p className="pt-1 text-2xl leading-none tracking-wide" style={BARBER}>
        <BarberText text={title} />
      </p>
      {subtitle ? (
        <p className="mb-3 mt-1 font-poppins text-sm text-muted-foreground">
          {subtitle}
        </p>
      ) : (
        <div className="mb-3" />
      )}
      {children}
    </section>
  );
}
