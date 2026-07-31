import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
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
                variant={action.variant === "outline" ? "outline" : "default"}
                className={cn(
                  "rounded-lg",
                  action.variant === "outline" &&
                    "border-white/40 bg-transparent text-white hover:bg-white hover:text-neutral-900",
                )}
              >
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
