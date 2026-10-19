import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {COCINA_COOKIE, callCocina, isAuthorized} from "@/lib/cocina";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request.cookies.get(COCINA_COOKIE)?.value)) {
    return NextResponse.json({error: "No autorizado."}, {status: 401});
  }

  const body = (await request.json().catch(() => ({}))) as {texto?: unknown};
  const texto = typeof body.texto === "string" ? body.texto.trim().slice(0, 500) : "";

  if (!texto) {
    return NextResponse.json({error: "Escribí la nota antes de guardar."}, {status: 400});
  }

  try {
    const data = await callCocina({accion: "nota", texto});

    return NextResponse.json(data, {headers: {"Cache-Control": "no-store"}});
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar la nota.";

    return NextResponse.json({error: message}, {status: 502});
  }
}
