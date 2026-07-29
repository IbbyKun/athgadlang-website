import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { fullScreenSectionClass } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export type HeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "outline";
};

type HeroProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  image: { src: string; alt: string };
  actions?: HeroAction[];
  /**
   * One full viewport tall, with content padded clear of the navbar. Turn off
   * for shorter inner-page heroes.
   */
  fullScreen?: boolean;
  align?: "left" | "center";
  className?: string;
};

/**
 * Reusable image hero. Every page passes its own copy and photo; the
 * layering, overlay and type scale stay consistent site-wide.
 */
export function Hero({
  eyebrow,
  title,
  description,
  image,
  actions = [],
  fullScreen = true,
  align = "left",
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative isolate flex w-full items-center overflow-hidden bg-neutral-900",
        fullScreen ? fullScreenSectionClass : "min-h-[26rem] py-20",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />

      {/* Two overlays: a horizontal wash for text contrast, plus a light
          vertical darkening so the top edge meets the white header cleanly. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10",
          align === "left"
            ? "bg-gradient-to-r from-neutral-950/85 via-neutral-950/65 to-neutral-950/25"
            : "bg-neutral-950/65",
        )}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-950/40 via-transparent to-neutral-950/40"
      />

      <Container>
        <div
          className={cn(
            "flex max-w-2xl flex-col gap-6",
            align === "center" && "mx-auto max-w-3xl items-center text-center",
          )}
        >
          {eyebrow && (
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              <span aria-hidden className="h-0.5 w-8 bg-brand" />
              {eyebrow}
            </p>
          )}

          <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="max-w-xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
              {description}
            </p>
          )}

          {actions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
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
      </Container>
    </section>
  );
}
