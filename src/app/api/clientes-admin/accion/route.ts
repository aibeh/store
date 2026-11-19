import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {ADMIN_COOKIE, callClientes, errorMessage, isAdmin} from "@/lib/clientes";

export const dynamic = "force-dynamic";

const PERMITIDAS: Record<string, string[]> = {
  alta: ["fila", "usuario", "password"],
  sumar: ["fila", "cantidad", "motivo"],
  password: ["fila", "password"],
};

export async function POST(request: NextRequest) {
  if (!isAdmin(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({error: "No autorizado."}, {status: 401});
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const tipo = String(body.tipo || "");
  const campos = PERMITIDAS[tipo];

  if (!campos) return NextResponse.json({error: "Acción desconocida."}, {status: 400});

  const data = Object.fromEntries(campos.map((campo) => [campo, body[campo]]));

  try {
    const result = await callClientes(`admin_${tipo}`, data);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({error: errorMessage(error)}, {status: 400});
  }
}
