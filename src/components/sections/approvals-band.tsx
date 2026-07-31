import Image from "next/image";

import { SectionHeading } from "@/components/ui/section";
import { type Approval } from "@/lib/approvals";
import { cn } from "@/lib/utils";

/**
 * The authorities that list us as an approved auditor: brand-red tiles on navy,
 * carrying the industry grid's colour and its lift on hover.
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
              "flex h-28 w-[calc(50%-0.5rem)] items-center justify-center rounded-xl bg-brand px-6 text-white",
              "transition duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              "sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]",
            )}
          >
            {approval.logo ? (
              <Image
                src={approval.logo.src}
                alt={approval.logo.alt}
                width={200}
                height={80}
                // Knocked out to white: eleven house styles cannot each keep
                // their own colour on a red tile and still read as one strip.
                className="h-12 w-auto object-contain brightness-0 opacity-90 invert transition-opacity hover:opacity-100"
              />
            ) : (
              <span className="text-center text-lg font-bold tracking-tight">
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
