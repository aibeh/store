import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {
  COCINA_COOKIE,
  COCINA_SESSION_SECONDS,
  clearFailures,
  getIp,
  isCocinaConfigured,
  isLocked,
  pinMatches,
  registerFailure,
  sessionValue,
} from "@/lib/cocina";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isCocinaConfigured()) {
    return NextResponse.json({error: "El panel todavía no está configurado."}, {status: 503});
  }

  const ip = getIp(request.headers);

  if (isLocked(ip)) {
    return NextResponse.json(
      {error: "Demasiados intentos. Probá de nuevo en unos minutos."},
      {status: 429},
    );
  }

  const body = (await request.json().catch(() => ({}))) as {pin?: unknown};
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";

  if (!pin || !pinMatches(pin)) {
    registerFailure(ip);
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({error: "PIN incorrecto."}, {status: 401});
  }

  clearFailures(ip);

  const response = NextResponse.json({ok: true});

  response.cookies.set(COCINA_COOKIE, sessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: COCINA_SESSION_SECONDS,
  });

  return response;
}
