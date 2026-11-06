import type {CartItem} from "../types";

import {
  getCartItemOptionsSummary,
  getCartItemPrice,
  getCartMessage,
  getCartTotal,
  getCashPrice,
  getCashTotal,
  getOrderPayload,
} from "../utils";

const item: CartItem = {
  id: "id",
  category: "category",
  description: "description",
  image: "image",
  price: 100,
  title: "title",
  quantity: 1,
};

describe("getCartItemPrice", () => {
  describe("Sin opciones", () => {
    it("debería devolver el precio correcto cuando hay una unidad", () => {
      const actual: number = getCartItemPrice(item);
      const expected = 100;

      expect(actual).toEqual(expected);
    });

    it("debería devolver el precio correcto cuando hay más de una unidad", () => {
      const actual: number = getCartItemPrice({...item, quantity: 2});
      const expected = 200;

      expect(actual).toEqual(expected);
    });
  });

  describe("Con opciones", () => {
    it("debería devolver el precio correcto cuando hay una unidad", () => {
      const actual: number = getCartItemPrice({
        ...item,
        options: {
          Peso: [
            {
              category: "Peso",
              id: "",
              description: "",
              image: "",
              price: 50,
              title: "Medio kilo",
            },
          ],
        },
      });
      const expected = 150;

      expect(actual).toEqual(expected);
    });

    it("debería devolver el precio correcto cuando hay más de una unidad", () => {
      const actual: number = getCartItemPrice({
        ...item,
        options: {
          Peso: [
            {
              category: "Peso",
              id: "",
              description: "",
              image: "",
              price: 50,
              title: "Medio kilo",
            },
          ],
        },
        quantity: 2,
      });
      const expected = 300;

      expect(actual).toEqual(expected);
    });

    it("debería devolver el precio correcto cuando hay una unidad y más de una opción", () => {
      const actual: number = getCartItemPrice({
        ...item,
        options: {
          Peso: [
            {
              category: "Peso",
              id: "",
              description: "",
              image: "",
              price: 50,
              title: "Medio kilo",
            },
          ],
          Calidad: [
            {
              category: "Calidad",
              id: "",
              description: "",
              image: "",
              price: 50,
              title: "Alta",
            },
          ],
        },
      });
      const expected = 200;

      expect(actual).toEqual(expected);
    });
  });
});

describe("getCartTotal", () => {
  it("debería devolver el precio correcto cuando hay una unidad", () => {
    const cart = new Map<number, CartItem>();

    cart.set(Date.now(), item);

    const actual = getCartTotal(cart);
    const expected = 100;

    expect(actual).toEqual(expected);
  });

  it("debería devolver el precio correcto cuando hay más de una unidad", () => {
    const cart = new Map<number, CartItem>();

    cart.set(Date.now(), item);
    cart.set(Date.now(), item);

    const actual = getCartTotal(cart);
    const expected = 200;

    expect(actual).toEqual(expected);
  });
});

describe("getCartItemOptionsSummary", () => {
  it("debería devolver el summary cuando tenemos una option", () => {
    const actual: string = getCartItemOptionsSummary({
      Peso: [
        {
          category: "Peso",
          id: "",
          description: "",
          image: "",
          price: 50,
          title: "Medio kilo",
        },
      ],
    });
    const expected = "Peso: Medio kilo";

    expect(actual).toEqual(expected);
  });

  it("debería devolver el summary cuando tenemos más de una opción", () => {
    const actual: string = getCartItemOptionsSummary({
      Peso: [
        {
          category: "Peso",
          id: "",
          description: "",
          image: "",
          price: 50,
          title: "Medio kilo",
        },
      ],
      Calidad: [
        {
          category: "Calidad",
          id: "",
          description: "",
          image: "",
          price: 50,
          title: "Alta",
        },
      ],
    });
    const expected = "Peso: Medio kilo, Calidad: Alta";

    expect(actual).toEqual(expected);
  });
});

describe("getCartMessage", () => {
  it("debería mostrar un mensaje cuando no hay options", () => {
    const cart = new Map<number, CartItem>();
    const checkout = new Map<string, string>();

    cart.set(Date.now(), item);
    checkout.set("Forma de pago", "Efectivo");

    const actual: string = getCartMessage(cart, checkout);
    const expected = `* title - $\u00a0100,00

Total: $\u00a0100,00`;

    expect(actual).toEqual(expected);
  });

  it("debería mostrar un mensaje cuando hay options", () => {
    const cart = new Map<number, CartItem>();
    const checkout = new Map<string, string>();

    cart.set(Date.now(), {
      ...item,
      options: {
        Peso: [
          {
            category: "Peso",
            id: "",
            description: "",
            image: "",
            price: 50,
            title: "Medio kilo",
          },
        ],
        Calidad: [
          {
            category: "Calidad",
            id: "",
            description: "",
            image: "",
            price: 50,
            title: "Alta",
          },
        ],
      },
    });

    checkout.set("Forma de pago", "Efectivo");

    const actual: string = getCartMessage(cart, checkout);
    const expected = `* title [Peso: Medio kilo, Calidad: Alta] - $\u00a0200,00

Total: $\u00a0200,00`;

    expect(actual).toEqual(expected);
  });
});

describe("Precio en efectivo de los packs", () => {
  const pack = (size: 5 | 10 | 15, price: number, quantity = 1): CartItem => ({
    ...item,
    id: `pack-${size}`,
    title: `¡Pack de ${size} viandas!`,
    price,
    quantity,
  });

  it("las tarjetas muestran el precio fijo de cada pack, sin importar el precio de transferencia", () => {
    expect(getCashPrice("¡Pack de 5 viandas!", 60000)).toEqual(54000);
    expect(getCashPrice("¡Pack de 10 viandas!", 108000)).toEqual(97500);
    expect(getCashPrice("¡Pack de 15 viandas!", 146000)).toEqual(131000);
    expect(getCashPrice("¡Pack de 5 viandas!", 59500)).toEqual(54000);
  });

  it("un producto que no es pack mantiene el 10% de descuento", () => {
    expect(getCashPrice("Pan integral con semillas", 5000)).toEqual(4500);
  });

  it("el total en efectivo de un pack solo es exactamente el precio fijo", () => {
    expect(getCashTotal(new Map([["a", pack(5, 60000)]]), 0)).toEqual(54000);
    expect(getCashTotal(new Map([["a", pack(10, 108000)]]), 0)).toEqual(97500);
    expect(getCashTotal(new Map([["a", pack(15, 146000)]]), 0)).toEqual(131000);
  });

  it("los extras mantienen el 10% de descuento y el envío se cobra completo", () => {
    const cart = new Map([
      ["a", pack(10, 108000)],
      ["b", {...item, id: "pan", title: "Pan integral con semillas", price: 5000}],
    ]);

    // 97.500 (pack) + 4.500 (pan con 10%) + 1.500 (envío completo)
    expect(getCashTotal(cart, 1500)).toEqual(103500);
  });

  it("un pack con envío en efectivo: precio fijo + envío sin descuento", () => {
    const cart = new Map([["a", pack(10, 108000)]]);

    expect(getCashTotal(cart, 1500)).toEqual(99000);
    expect(getCashTotal(new Map([["a", pack(5, 60000)]]), 2000)).toEqual(56000);
    expect(getCashTotal(new Map([["a", pack(15, 146000)]]), 4000)).toEqual(135000);
  });

  it("el mensaje de WhatsApp muestra el total en efectivo con el precio fijo", () => {
    const cart = new Map([["a", pack(10, 108000)]]);
    const checkout = new Map([["Método de pago", "Efectivo (10% OFF)"]]);

    expect(getCartMessage(cart, checkout, null)).toContain("Total con 10% OFF en efectivo: $\u00a097.500,00");
  });

  it("lo que se anota en la planilla coincide con lo que ve el cliente", () => {
    const cart = new Map([["a", pack(15, 146000)]]);
    const efectivo = new Map([["Método de pago", "Efectivo (10% OFF)"]]);
    const transferencia = new Map([["Método de pago", "Transferencia bancaria"]]);

    expect(getOrderPayload(cart, efectivo, null, null).totalConDescuentoEfectivo).toEqual(131000);
    expect(getOrderPayload(cart, transferencia, null, null).totalConDescuentoEfectivo).toBeNull();
    expect(getOrderPayload(cart, transferencia, null, null).total).toEqual(146000);
  });
});
