import Image from "next/image";

/**
 * A supplied full-width graphic used as a section in its own right.
 *
 * Some bands are delivered as finished artwork rather than as copy to lay out —
 * an award badge is the awarding body's design, and recreating it in HTML means
 * approximating typefaces and a foil shield for no gain. Where that artwork
 * exists it replaces the coded band entirely.
 *
 * Edge to edge and unconstrained by the page container: these graphics carry
 * their own background and margins, so a container would inset them and leave
 * the page colour showing down both sides.
 *
 * `sizes="100vw"` because the image is always the full width of the viewport,
 * and `priority` is deliberately not set — this band sits well down the page.
 */
export function SpecialSection({
  image,
}: {
  image: { src: string; alt: string; width: number; height: number };
}) {
  return (
    <section className="relative w-full">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="100vw"
        // Intrinsic dimensions plus `w-full h-auto`: the band keeps its own
        // aspect ratio at every width, so nothing in the artwork is cropped and
        // no height has to be guessed per breakpoint.
        className="h-auto w-full"
      />
    </section>
  );
}
