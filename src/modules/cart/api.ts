import type {Coupon, Field, RadioField, TextField} from "./types";

import Papa from "papaparse";
import {cacheLife, cacheTag} from "next/cache";

interface RawField {
  title: string;
  type: "radio" | "text";
  text: string;
  note: string;
  required: string;
}

interface RawCoupon {
  "código": string;
  "pack 5": string;
  "pack 10": string;
  "pack 15": string;
  activo: string;
}

function normalizeCoupons(data: RawCoupon[]): Coupon[] {
  return data
    .filter((coupon) => coupon["código"] && coupon["código"].trim())
    .map((coupon) => ({
      codigo: coupon["código"].trim(),
      pack5: parseInt(coupon["pack 5"], 10) || 0,
      pack10: parseInt(coupon["pack 10"], 10) || 0,
      pack15: parseInt(coupon["pack 15"], 10) || 0,
      activo: coupon.activo === "TRUE",
    }));
}

function normalize(data: RawField[]): Field[] {
  return data.map((field) => {
    switch (field.type) {
      case "radio": {
        const radioField: RadioField = {
          title: field.title,
          type: "radio",
          options: field.text.split(",").map((option) => option.trim()),
          required: field.required === "TRUE",
          note: field.note || "",
        };

        return radioField;
      }

      case "text": {
        const textField: TextField = {
          title: field.title,
          type: "text",
          placeholder: field.text,
          required: field.required === "TRUE",
          note: field.note || "",
        };

        return textField;
      }

      default: {
        throw new Error(`Unknown field type`);
      }
    }
  });
}

const api = {
  field: {
    list: async (): Promise<Field[]> => {
    "use cache";
    cacheLife("max");
    cacheTag("fields");
      return fetch(process.env.FIELDS!).then(async (response) => {
        const csv = await response.text();

        return new Promise<Field[]>((resolve, reject) => {
          Papa.parse(csv, {
            header: true,
            complete: (results) => {
              const data = normalize(results.data as RawField[]);

              return resolve(data);
            },
            error: (error: Error) => reject(error.message),
          });
        });
      });
    },
  },
  coupon: {
    list: async (): Promise<Coupon[]> => {
    "use cache";
    cacheLife("max");
    cacheTag("coupons");
      if (!process.env.COUPONS) return [];

      return fetch(process.env.COUPONS).then(async (response) => {
        const csv = await response.text();

        return new Promise<Coupon[]>((resolve, reject) => {
          Papa.parse(csv, {
            header: true,
            complete: (results) => resolve(normalizeCoupons(results.data as RawCoupon[])),
            error: (error: Error) => reject(error.message),
          });
        });
      });
    },
  },
};

export default api;
