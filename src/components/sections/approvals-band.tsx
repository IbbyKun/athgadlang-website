"use client";

import Image from "next/image";

import { SectionHeading } from "@/components/ui/section";
import { type Approval } from "@/lib/approvals";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

/** Between one tile appearing and the next. Enough to read as a sweep. */
const STAGGER_MS = 70;

/**
 * The authorities that list us as an approved auditor: white tiles on navy,
 * each carrying the authority's own mark, with the industry grid's lift on hover.
 *
 * White, and the logos in full colour. The tiles were brand red with the marks
 * knocked out to white, which works for a set of wordmarks but not for these:
 * they carry gradients, Arabic script and fine detail — a Jafza mosaic or a
 * Silicon Oasis lockup reduced to a silhouette is unreadable. Every one of these
 * marks is drawn for a white background, so that is what they get.
 *
 * Flex-wrap rather than a grid: the list does not divide by four, and a grid
 * pins the last row hard left where a centred remainder reads as intended.
 *
 * The strip is held well inside the section's own width. At the full `wide`
 * container each tile ran to 25rem, which is more room than any of these marks
 * needs; narrower tiles also give the hover zoom somewhere to go.
 */
export function ApprovalsBand({
  title = "Recognized & Approved Auditors",
  description,
  items,
}: {
  title?: string;
  description?: string;
  items: Approval[];
}) {
  const { ref, inView } = useInView<HTMLUListElement>({ threshold: 0.15 });

  /** Null means the observer has not reported yet — show it. See useInView. */
  const parked = inView === false;

  return (
    <div className="flex flex-col gap-10">
      <SectionHeading title={title} description={description} tone="inverted" />

      <ul
        ref={ref}
        className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4"
      >
        {items.map((approval, index) => (
          <li
            key={approval.id}
            style={{
              // Only on the way in. Left in place it would also delay the hover
              // lift, which has to feel immediate.
              transitionDelay: parked ? "0ms" : `${index * STAGGER_MS}ms`,
            }}
            className={cn(
              // `group` so the mark can react to the tile being hovered; the
              // tile is what the pointer is actually over.
              "group flex h-28 w-[calc(50%-0.5rem)] items-center justify-center overflow-hidden rounded-xl bg-white px-8",
              "ring-1 ring-white/10 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl",
              "sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]",
              // Rises and fades in as the band reaches the fold. The hover lift
              // still wins once it has settled, because Tailwind orders
              // `hover:` after the base utilities.
              parked ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100",
              "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
          >
            {approval.logo ? (
              <Image
                src={approval.logo.src}
                alt={approval.logo.alt}
                width={approval.logo.width}
                height={approval.logo.height}
                // Sized by height so the strip reads evenly, then capped on
                // width: the widest lockup here is five-to-one and would
                // otherwise run into the tile's padding.
                //
                // Capped at 85% rather than the full width so the hover zoom
                // has headroom inside a tile that clips its overflow — at
                // max-w-full the widest marks grew straight into the edge.
                // Still only 110%: these are third-party marks, and a hard zoom
                // on someone else's logo reads as a glitch, not as polish.
                className={cn(
                  "max-h-12 w-auto max-w-[85%] object-contain",
                  "transition-transform duration-500 ease-out group-hover:scale-110",
                  "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
                )}
              />
            ) : (
              // No mark supplied. Set in navy rather than white — the tile is
              // white now, and the fallback has to read as a name either way.
              <span className="text-center text-lg font-bold tracking-tight text-brand-navy">
                {approval.short ?? approval.name}
                {approval.short && (
                  <span className="sr-only">, {approval.name}</span>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
