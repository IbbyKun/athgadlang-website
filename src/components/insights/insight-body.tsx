import { type InsightBlock } from "@/lib/insights";

/**
 * Renders an article body from its blocks. The first paragraph is treated as
 * the lead — set larger and followed by a rule, matching the article layout
 * used across the site.
 */
export function InsightBody({ blocks }: { blocks: InsightBlock[] }) {
  const [first, ...rest] = blocks;
  const lead = first?.type === "paragraph" ? first : undefined;
  const body = lead ? rest : blocks;

  return (
    <div>
      {lead && (
        <>
          <p className="text-pretty text-lg leading-relaxed text-neutral-700">
            {lead.text}
          </p>
          <hr className="my-8 border-neutral-200" />
        </>
      )}

      <div className="flex flex-col gap-5">
        {body.map((block, index) => (
          <Block key={index} block={block} />
        ))}
      </div>
    </div>
  );
}

function Block({ block }: { block: InsightBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="mt-3 text-xl font-bold tracking-tight text-brand-navy">
          {block.text}
        </h2>
      );

    case "list":
      return (
        <ul className="flex flex-col gap-2.5">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-base leading-relaxed text-neutral-700"
            >
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
              />
              {item}
            </li>
          ))}
        </ul>
      );

    case "paragraph":
      return (
        <p className="text-pretty text-base leading-relaxed text-neutral-700">
          {block.text}
        </p>
      );
  }
}
