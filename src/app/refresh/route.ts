import type {NextRequest} from "next/server";

import {revalidatePath, revalidateTag} from "next/cache";
import {NextResponse} from "next/server";

import api from "~/product/api";

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("secret") !== process.env.SECRET!) {
    return new Response("Unauthorized", {status: 401});
  }

  // Revalidate all used tags
  revalidateTag("fields");
  revalidateTag("products");
  revalidateTag("store");

  // Revalidate the layout for shared data between index and products
  revalidatePath("/", "layout");

  // Revalidate all paths
  const products = await api.list();

  for (const product of products) {
    revalidatePath(`/${product.id}`)
  }

  return NextResponse.json({revalidated: true});
}
