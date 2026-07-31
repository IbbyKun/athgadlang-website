import { WhatsappIcon } from "@/components/icons/social";
import { externalLinkProps } from "@/lib/links";
import { whatsapp } from "@/lib/site-config";

/**
 * Floating chat button, as on the current site.
 *
 * A plain link — no script, no widget, no WhatsApp Business API. The label sits
 * beside it and appears on hover or keyboard focus; a touch screen has no hover,
 * so there the button stands on its own and carries the label as its accessible
 * name instead.
 *
 * z-40 keeps it under the header and the mobile drawer, both of which are z-50.
 */
export function WhatsappButton() {
  return (
    <a
      href={whatsapp.href}
      {...externalLinkProps}
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-4 z-40 inline-flex items-center gap-3 rounded-full outline-none sm:right-6 print:hidden"
    >
      {/* Grows out of the button it belongs to: scaled from the right edge and
          nudged in, so it reads as one movement rather than a plain fade. */}
      <span
        role="tooltip"
        className="pointer-events-none relative origin-right translate-x-2 scale-95 rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-navy opacity-0 shadow-xl ring-1 ring-black/5 transition duration-200 ease-out group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 max-sm:hidden motion-reduce:transition-none motion-reduce:group-hover:transform-none"
      >
        Need Help? Chat with us
        {/* Caret, pointing at the button. */}
        <span
          aria-hidden
          className="absolute -right-1 top-1/2 size-3 -translate-y-1/2 rotate-45 rounded-[2px] bg-white"
        />
      </span>

      <span className="grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-brand-navy group-focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        <WhatsappIcon className="size-7" />
      </span>
    </a>
  );
}
