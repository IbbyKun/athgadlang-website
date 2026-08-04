import { renderRichText, splitLead, type RichDoc } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

/**
 * Renders an admin-authored article body.
 *
 * The counterpart to <InsightBody>, which renders the built-in articles from
 * their block structure. Both must produce the same page: same lead treatment,
 * same rule, same heading and list typography — a reader should not be able to
 * tell which of the two wrote the article they are looking at. If the
 * typography here changes, change it there as well.
 *
 * The markup comes from `renderRichText`, which re-serialises the stored
 * ProseMirror document through a fixed schema. Nothing outside that schema can
 * appear in the output, which is what makes `dangerouslySetInnerHTML` safe
 * here — see src/lib/rich-text.ts.
 */
export function RichBody({ doc }: { doc: RichDoc }) {
  const { lead, body } = splitLead(doc);

  const leadHtml = lead ? renderRichText(lead) : "";
  const bodyHtml = renderRichText(body);

  return (
    <div>
      {leadHtml && (
        <>
          <div
            className="text-pretty text-lg leading-relaxed text-neutral-700"
            dangerouslySetInnerHTML={{ __html: leadHtml }}
          />
          <hr className="my-8 border-neutral-200" />
        </>
      )}

      {bodyHtml && (
        <div
          className={cn(
            "flex flex-col gap-5",

            "[&_p]:text-pretty [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-neutral-700",
            "[&_h2]:mt-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-brand-navy",
            "[&_h3]:text-base [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:text-brand-navy",

            "[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2.5",
            "[&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2.5 [&_ol]:pl-5",
            "[&_li]:text-base [&_li]:leading-relaxed [&_li]:text-neutral-700",
            // Brand dot in place of the default marker, matching the bullets
            // <InsightBody> draws with a span. Ordered lists keep their
            // numbers, so this is scoped to unordered ones.
            "[&_ul>li]:relative [&_ul>li]:list-none [&_ul>li]:pl-6",
            "[&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.6875rem]",
            "[&_ul>li]:before:size-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-brand [&_ul>li]:before:content-['']",

            "[&_blockquote]:border-l-2 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic",
            "[&_strong]:font-bold [&_strong]:text-brand-navy",
            "[&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-brand-hover",

            // A figure between paragraphs, not something inline.
            "[&_img]:w-full [&_img]:rounded-xl",

            /*
              Tables scroll sideways rather than forcing the article to.
              `display: block` on the table is what gives it its own scroll
              container without a wrapper element — the renderer emits a bare
              <table>, and there is nowhere to put one. `tbody` is put back to
              `table` so rows and cells still lay out as a grid inside it.
            */
            "[&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto",
            "[&_table]:border-collapse [&_table]:text-left",
            "[&_table>tbody]:table [&_table>tbody]:w-full",
            "[&_th]:border-b [&_th]:border-neutral-300 [&_th]:px-3 [&_th]:py-2",
            "[&_th]:text-sm [&_th]:font-bold [&_th]:text-brand-navy",
            "[&_td]:border-b [&_td]:border-neutral-200 [&_td]:px-3 [&_td]:py-2",
            "[&_td]:align-top [&_td]:text-sm [&_td]:leading-relaxed [&_td]:text-neutral-700",
            // Cell contents are paragraphs; they must not inherit the article's
            // paragraph spacing or every row grows.
            "[&_td>p]:m-0 [&_th>p]:m-0",
          )}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      )}
    </div>
  );
}
