import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {COCINA_COOKIE, callCocina, isAuthorized} from "@/lib/cocina";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request.cookies.get(COCINA_COOKIE)?.value)) {
    return NextResponse.json({error: "No autorizado."}, {status: 401});
  }

  try {
    const data = await callCocina({accion: "cocina"});

    return NextResponse.json(data, {headers: {"Cache-Control": "no-store"}});
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo leer la planilla.";

    return NextResponse.json({error: message}, {status: 502});
  }
}
