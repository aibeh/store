import type {Store as IStore} from "./types";

import Papa from "papaparse";
import {cacheLife, cacheTag} from "next/cache";

export default {
  fetch: async (): Promise<IStore> => {
    "use cache";
    cacheLife("max");
    cacheTag("store");
    return fetch(process.env.STORE!).then(async (response) => {
      const csv = await response.text();

      return new Promise<IStore>((resolve, reject) => {
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            return resolve(results.data[0] as IStore);
          },
          error: (error: Error) => reject(error.message),
        });
      });
    });
  },
  mock: {
    fetch: (mock: string): Promise<IStore> =>
      import(`./mocks/${mock}.json`).then((result: {default: IStore}) => result.default),
  },
};
