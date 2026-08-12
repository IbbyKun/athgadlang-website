import { SectionLink } from "@/components/ui/section-link";
import { ArrowUp, Clock, Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { socialIcons } from "@/components/icons/social";
import { Container } from "@/components/ui/container";
import { externalLinkProps, isExternal } from "@/lib/links";
import { offices } from "@/lib/offices";
import { type Tenant } from "@/lib/tenants";
import {
  companyLinks,
  contactFor,
  footerServiceLinks,
  legalLinks,
  siteConfig,
  socialLinks,
} from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Four tiers, each separated by a hairline: a newsletter band, the link
 * matrix, the office network, then the legal bar. The tiers give hierarchy
 * that four equal columns cannot.
 */
export function SiteFooter({ tenant }: { tenant: Tenant }) {
  const contact = contactFor(tenant.code);

  return (
    <footer className="bg-brand-navy text-white">
      {/* Brand hairline, brightest at the centre. */}
      <div
        aria-hidden
        className="h-px bg-gradient-to-r from-transparent via-brand to-transparent"
      />

      <div className="border-b border-white/10">
        <Container size="wide" className="py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-md">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Stay ahead of what&rsquo;s next.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Insights, regulatory updates and webinar invitations — straight
                to your inbox.
              </p>
            </div>
            <NewsletterForm className="w-full lg:max-w-md" />
          </div>
        </Container>
      </div>

      <Container size="wide" className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-12">
          <div className="flex flex-col items-start gap-5">
            <Logo tenant={tenant} tone="light" size="md" priority={false} />
            <p className="text-sm leading-relaxed text-white/60">
              Assurance, accounting, tax and advisory across the UAE, KSA,
              Bahrain, the UK and Pakistan.
            </p>

            <ul className="mt-1 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <li key={social.platform}>
                    <a
                      href={social.href}
                      {...externalLinkProps}
                      aria-label={`${siteConfig.name} on ${social.label}`}
                      className="grid size-9 place-items-center rounded-lg bg-white/[0.06] text-white/70 ring-1 ring-white/10 transition-colors hover:bg-brand hover:text-white hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <FooterNav label="Services" links={footerServiceLinks} />
          <FooterNav label="Company" links={companyLinks} />

          <div>
            <MicroLabel>Get in touch</MicroLabel>
            <ul className="mt-5 flex flex-col gap-4 text-sm">
              <DetailRow icon={<Mail className="size-4" />}>
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  {contact.email}
                </a>
              </DetailRow>
              <DetailRow icon={<Phone className="size-4" />}>
                <a href={contact.phoneHref} className={linkClass}>
                  {contact.phone}
                </a>
              </DetailRow>
              <DetailRow icon={<MapPin className="size-4" />}>
                <a
                  href={contact.mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(linkClass, "leading-relaxed")}
                >
                  {contact.address}
                </a>
              </DetailRow>
              <DetailRow icon={<Clock className="size-4" />}>
                <span className="text-white/60">{contact.openHours}</span>
              </DetailRow>
            </ul>
          </div>
        </div>
      </Container>

      {/* The office network, as one quiet line. */}
      <div className="border-t border-white/10">
        <Container size="wide" className="py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <MicroLabel as="p">Offices</MicroLabel>
            <ul className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-white/60">
              {offices.map((office, index) => (
                <li key={office.slug} className="flex items-center gap-2">
                  {/* Listed as equals — no office is singled out as the head
                      office anywhere on the site. */}
                  <SectionLink
                    href="/#contact"
                    className="transition-colors hover:text-white"
                  >
                    {office.country}
                  </SectionLink>
                  {index < offices.length - 1 && (
                    <span aria-hidden className="text-white/25">
                      &middot;
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>

      <div className="border-t border-white/10">
        <Container size="wide" className="py-5">
          <div className="flex flex-col-reverse items-center gap-4 text-sm text-white/55 sm:flex-row sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <SectionLink key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </SectionLink>
              ))}
              <a
                href="#top"
                className="group inline-flex items-center gap-1.5 text-white/70 transition-colors hover:text-white"
              >
                Top
                <span className="grid size-6 place-items-center rounded-full ring-1 ring-white/20 transition-colors group-hover:bg-brand group-hover:ring-brand">
                  <ArrowUp aria-hidden className="size-3" />
                </span>
              </a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

const linkClass = "text-white/60 transition-colors hover:text-white";

/** Small caps label — sets the column hierarchy without shouting. */
function MicroLabel({
  children,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  as?: "h2" | "p";
}) {
  return (
    /*
      white/70, not white/45. At 45% over the navy this measured 3.65:1, and
      these are the labels that tell a reader which column they are reading —
      the last thing that should be the hardest to see. 70% clears 4.5:1 and
      still reads as a quiet label rather than a heading competing with the
      links under it.
    */
    <Tag className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/70">
      {children}
    </Tag>
  );
}

function FooterNav({
  label,
  links,
}: {
  label: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={label}>
      <MicroLabel>{label}</MicroLabel>
      <ul className="mt-5 flex flex-col gap-3 text-sm">
        {links.map((link) => {
          const className =
            "inline-block text-white/70 transition-all hover:translate-x-0.5 hover:text-white";
          return (
            <li key={link.href}>
              {isExternal(link.href) ? (
                <a href={link.href} {...externalLinkProps} className={className}>
                  {link.label}
                </a>
              ) : (
                <SectionLink href={link.href} className={className}>
                  {link.label}
                </SectionLink>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function DetailRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span aria-hidden className="mt-0.5 shrink-0 text-brand">
        {icon}
      </span>
      {children}
    </li>
  );
}
