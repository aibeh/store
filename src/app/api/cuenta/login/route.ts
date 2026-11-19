import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {
  CLIENTE_COOKIE,
  CLIENTE_SESSION_SECONDS,
  callClientes,
  clearFailures,
  errorMessage,
  getIp,
  isLocked,
  registerFailure,
} from "@/lib/clientes";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = getIp(request.headers);

  if (isLocked(`login:${ip}`)) {
    return NextResponse.json({error: "Demasiados intentos. Probá de nuevo en 15 minutos."}, {status: 429});
  }

  const body = (await request.json().catch(() => ({}))) as {usuario?: unknown; password?: unknown; recordar?: unknown};

  try {
    const {sesion} = await callClientes<{sesion: string}>("login", {
      usuario: String(body.usuario || ""),
      password: String(body.password || ""),
    });

    clearFailures(`login:${ip}`);

    const response = NextResponse.json({ok: true});

    response.cookies.set(CLIENTE_COOKIE, sesion, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(body.recordar === false ? {} : {maxAge: CLIENTE_SESSION_SECONDS}),
    });

    return response;
  } catch (error) {
    registerFailure(`login:${ip}`);
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({error: errorMessage(error)}, {status: 401});
  }
}
