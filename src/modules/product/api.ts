import type {Option as IOption, Product as IProduct} from "./types";

import Papa from "papaparse";
import {notFound} from "next/navigation";

interface RawOption {
  id: string;
  type: "option";
  title: string;
  category: string;
  description?: string;
  image?: string;
  price: string | number;
}

interface RawProduct {
  id: string;
  type: "product";
  title: string;
  category: string;
  description: string;
  image: string;
  price: string | number;
}

interface RawUnknown {
  type: string;
  id: string;
  [key: string]: unknown;
}

class Product implements IProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  options?: Record<
    string,
    {
      options: IOption[];
      condition: string;
    }
  >;
  price: number;

  constructor() {
    this.id = "";
    this.title = "";
    this.category = "";
    this.description = "";
    this.image = "";
    this.price = 0;
    this.options = {};
  }

  set(product: RawProduct) {
    this.id = product.id;
    this.title = product.title;
    this.category = product.category;
    this.description = product.description;
    this.image = product.image;
    this.price = Number(product.price);
  }

  addOption(option: RawOption) {
    let [category = "", condition = ""] = option.category.split("||");

    category = category.trim();
    condition = condition.trim();

    // Check if the category contains ||required
    if (option.category.includes("||required")) {
      condition = condition ? `${condition}||required` : "required";
    }

    if (!this.options) {
      this.options = {};
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.options[category]) {
      this.options[category] = {
        options: [],
        condition,
      };
    }

    const newOption: IOption = {
      title: option.title,
      price: Number(option.price),
      category,
    };

    this.options[category].options.push(newOption);
  }

  toJSON(): IProduct {
    const product: IProduct = {
      id: this.id,
      title: this.title,
      category: this.category,
      description: this.description,
      image: this.image,
      price: this.price,
    };

    if (this.options && Object.keys(this.options).length > 0) {
      product.options = this.options;
    }

    return product;
  }
}

function normalize(data: (RawProduct | RawOption | RawUnknown)[]) {
  const products = new Map<string, Product>();

  for (const item of data) {
    switch (item.type) {
      case "product": {
        const baseProduct = new Product();

        baseProduct.set(item as RawProduct);
        products.set(baseProduct.id, baseProduct);
        break;
      }
      case "option": {
        const existingProduct = products.get(item.id);

        if (existingProduct) {
          existingProduct.addOption(item as RawOption);
        }
        break;
      }
    }
  }

  return Array.from(products.values()).map((product) => product.toJSON());
}

const api = {
  list: async (): Promise<IProduct[]> => {
    return fetch(process.env.PRODUCTS!, {next: {tags: ["products"]}}).then(async (response) => {
      const csv = await response.text();

      return new Promise<IProduct[]>((resolve, reject) => {
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const data = normalize(results.data as (RawProduct | RawOption | RawUnknown)[]);

            return resolve(data);
          },
          error: (error: Error) => reject(error.message),
        });
      });
    });
  },
  fetch: async (id: string): Promise<IProduct> => {
    const products = await api.list();
    const product = products.find((product) => product.id === id);

    if (!product) return notFound();

    return product;
  },
};

export default api;
