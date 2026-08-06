import { TestimonialCarousel } from "@/components/testimonials/testimonial-carousel";
import { Section, SectionHeading } from "@/components/ui/section";
import { featuredTestimonials, type Testimonial } from "@/lib/testimonials";

type TestimonialsSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: Testimonial[];
  fullScreen?: boolean;
};

/**
 * A centred slider rather than a grid: the quotes vary a lot in length, and a
 * two-column grid sized every card to the tallest one on its row.
 */
export function TestimonialsSection({
  title = "Testimonials",
  description = "What our clients say about working with us.",
  items = featuredTestimonials,
  fullScreen = true,
}: TestimonialsSectionProps) {
  return (
    <Section
      id="testimonials"
      fullScreen={fullScreen}
      containerSize="wide"
      className="bg-neutral-50"
    >
      <div className="flex flex-col gap-10">
        <SectionHeading title={title} description={description} />
        <TestimonialCarousel items={items} />
      </div>
    </Section>
  );
}
