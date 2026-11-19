import {createHash, createHmac, timingSafeEqual} from "crypto";

// Cuentas de clientes: la web habla con el Apps Script "AIBEH Clientes". Solo corre en el servidor.

export const CLIENTE_COOKIE = "aibeh_cliente";
export const CLIENTE_SESSION_SECONDS = 60 * 60 * 24 * 180; // 6 meses: "mantenerme conectado"
export const ADMIN_COOKIE = "aibeh_clientes_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 30;

export function isClientesConfigured(): boolean {
  return Boolean(process.env.CLIENTES_URL && process.env.CLIENTES_TOKEN);
}

function sha(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha(a), sha(b));
}

/* ---------- Panel interno (PIN) ---------- */

export function adminSessionValue(): string {
  return createHmac("sha256", process.env.CLIENTES_TOKEN || "")
    .update(`clientes-admin:${process.env.CLIENTES_PIN || ""}`)
    .digest("hex");
}

export function isAdmin(cookieValue: string | undefined): boolean {
  if (!isClientesConfigured() || !process.env.CLIENTES_PIN || !cookieValue) return false;

  return safeEqual(cookieValue, adminSessionValue());
}

export function adminPinMatches(input: string): boolean {
  return Boolean(process.env.CLIENTES_PIN) && safeEqual(input, process.env.CLIENTES_PIN || "");
}

/* ---------- Freno contra intentos repetidos ---------- */

const failures = new Map<string, {count: number; until: number}>();

export function isLocked(key: string): boolean {
  const entry = failures.get(key);

  if (!entry) return false;
  if (entry.until > Date.now()) return true;
  if (entry.until) failures.delete(key);

  return false;
}

export function registerFailure(key: string): void {
  const entry = failures.get(key) || {count: 0, until: 0};

  entry.count += 1;
  if (entry.count >= 8) {
    entry.until = Date.now() + 15 * 60 * 1000;
    entry.count = 0;
  }
  failures.set(key, entry);
}

export function clearFailures(key: string): void {
  failures.delete(key);
}

export function getIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

/* ---------- Llamada al Apps Script ---------- */

export class ClientesError extends Error {}

export async function callClientes<T = Record<string, unknown>>(
  accion: string,
  data: Record<string, unknown> = {},
): Promise<T> {
  if (!isClientesConfigured()) throw new ClientesError("Las cuentas todavía no están configuradas.");

  const response = await fetch(process.env.CLIENTES_URL || "", {
    method: "POST",
    headers: {"Content-Type": "text/plain;charset=utf-8"},
    body: JSON.stringify({...data, accion, token: process.env.CLIENTES_TOKEN}),
    cache: "no-store",
    redirect: "follow",
  });

  if (!response.ok) throw new Error("La planilla no respondió.");

  const json = (await response.json().catch(() => null)) as ({ok: boolean; error?: string} & T) | null;

  if (!json) throw new Error("La planilla respondió algo inesperado.");
  if (!json.ok) throw new ClientesError(json.error || "No se pudo completar.");

  return json;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Algo salió mal. Probá de nuevo.";
}
