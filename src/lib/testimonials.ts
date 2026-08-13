export type Testimonial = {
  id: string;
  name: string;
  role: string;
  /** Omitted where the client is not attributed to a company. */
  company?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  /**
   * Headshot. Drop the file in `public/images/testimonials/` and set it here;
   * until then the card shows the person's initials, which is a deliberate
   * placeholder rather than a broken image. Square crops work best — the
   * avatar is a circle.
   */
  image?: { src: string; alt: string };
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

  /* Assurance. */
  {
    id: "mohammed-al-suwaidi",
    name: "Mohammed Al Suwaidi",
    role: "Audit Committee Chair",
    rating: 5,
    quote:
      "athGADLANG's risk-based internal audits gave us clarity on controls we didn't even know were weak. Their recommendations strengthened our entire governance framework.",
  },
  {
    id: "laura-chen",
    name: "Laura Chen",
    role: "Group CFO",
    rating: 5,
    quote:
      "Their forensic and due diligence work during our acquisition was impeccable: thorough, discreet, and invaluable for risk mitigation.",
  },
  {
    id: "ravi-patel",
    name: "Ravi Patel",
    role: "Compliance Director",
    rating: 5,
    quote:
      "We engaged them for IT and ESG assurance, and the insights from data analytics transformed our reporting and compliance approach.",
  },

  /* Consulting. */
  {
    id: "abdullah-al-shamsi",
    name: "Abdullah Al Shamsi",
    role: "CEO",
    rating: 5,
    quote:
      "Working with the athGADLANG consulting team was a turning point for us. They worked closely with our leadership team to refine our business model and improve operational efficiency. The impact was visible within months.",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    role: "Head of Finance",
    rating: 5,
    quote:
      "The athGADLANG team supported us with detailed financial modelling and feasibility analysis for a new expansion project. Their ability to break down complex numbers into clear insights gave us the confidence to move forward.",
  },
  {
    id: "daniel-thompson",
    name: "Daniel Thompson",
    role: "Director",
    rating: 5,
    quote:
      "We engaged athGADLANG for transaction advisory, and their team handled the entire process with precision and professionalism. From due diligence to execution, they were proactive, detail-oriented, and easy to work with.",
  },
  {
    id: "omar-al-mansoori",
    name: "Omar Al Mansoori",
    role: "Chief Operating Officer",
    rating: 5,
    quote:
      "athGADLANG's risk advisory team helped us strengthen our internal controls and identify gaps we hadn't considered. Their recommendations were practical, well-structured, and added real value to our operations.",
  },

  /* Tax. */
  {
    id: "nasser-al-falasi",
    name: "Nasser Al Falasi",
    role: "Finance Director",
    rating: 5,
    quote:
      "athGADLANG guided us through UAE Corporate Tax registration and computations seamlessly. Their free zone expertise saved us significant liabilities.",
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    role: "Tax Manager",
    rating: 5,
    quote:
      "Their transfer pricing documentation passed FTA review without issues, giving us peace of mind for our regional operations.",
  },
  {
    id: "david-lee",
    name: "David Lee",
    role: "CFO",
    rating: 5,
    quote:
      "VAT compliance was a headache until athGADLANG streamlined our returns and recoveries. Our cash flow improved immediately.",
  },

  /* Fixed assets and inventory. */
  {
    id: "fatima-al-mehairi",
    name: "Fatima Al Mehairi",
    role: "Finance Director",
    rating: 5,
    quote:
      "athGADLANG transformed our fixed asset register from chaos to compliance. Their team handled tagging, reconciliation, and IFRS 16 implementation flawlessly, saving us months of internal effort.",
  },
  {
    id: "ahmed-khalil",
    name: "Ahmed Khalil",
    role: "Operations Manager",
    rating: 5,
    quote:
      "Their inventory management expertise uncovered significant variances and optimized our warehouse processes. The results were immediate: better controls and reduced shrinkage.",
  },
  {
    id: "sarah-thompson",
    name: "Sarah Thompson",
    role: "CFO",
    rating: 5,
    quote:
      "We relied on athGADLANG for ERP integration and physical verifications during a major audit. Their precision and speed ensured a smooth process with zero disruptions.",
  },

  /* Resourcing. */
  {
    id: "omar-al-hammadi",
    name: "Omar Al Hammadi",
    role: "Operations Director",
    rating: 5,
    quote:
      "athGADLANG team helped us design and implement a BPO model that significantly reduced our internal workload. Their team understood our requirements quickly and ensured a smooth transition.",
  },
  {
    id: "ayesha-siddiqui",
    name: "Ayesha Siddiqui",
    role: "HR Manager",
    rating: 5,
    quote:
      "The athGADLANG team made talent acquisition much easier for us. They consistently provided candidates who were not only qualified but also a great cultural fit.",
  },
  {
    id: "james-walker",
    name: "James Walker",
    role: "Project Director",
    rating: 5,
    quote:
      "We engaged athGADLANG for secondment support during a critical project, and the experience was excellent. The professionals they provided were skilled, reliable, and integrated seamlessly with our team.",
  },
  {
    id: "khalid-al-mansoori",
    name: "Khalid Al Mansoori",
    role: "CEO",
    rating: 5,
    quote:
      "Their C-level support services added real value to our leadership team. We received practical guidance that helped improve decision-making and overall operational efficiency.",
  },
];

/**
 * The homepage set. The service pages carry the quotes for their own practice,
 * so the homepage shows the four transcribed from the live site rather than
 * every quote on the site — named by id, so adding a practice's quotes cannot
 * lengthen the homepage.
 */
export const featuredTestimonials = getTestimonials([
  "kris-fade",
  "elie-bassil",
  "chanel-venter",
  "asad-aftab",
]);

/** Looked up by id, so pages can name the testimonials they want. */
export function getTestimonials(ids: string[]) {
  return ids
    .map((id) => testimonials.find((item) => item.id === id))
    .filter((item): item is Testimonial => Boolean(item));
}

/** "Kris Fade" → "KF". Used for the attribution avatar. */
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
