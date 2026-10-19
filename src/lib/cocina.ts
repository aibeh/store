import {createHash, createHmac, timingSafeEqual} from "crypto";

export const COCINA_COOKIE = "aibeh_cocina";
export const COCINA_SESSION_SECONDS = 60 * 60 * 24 * 30;

const MAX_FAILURES = 8;
const LOCK_MS = 15 * 60 * 1000;

const failures = new Map<string, {count: number; until: number}>();

function sha(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha(a), sha(b));
}

export function isCocinaConfigured(): boolean {
  return Boolean(process.env.COCINA_PIN && process.env.COCINA_TOKEN && process.env.COCINA_URL);
}

// El valor de la cookie depende del PIN: si lo cambiás, todas las sesiones abiertas se cierran.
export function sessionValue(): string {
  return createHmac("sha256", process.env.COCINA_TOKEN || "").update(`cocina:${process.env.COCINA_PIN || ""}`).digest("hex");
}

export function isAuthorized(cookieValue: string | undefined): boolean {
  if (!isCocinaConfigured() || !cookieValue) return false;

  return safeEqual(cookieValue, sessionValue());
}

export function pinMatches(input: string): boolean {
  return isCocinaConfigured() && safeEqual(input, process.env.COCINA_PIN || "");
}

// Freno básico contra adivinar el PIN (en memoria: alcanza para frenar intentos seguidos).
export function isLocked(ip: string): boolean {
  const entry = failures.get(ip);

  if (!entry) return false;
  if (entry.until && entry.until > Date.now()) return true;
  if (entry.until && entry.until <= Date.now()) failures.delete(ip);

  return false;
}

export function registerFailure(ip: string): void {
  const entry = failures.get(ip) || {count: 0, until: 0};

  entry.count += 1;
  if (entry.count >= MAX_FAILURES) {
    entry.until = Date.now() + LOCK_MS;
    entry.count = 0;
  }
  failures.set(ip, entry);
}

export function clearFailures(ip: string): void {
  failures.delete(ip);
}

export function getIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() || "desconocida";
}

interface CocinaResponse {
  ok: boolean;
  error?: string;
  [key: string]: unknown;
}

// Habla con el Apps Script (la planilla). Solo corre del lado del servidor.
export async function callCocina(params: Record<string, string>): Promise<CocinaResponse> {
  const url = new URL(process.env.COCINA_URL || "");

  url.searchParams.set("token", process.env.COCINA_TOKEN || "");
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {cache: "no-store", redirect: "follow"});

  if (!response.ok) throw new Error("La planilla no respondió.");

  const data = (await response.json()) as CocinaResponse;

  if (!data.ok) throw new Error(data.error || "Error al leer la planilla.");

  return data;
}
