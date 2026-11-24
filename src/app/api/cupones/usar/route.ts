import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {callClientes, errorMessage} from "@/lib/clientes";

export const dynamic = "force-dynamic";

// Al completar el pedido, el cupón queda marcado como usado.
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {codigo?: unknown; cliente?: unknown};

  try {
    await callClientes("cupon_usar", {
      codigo: String(body.codigo || "").trim().slice(0, 40),
      cliente: String(body.cliente || "").slice(0, 80),
    });

    return NextResponse.json({ok: true});
  } catch (error) {
    return NextResponse.json({error: errorMessage(error)}, {status: 400});
  }
}
