import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {CLIENTE_COOKIE, ClientesError, callClientes, errorMessage} from "@/lib/clientes";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sesion = request.cookies.get(CLIENTE_COOKIE)?.value;

  if (!sesion) return NextResponse.json({perfil: null}, {headers: {"Cache-Control": "no-store"}});

  try {
    const {perfil} = await callClientes<{perfil: unknown}>("perfil", {sesion});

    return NextResponse.json({perfil}, {headers: {"Cache-Control": "no-store"}});
  } catch (error) {
    if (error instanceof ClientesError) {
      // Sesión vencida (por ejemplo, le reseteaste la contraseña): se borra la cookie.
      const response = NextResponse.json({perfil: null});

      response.cookies.set(CLIENTE_COOKIE, "", {path: "/", maxAge: 0});

      return response;
    }

    return NextResponse.json({error: errorMessage(error)}, {status: 502});
  }
}
