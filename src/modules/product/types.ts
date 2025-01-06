export interface OptionCategory {
  title: string;
  options: Option[];
  condition?: string; // Format: ">5", "=3", etc.
}

export interface Option {
  title: string;
  price: number;
  category: string;
  quantity?: number;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  options?: Record<
    string,
    {
      options: Option[];
      condition: string;
    }
  >;
  price: number;
}
