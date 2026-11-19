import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {ADMIN_COOKIE, callClientes, errorMessage, isAdmin} from "@/lib/clientes";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdmin(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({error: "No autorizado."}, {status: 401});
  }

  try {
    const data = await callClientes("admin_datos");

    return NextResponse.json(data, {headers: {"Cache-Control": "no-store"}});
  } catch (error) {
    return NextResponse.json({error: errorMessage(error)}, {status: 502});
  }
}
