import type {Product} from "./types";

const WEEKLY_MENU_CATEGORY = "Nuestras opciones:";

export function getWeeklyMenu(products: Product[]): string[] {
  const titles = new Set<string>();

  for (const product of products) {
    const category = product.options?.[WEEKLY_MENU_CATEGORY];

    category?.options.forEach((option) => {
      titles.add(option.title);
    });
  }

  return Array.from(titles);
}
