export type Testimonial = {
  id: string;
  name: string;
  role: string;
  /** Omitted where the client is not attributed to a company. */
  company?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
};

/** Client testimonials, transcribed from the current site. */
export const testimonials: Testimonial[] = [
  {
    id: "kris-fade",
    name: "Kris Fade",
    role: "Founder",
    company: "FADE FIT",
    rating: 5,
    quote:
      "We engaged athGADLANG to provide us with accounting services, and we were thoroughly impressed with their services. Their team was highly experienced and provided us with accurate and timely financial information that helped us manage our finances effectively. They were responsive to our needs and provided us with tailored solutions that fit our business requirements.",
  },
  {
    id: "elie-bassil",
    name: "Elie Bassil",
    role: "Founder & COO",
    company: "Habib Beirut Restaurant",
    rating: 5,
    quote:
      "Working with athGADLANG on various Due Diligence and Investment advisory projects was a great experience. They brought a fresh perspective and helped us understand the true value of our company. The team was dedicated to finding a solution that fit our needs and their expertise was invaluable. We're thankful for their contributions and feel confident in the decisions we're making for our business.",
  },
  {
    id: "chanel-venter",
    name: "Chanel Venter",
    role: "Founder & Managing Director",
    rating: 5,
    quote:
      "As a small business owner, athGADLANG have been a great support system for me in ensuring I have the relevant systems, processes and financial information required to run and grow my business. They've shown flexibility, adapting to the needs of my business, and are responsive to any queries or issues I might have. They're consistent in delivering reports and deliverables.",
  },
  {
    id: "asad-aftab",
    name: "Asad Aftab",
    role: "Director Investments",
    company: "Venture Capital Bank",
    rating: 5,
    quote:
      "We have utilized athGADLANG for business valuation, accounting and internal review services and were very happy with the quality of service we received. They offer personalized service with dedicated staff that provide timely information for management decisions. They were also incredibly responsive and available whenever we needed them, which ensured quick delivery of engagement.",
  },
];

/** "Kris Fade" → "KF". Used for the attribution avatar. */
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
