import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {callClientes, errorMessage, getIp, isLocked, registerFailure} from "@/lib/clientes";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = getIp(request.headers);

  if (isLocked(`registro:${ip}`)) {
    return NextResponse.json({error: "Demasiados intentos. Probá en un rato."}, {status: 429});
  }

  const body = (await request.json().catch(() => ({}))) as {nombre?: unknown; whatsapp?: unknown};

  // Cuenta cada registro para frenar abusos (8 seguidos desde la misma conexión).
  registerFailure(`registro:${ip}`);

  try {
    await callClientes("registrar", {nombre: String(body.nombre || ""), whatsapp: String(body.whatsapp || "")});

    return NextResponse.json({ok: true});
  } catch (error) {
    return NextResponse.json({error: errorMessage(error)}, {status: 400});
  }
}
