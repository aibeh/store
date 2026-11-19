import {NextResponse} from "next/server";

import {CLIENTE_COOKIE} from "@/lib/clientes";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ok: true});

  response.cookies.set(CLIENTE_COOKIE, "", {path: "/", maxAge: 0});

  return response;
}
