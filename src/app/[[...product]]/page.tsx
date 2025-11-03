import type {Metadata} from "next";

import api from "~/product/api";

import StoreScreen from "@/modules/store/screens/Store";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const products = await api.list();

  return [
    // Build index for the home page...
    {product: undefined},
    // ...and for each product
    ...products.map((product) => ({product: [product.id]})),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{product?: string[]}>;
}): Promise<Metadata | undefined> {
  const {product: productParam} = await params;

  if (productParam) {
    const product = await api.fetch(productParam[0]);

    return {
      title: product.title,
      description: product.description,
    };
  }
}

async function HomeAndProductPage({params}: {params: Promise<{product?: [product: string]}>}) {
  const products = await api.list();
  const {product: productParam} = await params;
  const selected = productParam ? await api.fetch(productParam[0]) : null;

  return <StoreScreen products={products} selected={selected} />;
}

export default HomeAndProductPage;
