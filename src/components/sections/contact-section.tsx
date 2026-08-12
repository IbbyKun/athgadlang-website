import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { MapStage } from "@/components/maps/map-stage";
import { Section, SectionHeading } from "@/components/ui/section";
import { offices } from "@/lib/offices";
import { contactFor } from "@/lib/site-config";
import { type TenantCode } from "@/lib/tenants";

type ContactSectionProps = {
  /** Whose office is named in the details — the region being viewed. */
  tenant: TenantCode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  fullScreen?: boolean;
};

export function ContactSection({
  tenant,
  title = "Contact Us",
  description = "Tell us what you need and the right specialist will come back to you — usually within one business day.",
  fullScreen = true,
}: ContactSectionProps) {
  const contact = contactFor(tenant);

  return (
    <Section
      id="contact"
      fullScreen={fullScreen}
      contained={false}
      className="isolate overflow-hidden bg-brand-navy"
    >
      <MapStage offices={offices} current={contact.office.slug}>
        {/* Even halves, with the card capped and centred in its own half
            rather than stretched — a contact form reads badly at full width. */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-8">
            <SectionHeading
              tone="inverted"
              title={title}
              description={description}
            />
            <ContactDetails contact={contact} />
          </div>

          {/* No panel of its own: the form sits straight on the tinted map.
              The fields are solid white, so they carry their own edges and the
              card was only adding a second frame around them. */}
          <div className="w-full max-w-[32rem] self-center lg:justify-self-center">
            <ContactForm />
          </div>
        </div>
      </MapStage>
    </Section>
  );
}

/** Email, phone and address for the region being viewed. */
function ContactDetails({
  contact,
}: {
  contact: ReturnType<typeof contactFor>;
}) {
  return (
    <ul className="mt-auto flex flex-col gap-5">
      <DetailRow icon={<Mail className="size-5" />} label="Email">
        <a href={`mailto:${contact.email}`} className={linkClass}>
          {contact.email}
        </a>
      </DetailRow>

      <DetailRow icon={<Phone className="size-5" />} label="Telephone">
        <a href={contact.phoneHref} className={linkClass}>
          {contact.phone}
        </a>
      </DetailRow>

      <DetailRow icon={<MapPin className="size-5" />} label="Office">
        <a
          href={contact.mapHref}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          {contact.address}
        </a>
      </DetailRow>
    </ul>
  );
}

const linkClass =
  "underline-offset-4 decoration-white/30 transition-colors hover:text-white hover:underline";

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3.5 text-[0.95rem] leading-relaxed text-white/85">
      <span aria-hidden className="mt-0.5 shrink-0 text-white/60">
        {icon}
      </span>
      <span className="sr-only">{label}:</span>
      {children}
    </li>
  );
}
