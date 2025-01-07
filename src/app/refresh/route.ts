import type {NextRequest} from "next/server";

import {revalidatePath} from "next/cache";
import {NextResponse} from "next/server";

export function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("secret") !== process.env.SECRET!) {
    return new Response("Unauthorized", {status: 401});
  }

  revalidatePath("/", "layout");

  return NextResponse.json({revalidated: true});
}
