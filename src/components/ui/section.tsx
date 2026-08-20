import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * One screen tall from `sm` up, with the top padding needed to clear the
 * header. Every full-screen section uses this, so a floating/overlay header and
 * parallax can be introduced later without any section hiding text behind the
 * navbar.
 *
 * For a section you scroll *into*, which is all of them but the first. The
 * sticky bar does come to sit over those, so the allowance is real work — see
 * `leadingFullScreenSectionClass` for why the section that opens a page needs
 * the opposite treatment.
 *
 * Below `sm` the section is as tall as its content, and the name is wrong on
 * purpose: nothing here is full-screen on a phone. A screen-height pane is a
 * bargain that only pays on a screen wide enough to lay content out across it.
 * On a phone the columns collapse, so a section is either far taller than the
 * viewport — five stacked service cards — or far shorter, and the shorter ones
 * were the problem: the insights pane held about 600px of content inside 915px,
 * and `justify-center` on <Section> and <ScrollRow> split the remaining 315px
 * above and below it. Add the two paddings and the Consulting card sat ~245px
 * clear of the Insights heading. Measured on a 412x915 Pixel 7, 20 August 2026.
 *
 * Trimming the padding alone does not fix that, which is worth knowing before
 * anyone tries: centring converts the saved padding straight back into air, so
 * halving both paddings moved the heading 24px and the whole gap 40px. The
 * height is the thing doing it. With it gone the two paddings are the entire
 * gap between sections — 96px — and every one of them is honest space rather
 * than the residue of a viewport nobody asked to fill.
 *
 * From `sm` up this is unchanged, down to the asymmetry: 112px above, 64px
 * below, one full viewport tall. The desktop site is signed off.
 */
export const fullScreenSectionClass =
  "pt-12 pb-12 " +
  "sm:min-h-svh sm:pt-[calc(var(--header-h)+2rem)] sm:pb-16";

/**
 * The section that opens a page: phone-sized below `sm`, and the class above
 * verbatim from `sm` up.
 *
 * On a phone the full-screen treatment put the homepage h1 261px below the
 * header, with only 133px of visible room under the buttons — measured on a
 * 412x915 Pixel 7, 20 August 2026. Two things stacked to produce that, and both
 * come from the header being *above* this section in flow rather than over it:
 * `sticky` occupies its space like any other block, so the first thing in
 * <main> starts below the bar and is never covered by it.
 *
 *   - `min-h-svh` ignores the header, so the opening screen came to `header +
 *     one viewport` — 995px on that phone — and the hero's own bottom edge sat
 *     80px past the fold.
 *   - `pt-[calc(var(--header-h)+2rem)]` is an allowance for content the bar
 *     will cover. Nothing covers this section, so its only effect was to push a
 *     vertically centred block 112px down the screen.
 *
 * Below `sm` the height therefore stops tracking the viewport altogether. Even
 * with the arithmetic corrected, a hero is centred copy over a photograph and
 * on a phone that copy is far shorter than the screen: a four-line headline,
 * its paragraph and two stacked buttons come to about 440px inside an 835px
 * stage, which leaves ~200px of photograph above the text. The floor is
 * generous enough that a one-line headline still reads as a hero rather than a
 * banner, and short enough that the next section shows below the fold — which
 * on the homepage is the point, since the hero's job is to be scrolled past.
 * That one value is the knob.
 *
 * From `sm` up this restores `min-h-svh` and the asymmetric padding exactly,
 * double-counted header and all. Both faults above are just as true at 1440px,
 * where they cost the same 192px and hold the headline 64px lower than it needs
 * to be — but the desktop site is signed off and is deliberately not being
 * moved. Widen this to `md` if tablets should follow the phone instead; the
 * boundary is the only thing deciding which set of numbers a width gets.
 */
export const leadingFullScreenSectionClass =
  "min-h-[38rem] pt-10 pb-10 " +
  "sm:min-h-svh sm:pt-[calc(var(--header-h)+2rem)] sm:pb-16";

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
          // Two steps down from where this started: at 3xl/4xl the headings
          // competed with the hero on every page they appeared on, and at
          // 2xl/3xl they still read as titles rather than section markers.
          "flex items-center gap-4 text-xl font-bold tracking-tight sm:text-2xl",
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

/** The brand rule either side of a section title — one bar, not two. */
function Rules({ inverted }: { inverted?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block h-0.5 w-7 shrink-0",
        inverted ? "bg-white/70" : "bg-brand",
      )}
    />
  );
}
