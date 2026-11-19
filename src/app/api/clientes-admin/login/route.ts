import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  adminPinMatches,
  adminSessionValue,
  clearFailures,
  getIp,
  isClientesConfigured,
  isLocked,
  registerFailure,
} from "@/lib/clientes";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isClientesConfigured() || !process.env.CLIENTES_PIN) {
    return NextResponse.json({error: "El panel todavía no está configurado."}, {status: 503});
  }

  const ip = getIp(request.headers);

  if (isLocked(`admin:${ip}`)) {
    return NextResponse.json({error: "Demasiados intentos. Probá en unos minutos."}, {status: 429});
  }

  const body = (await request.json().catch(() => ({}))) as {pin?: unknown};
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";

  if (!pin || !adminPinMatches(pin)) {
    registerFailure(`admin:${ip}`);
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({error: "PIN incorrecto."}, {status: 401});
  }

  clearFailures(`admin:${ip}`);

  const response = NextResponse.json({ok: true});

  response.cookies.set(ADMIN_COOKIE, adminSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });

  return response;
}
