import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {CLIENTE_COOKIE, callClientes, errorMessage} from "@/lib/clientes";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const sesion = request.cookies.get(CLIENTE_COOKIE)?.value;

  if (!sesion) return NextResponse.json({error: "Tenés que entrar de nuevo."}, {status: 401});

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  try {
    await callClientes("cambiar_password", {sesion, actual: body.actual, nueva: body.nueva});

    return NextResponse.json({ok: true});
  } catch (error) {
    return NextResponse.json({error: errorMessage(error)}, {status: 400});
  }
}
