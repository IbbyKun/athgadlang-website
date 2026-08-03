import Image from "next/image";

import { SectionHeading } from "@/components/ui/section";
import { type Approval } from "@/lib/approvals";
import { cn } from "@/lib/utils";

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
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading title={title} description={description} tone="inverted" />

      <ul className="flex flex-wrap justify-center gap-4">
        {items.map((approval) => (
          <li
            key={approval.id}
            className={cn(
              // `group` so the mark can react to the tile being hovered; the
              // tile is what the pointer is actually over.
              "group flex h-28 w-[calc(50%-0.5rem)] items-center justify-center overflow-hidden rounded-xl bg-white px-6",
              "ring-1 ring-white/10 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              "sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]",
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
                // Leans in slightly with the tile's lift. Kept to 105% — these
                // are third-party marks and a hard zoom on someone else's logo
                // reads as a glitch rather than as polish.
                className={cn(
                  "max-h-12 w-auto max-w-full object-contain",
                  "transition-transform duration-500 ease-out group-hover:scale-105",
                  "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
                )}
              />
            ) : (
              // No mark supplied. Set in navy rather than white — the tile is
              // white now, and the fallback has to read as a name either way.
              <span className="text-center text-lg font-bold tracking-tight text-brand-navy">
                {approval.short ?? approval.name}
                {approval.short && (
                  <span className="sr-only"> — {approval.name}</span>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
