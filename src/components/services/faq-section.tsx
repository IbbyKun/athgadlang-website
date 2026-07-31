import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section";
import { type ServiceFaq } from "@/lib/services";

/**
 * Frequently asked questions, on the shadcn accordion.
 *
 * `type="single"` with `collapsible`: one answer at a time, and the open one can
 * be closed again. Nothing is open on load, so the list reads as a set of
 * questions rather than one answer with a tail.
 */
export function FaqSection({ faqs }: { faqs: ServiceFaq[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
      <SectionHeading
        align="left"
        title="Frequently Asked Questions"
        description="If yours is not here, ask us directly — the answer usually depends on your circumstances."
        className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start"
      />

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.question}
            value={faq.question}
            className="border-b border-neutral-200"
          >
            <AccordionTrigger className="py-5 text-base font-semibold text-brand-navy hover:no-underline data-[state=open]:text-brand">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-8 text-base leading-relaxed text-neutral-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
