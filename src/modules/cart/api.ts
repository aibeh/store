import type {Field, RadioField, TextField} from "./types";

import Papa from "papaparse";

interface RawField {
  title: string;
  type: "radio" | "text";
  text: string;
  note: string;
  required: string;
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
      return fetch(process.env.FIELDS!, {next: {tags: ["fields"]}}).then(async (response) => {
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
  mock: {
    list: (mock: string): Promise<Field[]> =>
      import(`./mocks/${mock}.json`).then((result: {default: RawField[]}) =>
        normalize(result.default),
      ),
  },
};

export default api;
