import { TestimonialCard } from "@/components/cards/testimonial-card";
import { Section, SectionHeading } from "@/components/ui/section";
import {
  testimonials as allTestimonials,
  type Testimonial,
} from "@/lib/testimonials";

type TestimonialsSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: Testimonial[];
  fullScreen?: boolean;
};

export function TestimonialsSection({
  title = "Testimonials",
  description = "What our clients say about working with us.",
  items = allTestimonials,
  fullScreen = true,
}: TestimonialsSectionProps) {
  return (
    <Section
      id="testimonials"
      fullScreen={fullScreen}
      containerSize="wide"
      className="bg-neutral-50"
    >
      <div className="flex flex-col gap-8">
        <SectionHeading title={title} description={description} />

        {/* Two landscape cards per row: the quotes need width, not height. */}
        <div className="grid gap-6 lg:grid-cols-2">
          {items.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </Section>
  );
}
