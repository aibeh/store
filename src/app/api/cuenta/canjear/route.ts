import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {CLIENTE_COOKIE, callClientes, errorMessage} from "@/lib/clientes";

export const dynamic = "force-dynamic";

// El cliente canjea sus fueguitos por un cupón de un solo uso.
export async function POST(request: NextRequest) {
  const sesion = request.cookies.get(CLIENTE_COOKIE)?.value;

  if (!sesion) return NextResponse.json({error: "Tenés que entrar de nuevo."}, {status: 401});

  const body = (await request.json().catch(() => ({}))) as {nivel?: unknown; opcion?: unknown};

  try {
    const data = await callClientes("canjear", {sesion, nivel: Number(body.nivel), opcion: String(body.opcion || "regalo")});

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({error: errorMessage(error)}, {status: 400});
  }
}
