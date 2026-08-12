import { officeForTenant } from "@/lib/offices";
import { contactFor } from "@/lib/site-config";
import { type TenantCode } from "@/lib/tenants";

/**
 * The three legal documents linked from the footer.
 *
 * Held as data rather than as three pages of JSX because they are the same
 * shape — a short preamble, then headed clauses — and one renderer keeps their
 * typography identical. Editing the wording means editing prose here, not
 * markup.
 *
 * The supplied copy carried bracketed placeholders: `[insert location]`,
 * `[insert governing law and jurisdiction]`, `[insert contact information]`.
 * Two of the three are answerable from the firm's own details and are filled in
 * below. The third is not — see `governingLaw`.
 *
 * Each document is a function of the region, because the location and contact
 * details in it are: a reader on the UK site is told about the London office,
 * not about somewhere they cannot reach.
 */

/** Where the regional site is operated from — that region's own office. */
function operatingLocation(code: TenantCode) {
  const office = officeForTenant(code);
  return `${office.city}, ${office.countryName}`;
}

/**
 * The law these terms are governed by, and the courts that hear a dispute.
 *
 * DELIBERATELY UNSET. Naming a jurisdiction in a limitation-of-liability clause
 * is a legal decision, not a copywriting one, and the firm operates across five
 * of them — a wrong answer here is worse than a missing one, because a reader
 * would have no reason to doubt it.
 *
 * Set it to the agreed wording, e.g. "the laws of the United Arab Emirates, and
 * the courts of Dubai", and the governing-law clause appears on both pages that
 * reference it. Until then those clauses are omitted rather than published with
 * a blank in them.
 */
const governingLaw: string | undefined = undefined;

/** The date shown as when these documents were last revised. */
export const legalUpdated = "2026-08-04";

export type LegalClause = { heading: string; body: string[] };

export type LegalDocument = {
  slug: "privacy-policy" | "terms-of-use" | "legal-information";
  title: string;
  /** Sentence under the page title, and the meta description. */
  summary: string;
  preamble: string;
  clauses: LegalClause[];
  /** Closing line, e.g. how to get in touch about the document. */
  closing?: string;
};

function contactSentence(code: TenantCode) {
  const contact = contactFor(code);
  return `You can reach us at ${contact.email} or ${contact.phone}.`;
}

/** Only included once a jurisdiction has been agreed — see `governingLaw`. */
function governingLawClause(intro: string): LegalClause[] {
  if (!governingLaw) return [];

  return [
    {
      heading: "Governing Law and Jurisdiction",
      body: [`${intro} ${governingLaw}.`],
    },
  ];
}

export function privacyPolicy(code: TenantCode): LegalDocument {
  return {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary:
      "What personal information athGADLANG collects through this website, how it is used, and the choices available to you.",
    preamble:
      "Protecting your privacy is important to us, and we want you to feel comfortable using our website. This Privacy Policy outlines the types of personal information we may collect from you and how we may use that information.",
    clauses: [
      {
        heading: "Information We Collect",
        body: [
          "We may collect various types of personal information from you, including your name, email address, phone number, and other information you provide to us through our website or other means. We may also collect certain non-personal information, such as your IP address, browser type, and other technical information.",
        ],
      },
      {
        heading: "Use of Information",
        body: [
          "We may use the information we collect from you to provide you with products or services you request, to communicate with you about our products or services, to improve our website and services, and to comply with legal obligations.",
        ],
      },
      {
        heading: "Sharing of Information",
        body: [
          "We may share your personal information with third-party service providers who perform services on our behalf, such as processing payments, sending emails, or analyzing data. We may also share your information if required by law or to protect our legal rights.",
        ],
      },
      {
        heading: "Cookies and Tracking Technologies",
        body: [
          "We may use cookies and other tracking technologies to collect information about your use of our website, such as pages visited and links clicked. You may be able to disable cookies in your browser settings, but doing so may limit your use of our website.",
        ],
      },
      {
        heading: "Links to Other Websites",
        body: [
          "Our website may contain links to other websites. We are not responsible for the privacy practices or content of those websites. We encourage you to review the privacy policies of those websites before providing any personal information.",
        ],
      },
      {
        heading: "Security",
        body: [
          "We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no security measure is completely secure, and we cannot guarantee the security of your information.",
        ],
      },
      {
        heading: "Children’s Privacy",
        body: [
          "Our website is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under the age of 13.",
        ],
      },
      {
        heading: "Changes to This Privacy Policy",
        body: [
          "We may update this Privacy Policy from time to time by posting a new version on our website. Your continued use of our website after any such changes constitutes your acceptance of the new Privacy Policy.",
        ],
      },
    ],
    closing: `If you have any questions about this Privacy Policy, please contact us. ${contactSentence(code)}`,
  };
}

export function termsOfUse(code: TenantCode): LegalDocument {
  return {
    slug: "terms-of-use",
    title: "Terms Of Use",
    summary:
      "The terms on which athGADLANG makes this website available, including permitted use, intellectual property and limitation of liability.",
    preamble:
      "Please read these Terms of Use carefully before using this website. By using this website, you agree to these Terms of Use.",
    clauses: [
      {
        heading: "Use of Website",
        body: [
          "You may use this website for lawful purposes and in accordance with these Terms of Use.",
        ],
      },
      {
        heading: "Intellectual Property",
        body: [
          "The content, trademarks, logos, and other intellectual property appearing on this website are owned by us or our licensors. You may not use or display any of this intellectual property without our prior written consent.",
        ],
      },
      {
        heading: "User Content",
        body: [
          "You may be able to submit content to this website, including comments, reviews, and other user-generated content. By submitting such content, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sub-licensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.",
        ],
      },
      {
        heading: "Prohibited Conduct",
        body: [
          "You agree not to use this website in any way that could damage, disable, overburden, or impair this website or interfere with any other party’s use and enjoyment of this website. You may not engage in any activity that would constitute a criminal offense, give rise to civil liability, or otherwise violate any law.",
        ],
      },
      {
        heading: "Disclaimer of Warranties",
        body: [
          "This website and its content are provided “as is” and without warranties of any kind, whether express or implied. We do not warrant that this website will be uninterrupted or error-free or that defects will be corrected. We also do not warrant that this website or the servers that make it available are free of viruses or other harmful components.",
        ],
      },
      {
        heading: "Limitation of Liability",
        body: [
          "In no event will we be liable to you or any third party for any damages arising out of or in connection with your use of this website, including without limitation any indirect, consequential, incidental, special, or punitive damages.",
        ],
      },
      {
        heading: "Indemnification",
        body: [
          "You agree to indemnify and hold us harmless from and against any and all claims, damages, liabilities, costs, and expenses, including reasonable attorneys’ fees, arising from or related to your use of this website.",
        ],
      },
      {
        heading: "Modifications to These Terms",
        body: [
          "We reserve the right to modify these Terms of Use at any time without notice to you. Your continued use of this website after any such changes constitutes your acceptance of the new Terms of Use.",
        ],
      },
      ...governingLawClause("These Terms of Use will be governed by and construed in accordance with"),
    ],
    closing: `If you have any questions about these Terms of Use, please contact us. ${contactSentence(code)}`,
  };
}

export function legalInformation(code: TenantCode): LegalDocument {
  return {
    slug: "legal-information",
    title: "Legal Information",
    summary:
      "Important legal information about your use of the athGADLANG website, including warranties, liability and intellectual property.",
    preamble:
      "This section provides important legal information about your use of our website.",
    clauses: [
      {
        heading: "Disclaimer of Warranties",
        body: [
          "This website and its content are provided “as is” and without warranties of any kind, whether express or implied. We do not warrant that this website will be uninterrupted or error-free or that defects will be corrected. We also do not warrant that this website or the servers that make it available are free of viruses or other harmful components.",
        ],
      },
      {
        heading: "Limitation of Liability",
        body: [
          "In no event will we be liable to you or any third party for any damages arising out of or in connection with your use of this website, including without limitation any indirect, consequential, incidental, special, or punitive damages.",
        ],
      },
      {
        heading: "Intellectual Property",
        body: [
          "The content, trademarks, logos, and other intellectual property appearing on this website are owned by us or our licensors. You may not use or display any of this intellectual property without our prior written consent.",
        ],
      },
      {
        heading: "User Content",
        body: [
          "You may be able to submit content to this website, including comments, reviews, and other user-generated content. By submitting such content, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sub-licensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.",
        ],
      },
      {
        heading: "Prohibited Conduct",
        body: [
          "You agree not to use this website in any way that could damage, disable, overburden, or impair this website or interfere with any other party’s use and enjoyment of this website. You may not engage in any activity that would constitute a criminal offense, give rise to civil liability, or otherwise violate any law.",
        ],
      },
      {
        heading: "Where This Website Is Operated From",
        body: [`This website is operated from ${operatingLocation(code)}.`],
      },
      ...governingLawClause(
        "These terms and your use of this website are governed by and construed in accordance with",
      ),
      {
        heading: "Changes to These Terms",
        body: [
          "We reserve the right to modify these terms at any time without notice to you. Your continued use of this website after any such changes constitutes your acceptance of the new terms.",
        ],
      },
      {
        heading: "Contact Information",
        body: [
          "If you have any questions about these legal terms or this website, " +
            `please contact us. ${contactSentence(code)} Our ` +
            `${officeForTenant(code).city} office is at ` +
            `${officeForTenant(code).address}.`,
        ],
      },
    ],
  };
}

/**
 * The paths, which are the same in every region — for the sitemap. The bodies
 * differ by region, but the URLs do not.
 */
export const legalSlugs: LegalDocument["slug"][] = [
  "privacy-policy",
  "terms-of-use",
  "legal-information",
];
