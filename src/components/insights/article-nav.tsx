import Image from "next/image";
import Link from "next/link";

import { insightHref, type Insight } from "@/lib/insights";
import { cn } from "@/lib/utils";

type ArticleNavProps = {
  previous?: Insight;
  next?: Insight;
};

/**
 * Previous / next article links, split by a hairline with a brand dot at the
 * centre. Each side keeps its column when the other is missing, so the pair
 * stays anchored to the outer edges at either end of the archive.
 */
export function ArticleNav({ previous, next }: ArticleNavProps) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="More articles" className="flex flex-col gap-8">
      <Divider />

      <div className="grid gap-8 sm:grid-cols-2">
        {previous ? (
          <NavLink insight={previous} label="Previous Post" side="previous" />
        ) : (
          <span aria-hidden />
        )}

        {next && <NavLink insight={next} label="Next Post" side="next" />}
      </div>
    </nav>
  );
}

/** Hairline with a ringed brand dot centred on it. */
function Divider() {
  return (
    <div aria-hidden className="relative flex items-center">
      <span className="h-px w-full bg-neutral-200" />
      <span className="absolute left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-neutral-50 ring-1 ring-brand/40">
        <span className="size-1.5 rounded-full bg-brand" />
      </span>
    </div>
  );
}

function NavLink({
  insight,
  label,
  side,
}: {
  insight: Insight;
  label: string;
  side: "previous" | "next";
}) {
  const isNext = side === "next";

  return (
    <Link
      href={insightHref(insight)}
      className={cn(
        "group flex items-start gap-4 rounded-xl p-2 transition-colors hover:bg-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        // The next article sits against the right edge, thumbnail last.
        isNext && "sm:col-start-2 sm:flex-row-reverse sm:text-right",
      )}
    >
      <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={insight.image.src}
          alt=""
          fill
          sizes="4rem"
          className="object-cover"
        />
      </span>

      <span className="flex flex-col gap-1">
        <span className="text-sm text-neutral-500">{label}</span>
        <span className="text-base font-bold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand">
          {insight.title}
        </span>
      </span>
    </Link>
  );
}
