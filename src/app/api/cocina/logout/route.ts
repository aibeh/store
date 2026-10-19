import {NextResponse} from "next/server";

import {COCINA_COOKIE} from "@/lib/cocina";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ok: true});

  response.cookies.set(COCINA_COOKIE, "", {path: "/", maxAge: 0});

  return response;
}
