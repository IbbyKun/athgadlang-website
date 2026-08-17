import { SectionLink } from "@/components/ui/section-link";

import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { actionButtonClass } from "@/components/ui/view-more-button";
import { cn } from "@/lib/utils";

type CtaBandAction = {
  label: string;
  href: string;
  variant?: "primary" | "outline";
};

type CtaBandProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: CtaBandAction[];
  className?: string;
};

/**
 * Navy closing band, as the homepage closes. Used to end the inner index and
 * article pages so they resolve into a next step rather than into the footer.
 */
export function CtaBand({
  title,
  description,
  actions = [],
  className,
}: CtaBandProps) {
  return (
    <Section className={cn("bg-brand-navy", className)}>
      <div className="flex flex-col items-center gap-7">
        <SectionHeading tone="inverted" title={title} description={description} />

        {actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {actions.map((action) => (
              <Button
                key={action.href}
                asChild
                size="lg"
                /* White on the navy band, not brand red: red on this navy is
                   the pairing that fails contrast. */
                className={actionButtonClass(
                  action.variant === "outline" ? "outline" : "light",
                )}
              >
                <SectionLink href={action.href}>{action.label}</SectionLink>
              </Button>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
