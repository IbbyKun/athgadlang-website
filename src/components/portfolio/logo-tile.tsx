import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Client } from "@/lib/clients";

type LogoTileProps = {
  client: Client;
  className?: string;
};

/**
 * One card in the logo gallery. Renders the client's logo when the asset
 * exists, and a typographic wordmark until then — a stand-in image would
 * misrepresent the brand, plain type does not.
 */
export function LogoTile({ client, className }: LogoTileProps) {
  return (
    <div
      className={cn(
        "group/tile grid h-24 w-52 shrink-0 place-items-center rounded-xl bg-brand px-6 shadow-lg sm:h-28 sm:w-60",
        "ring-1 ring-white/15 transition duration-300 ease-out",
        // Inverts on hover: red tile with white type becomes white with red.
        "hover:-translate-y-1 hover:bg-white hover:shadow-2xl hover:ring-brand/40",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {client.logo ? (
        <Image
          src={client.logo}
          alt={client.name}
          width={200}
          height={80}
          sizes="15rem"
          className="max-h-14 w-auto object-contain transition-transform duration-300 group-hover/tile:scale-105 motion-reduce:transition-none"
        />
      ) : (
        <span
          className={cn(
            "text-center font-bold leading-tight tracking-tight text-white transition-colors duration-300",
            "group-hover/tile:text-brand",
            client.name.length > 16 ? "text-sm" : "text-lg",
          )}
        >
          {client.name}
        </span>
      )}
    </div>
  );
}
