import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * One screen tall, with the top padding needed to clear the header. Every
 * full-screen section uses this, so a floating/overlay header and parallax
 * can be introduced later without any section hiding text behind the navbar.
 */
export const fullScreenSectionClass =
  "min-h-svh pt-[calc(var(--header-h)+2rem)] pb-16";

type SectionProps = React.ComponentProps<"section"> & {
  /**
   * Make the section exactly one viewport tall — navbar height included —
   * with content padded clear of the navbar.
   */
  fullScreen?: boolean;
  /** Set false to lay out children edge-to-edge without the page container. */
  contained?: boolean;
  containerSize?: React.ComponentProps<typeof Container>["size"];
};

/**
 * Standard page section: consistent vertical rhythm, optional full-screen
 * height, and `scroll-mt` so in-page anchors clear the sticky header.
 */
export function Section({
  fullScreen = false,
  contained = true,
  containerSize,
  className,
  children,
  ...props
}: SectionProps) {
  // When full-screen, the container must flex too, otherwise `flex-1` on the
  // section's children has no definite height to grow into.
  const body = contained ? (
    <Container
      size={containerSize}
      className={cn(fullScreen && "flex flex-1 flex-col justify-center")}
    >
      {children}
    </Container>
  ) : (
    children
  );

  return (
    <section
      className={cn(
        "relative w-full scroll-mt-(--header-h)",
        fullScreen
          ? cn("flex flex-col justify-center", fullScreenSectionClass)
          : "py-20",
        className,
      )}
      {...props}
    >
      {body}
    </section>
  );
}

type SectionHeadingProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  /** Use "inverted" on dark sections. */
  tone?: "default" | "inverted";
  /** Rendered element for the heading — use h1 only when it owns the page. */
  as?: "h2" | "h3";
  className?: string;
};

/**
 * Centred title flanked by brand rules, matching the athGADLANG section style.
 */
export function SectionHeading({
  title,
  description,
  align = "center",
  tone = "default",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const inverted = tone === "inverted";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <Heading
        className={cn(
          // One step down from where this started: at 3xl/4xl the headings
          // competed with the hero on every page they appeared on.
          "flex items-center gap-4 text-2xl font-bold tracking-tight sm:text-3xl",
          inverted ? "text-white" : "text-brand-navy",
        )}
      >
        {align === "center" && <Rules inverted={inverted} />}
        {title}
        <Rules inverted={inverted} />
      </Heading>

      {description && (
        <p
          className={cn(
            "max-w-2xl text-pretty text-base leading-relaxed",
            inverted ? "text-white/75" : "text-neutral-600",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/** The paired brand rules either side of a section title. */
function Rules({ inverted }: { inverted?: boolean }) {
  return (
    <span aria-hidden className="flex shrink-0 flex-col gap-1">
      <span
        className={cn("block h-0.5 w-7", inverted ? "bg-white/70" : "bg-brand")}
      />
      <span
        className={cn("block h-0.5 w-7", inverted ? "bg-white/70" : "bg-brand")}
      />
    </span>
  );
}
