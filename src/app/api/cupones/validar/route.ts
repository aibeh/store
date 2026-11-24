import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {ClientesError, callClientes, errorMessage, getIp, isLocked, registerFailure} from "@/lib/clientes";

export const dynamic = "force-dynamic";

// El carrito pregunta si un cupón de fueguitos sirve. Se frena a quien prueba muchos códigos.
export async function POST(request: NextRequest) {
  const ip = getIp(request.headers);

  if (isLocked(`cupon:${ip}`)) {
    return NextResponse.json({error: "Demasiados intentos. Probá en unos minutos."}, {status: 429});
  }

  const body = (await request.json().catch(() => ({}))) as {codigo?: unknown};
  const codigo = String(body.codigo || "").trim().slice(0, 40);

  try {
    const data = await callClientes("cupon_validar", {codigo});

    return NextResponse.json(data, {headers: {"Cache-Control": "no-store"}});
  } catch (error) {
    if (error instanceof ClientesError) registerFailure(`cupon:${ip}`);

    return NextResponse.json({error: errorMessage(error)}, {status: 400});
  }
}
