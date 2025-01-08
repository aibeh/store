import type {Store} from "@/modules/store/types";

import Link from "next/link";

import Whatsapp from "./icons/whatsapp";
import Instagram from "./icons/instagram";

export function Header({store}: {store: Store}) {
  return (
    <header className="w-full border-b">
      <div className="px-4 md:px-0">
        <div className="flex items-center justify-between py-2 text-sm text-foreground/50">
          <div className="flex items-center gap-4">
            <Link
              className="flex items-center gap-2 hover:text-foreground"
              href={store.instagram}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Instagram />
              <span className="hidden md:block">{store.instagram.split("/")[3]}</span>
            </Link>
            <Link
              className="flex items-center gap-2 hover:text-foreground"
              href={store.whatsapp}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Whatsapp />
              <span className="hidden md:block">
                {store.phone.slice(3, 5)} {store.phone.slice(5, 9)}-{store.phone.slice(9)}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span>Lun. a Vie. de 9:00 a 18:00 hs.</span>
          </div>
        </div>
      </div>
    </header>
  );
}
