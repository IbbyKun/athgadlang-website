import { insightImages } from "@/lib/images";
import type { RichDoc } from "@/lib/rich-text";
import type { TenantCode } from "@/lib/tenants";

/** One element of an article body, rendered in order by <InsightBody>. */
export type InsightBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export type Insight = {
  /**
   * URL segment. A plain string rather than a key of `insightImages`: articles
   * written in the admin panel bring their own uploaded artwork, so the slug
   * is no longer constrained to the built-in image map.
   */
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date — formatted at render time via `formatDate`. */
  date: string;
  /** Byline. Falls back to `insightByline` when the author is not named. */
  author?: string;
  image: { src: string; alt: string };
  /**
   * Regions the article appears on. Absent means every region — which is what
   * the built-in articles below are, since they predate regional targeting.
   */
  regions?: TenantCode[];
  /**
   * Structural body used by the built-in articles. The first paragraph is
   * rendered as the lead.
   */
  body?: InsightBlock[];
  /**
   * Rich text body, as written in the admin editor. Takes precedence over
   * `body` when both are present.
   */
  richBody?: RichDoc;
  /** True for articles loaded from the database, for the admin's benefit. */
  managed?: boolean;
};

/** Shown when an article carries no named author. */
export const insightByline = "athGADLANG Insights Team";

/**
 * Placeholder editorial content. Replace with a CMS query or MDX collection
 * when the Insights section is wired to real articles — the components only
 * depend on the `Insight` shape.
 *
 * The bodies below are structural placeholders: deliberately written without
 * specific thresholds, rates, deadlines or article references, because none of
 * it has been through technical review. Every figure a reader could act on
 * must come from the practice before this goes live.
 */
export const insights: Insight[] = [
  {
    slug: "ubo-regulations-uae",
    title:
      "Ultimate Beneficial Owner (UBO) Regulations in the UAE: Everything Businesses Need to Know",
    excerpt:
      "The UAE has significantly strengthened its corporate transparency framework by implementing robust Ultimate Beneficial Owner regulations. Here is what every entity must file, and when.",
    category: "Corporate Services",
    date: "2026-07-14",
    image: insightImages["ubo-regulations-uae"],
    body: [
      {
        type: "paragraph",
        text: "Corporate transparency has moved from a policy ambition to a filing obligation. Entities licensed in the UAE are expected to identify the real people behind their ownership structure, record them accurately, and keep those records current with the relevant registrar. The requirement is administrative rather than complex — but it is one of the obligations most often discovered late, usually during a licence renewal or a bank review.",
      },
      { type: "heading", text: "Who counts as a beneficial owner" },
      {
        type: "paragraph",
        text: "A beneficial owner is the natural person who ultimately owns or controls the entity, whether that control is exercised through shareholding, voting rights, or the ability to appoint and remove management. Where no individual meets the ownership test, the analysis moves to control, and ultimately to the senior management of the entity. Layered structures, nominee arrangements and corporate shareholders all have to be traced through to a person.",
      },
      { type: "heading", text: "The registers you are expected to keep" },
      {
        type: "paragraph",
        text: "Most entities need to maintain three internal registers alongside the filing itself:",
      },
      {
        type: "list",
        items: [
          "A register of beneficial owners, with identification and the basis of their interest",
          "A register of shareholders or partners, including the nature and size of each holding",
          "A register of nominee directors or managers, where any are appointed",
        ],
      },
      {
        type: "paragraph",
        text: "Registers are living documents. A change in shareholding, a transfer of control or a new nominee appointment triggers an update within the window set by the registrar, not at the next renewal.",
      },
      { type: "heading", text: "Where entities get caught out" },
      {
        type: "paragraph",
        text: "Two failures account for most enforcement exposure. The first is treating the filing as a one-off completed at incorporation. The second is filing the immediate corporate shareholder instead of tracing the chain to a natural person. Both are avoidable with a scheduled review of the structure — and both are visible to a regulator the moment the register is requested.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Map your ownership chain to the individuals at the top of it, confirm the registers you hold match that map, and put a calendar reminder against every date on which the structure could change. If your structure spans several jurisdictions, have the analysis reviewed — the definitions do not always align across registries.",
      },
    ],
  },
  {
    slug: "commercial-vs-professional-licence",
    title:
      "UAE Commercial Licence vs Professional Licence: What Is the Difference?",
    excerpt:
      "Choosing the right business licence is one of the first and most important decisions when establishing a company in the UAE. We break down ownership, activity scope and cost.",
    category: "Company Formation",
    date: "2026-06-30",
    image: insightImages["commercial-vs-professional-licence"],
    body: [
      {
        type: "paragraph",
        text: "The licence you hold defines what your business is permitted to do, how it can be owned, and which authority supervises it. Getting the choice right at incorporation is far cheaper than amending it later, when contracts, bank mandates and visa allocations are already built on top of it.",
      },
      { type: "heading", text: "The commercial licence" },
      {
        type: "paragraph",
        text: "A commercial licence covers the buying and selling of goods: trading, distribution, import and export, retail and general commerce. It is the right instrument where revenue comes from moving product rather than supplying expertise, and it is usually the licence a customs registration and a warehouse lease are attached to.",
      },
      { type: "heading", text: "The professional licence" },
      {
        type: "paragraph",
        text: "A professional licence covers services delivered through skill, qualification or intellectual effort — consultancy, accounting, engineering, design, IT services and similar activities. Approvals often depend on the qualifications of the individuals delivering the service, so the practitioner's credentials become part of the application file.",
      },
      { type: "heading", text: "How to choose" },
      {
        type: "paragraph",
        text: "Work backwards from the revenue you intend to invoice, not from the label you prefer. Three questions settle most cases:",
      },
      {
        type: "list",
        items: [
          "Are you invoicing for goods, for expertise, or for both?",
          "Which activities must appear on the licence for your contracts and bank account to function?",
          "Does the activity carry a regulator of its own beyond the licensing authority?",
        ],
      },
      {
        type: "paragraph",
        text: "Mixed models exist, and a business that both supplies and installs may need more than one activity listed. What matters is that every invoice you raise is covered by an activity on the licence.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Draft your intended activity list before you approach an authority, then test it against the market you are entering — free zone or mainland — because the same activity can carry different conditions in each. We review activity lists as part of formation, and the review takes hours rather than weeks.",
      },
    ],
  },
  {
    slug: "register-trademark-uae",
    title:
      "How to Register a Trademark in the UAE: A Complete Guide to Protecting Your Brand",
    excerpt:
      "Building a strong brand takes time, investment and consistency. Protecting that brand is just as important — this guide walks through the full registration process.",
    category: "Advisory",
    date: "2026-06-18",
    image: insightImages["register-trademark-uae"],
    body: [
      {
        type: "paragraph",
        text: "A trademark converts a name you use into a right you own. Until it is registered, your position against a copycat rests on reputation and evidence; afterwards it rests on a certificate. For businesses investing in a brand across the region, registration is one of the cheapest pieces of protection available.",
      },
      { type: "heading", text: "Search before you file" },
      {
        type: "paragraph",
        text: "Start with a clearance search of the register for identical and confusingly similar marks in the classes you intend to use. A search costs a fraction of a refused application, and it occasionally saves a rebrand — it is far better to discover a conflict before the signage is printed.",
      },
      { type: "heading", text: "Choose the classes deliberately" },
      {
        type: "paragraph",
        text: "Protection is granted per class of goods and services, so the classes you select define the boundary of your right. File for what you sell today and for the adjacent activities you can credibly see yourself entering. Over-filing wastes fees; under-filing leaves the door open for someone else to register your own name in the category you expand into next year.",
      },
      { type: "heading", text: "The route from filing to certificate" },
      {
        type: "paragraph",
        text: "The path is broadly consistent, even though timelines shift with examiner workload:",
      },
      {
        type: "list",
        items: [
          "File the application with the mark, the applicant details and the selected classes",
          "Respond to any examination objections on distinctiveness or similarity",
          "Publication, followed by a window in which third parties may oppose",
          "Registration and issue of the certificate, then renewal on the published cycle",
        ],
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Inventory the names, logos and taglines your business actually trades under, note which are registered and where, and close the gaps in order of commercial value. If you operate across the GCC, plan the filings as a portfolio rather than country by country.",
      },
    ],
  },
  {
    slug: "jebel-ali-free-zone",
    title:
      "Why Jebel Ali Free Zone Is the Preferred Choice for Businesses in the UAE",
    excerpt:
      "Jebel Ali Free Zone is one of the UAE's most established business destinations. It combines modern infrastructure, port access and a mature regulatory environment.",
    category: "Free Zones",
    date: "2026-06-02",
    image: insightImages["jebel-ali-free-zone"],
    body: [
      {
        type: "paragraph",
        text: "Free zones are not interchangeable. They differ in the activities they licence, the facilities they offer, the customs treatment they sit behind and the depth of the ecosystem around them. Jebel Ali's appeal has always been physical: a licence attached to one of the busiest ports in the region.",
      },
      { type: "heading", text: "Logistics is the differentiator" },
      {
        type: "paragraph",
        text: "For any business whose economics are set by the movement of goods, proximity to port and airport infrastructure shows up directly in landed cost and lead time. Warehousing, light industrial units and open land are available in the same jurisdiction that issues the licence, which keeps the operating footprint and the legal entity aligned.",
      },
      { type: "heading", text: "A mature regulatory environment" },
      {
        type: "paragraph",
        text: "Longevity has practical value. Established zones have settled procedures, familiar documentation and banking relationships that recognise the licence on sight — all of which shortens the distance between incorporation and the first invoice.",
      },
      { type: "heading", text: "Where a free zone is not the answer" },
      {
        type: "paragraph",
        text: "A free zone entity's ability to trade directly inside the mainland market is limited, and structures that ignore this end up rebuilt. If your customers are domestic, model the distributor or branch arrangement before choosing the jurisdiction. Corporate tax treatment also depends on the nature of the income rather than the address, so the free zone label alone settles nothing.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "List your activities, your customers and your physical requirements, then shortlist jurisdictions against that list rather than against headline setup cost. We compare zones on total cost of operation, including the facility and the visa quota you will actually need.",
      },
    ],
  },
  {
    slug: "corporate-tax-small-business-relief",
    title: "UAE Corporate Tax: Small Business Relief Explained",
    excerpt:
      "Businesses under the revenue threshold can elect to be treated as having no taxable income. We cover eligibility, the election mechanics and the record-keeping that still applies.",
    category: "Tax",
    date: "2026-05-21",
    image: insightImages["corporate-tax-small-business-relief"],
    body: [
      {
        type: "paragraph",
        text: "Small Business Relief lets a qualifying taxable person elect to be treated as having no taxable income for a period, which removes the computation but not the compliance. It is a simplification measure, and the most common misreading is to treat it as an exemption from the regime itself.",
      },
      { type: "heading", text: "Eligibility turns on revenue, not profit" },
      {
        type: "paragraph",
        text: "The test is applied to revenue for the relevant period against the published threshold, and it must hold for the period in question. A business that crosses the threshold in a later period leaves the relief for that period — so the assessment is annual, not permanent.",
      },
      { type: "heading", text: "The election is yours to make" },
      {
        type: "paragraph",
        text: "Relief is elected in the return; it is not applied automatically. Electing has consequences worth modelling before you tick the box, particularly where the business has losses it would otherwise carry forward, or interest it would otherwise be able to relieve.",
      },
      { type: "heading", text: "What still applies" },
      {
        type: "paragraph",
        text: "Electing does not switch off the underlying obligations:",
      },
      {
        type: "list",
        items: [
          "Registration for corporate tax and filing of the return for each period",
          "Maintaining accounting records that support the revenue figure relied on",
          "Transfer pricing documentation where the related-party rules otherwise apply",
        ],
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Confirm your revenue position against the current published threshold, decide the election on the basis of a modelled outcome rather than convenience, and keep the records that evidence the position. Have the loss and interest consequences reviewed before electing in a year with either.",
      },
    ],
  },
  {
    slug: "transfer-pricing-documentation-gcc",
    title: "Transfer Pricing Documentation: What GCC Groups Must Prepare",
    excerpt:
      "Master file, local file and disclosure form requirements are now firmly in force. Here is a practical timeline for getting intercompany documentation audit-ready.",
    category: "Tax",
    date: "2026-05-07",
    image: insightImages["transfer-pricing-documentation-gcc"],
    body: [
      {
        type: "paragraph",
        text: "Transfer pricing documentation is where intercompany arrangements are either explained or exposed. Groups that prepare it alongside the year-end tend to describe what actually happened; groups that prepare it under audit tend to reconstruct it, and the difference is visible on the page.",
      },
      { type: "heading", text: "The three layers" },
      {
        type: "paragraph",
        text: "Most regimes in the region follow the familiar structure: a master file describing the group, a local file describing the entity's controlled transactions, and a disclosure form filed with the return. Thresholds for each differ by jurisdiction, so a group operating across the GCC will not have identical obligations in every country it sits in.",
      },
      { type: "heading", text: "Start from the transactions, not the template" },
      {
        type: "paragraph",
        text: "Build an inventory of every intercompany flow — goods, services, management charges, financing, royalties, guarantees and cost allocations — with the counterparties, amounts and the agreement behind each. Most documentation problems are really inventory problems: a flow nobody listed, or a charge with no agreement behind it.",
      },
      { type: "heading", text: "A workable timeline" },
      {
        type: "paragraph",
        text: "Working backwards from the filing date keeps the exercise calm:",
      },
      {
        type: "list",
        items: [
          "Refresh the transaction inventory and intercompany agreements at year-end",
          "Test the pricing outcomes against benchmarks while the numbers are still open",
          "Draft the local file once the statutory accounts are final",
          "Reconcile the disclosure form to the return before submission",
        ],
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Confirm which of your entities cross the documentation thresholds in their own jurisdiction, then check that each material intercompany flow has both an agreement and a pricing rationale. Where a charge exists in the ledger but not on paper, fix the paperwork before an auditor finds the gap.",
      },
    ],
  },
  {
    slug: "ksa-e-invoicing-phase-two",
    title: "E-Invoicing in Saudi Arabia: A Phase 2 Readiness Checklist",
    excerpt:
      "ZATCA integration brings clearance, cryptographic stamps and API onboarding. Use this checklist to confirm your ERP and invoicing flows will pass validation.",
    category: "Compliance",
    date: "2026-04-23",
    image: insightImages["ksa-e-invoicing-phase-two"],
    body: [
      {
        type: "paragraph",
        text: "Phase 2 of the Saudi e-invoicing programme changes invoicing from something your system does to something your system does with the authority in the loop. Integration, clearance and cryptographic stamping mean an invoice that fails validation is not merely late — it is not a valid invoice.",
      },
      { type: "heading", text: "What integration actually requires" },
      {
        type: "paragraph",
        text: "The solution has to generate invoices in the required format, onboard through the authority's API with the correct credentials, and handle clearance or reporting according to the document type. Standard tax invoices and simplified invoices follow different paths, and both need to be right.",
      },
      { type: "heading", text: "A readiness checklist" },
      {
        type: "paragraph",
        text: "Run through the following before your wave date rather than after it:",
      },
      {
        type: "list",
        items: [
          "Master data complete: tax registration numbers, addresses and item data that validate cleanly",
          "Document types mapped, including credit and debit notes",
          "Onboarding credentials issued and tested in the sandbox environment",
          "Failure handling defined — what your team does when clearance is rejected",
          "Archiving that preserves the cleared document and its stamp, not just a PDF",
        ],
      },
      { type: "heading", text: "Test with your worst invoices" },
      {
        type: "paragraph",
        text: "Sandbox testing with clean sample data proves very little. Test the awkward cases: mixed rates, discounts, exports, retentions, advance payments and credit notes against prior periods. Those are the invoices that fail in production.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Confirm your wave date, then work the checklist above against a copy of real transaction data. If your invoicing sits across more than one system, resolve which one is the source of truth before integration rather than during it.",
      },
    ],
  },
  {
    slug: "ifrs-18-financial-statements",
    title: "IFRS 18 Is Coming: How Your Financial Statements Will Change",
    excerpt:
      "New categories in the income statement, defined subtotals and disclosure of management-defined performance measures. What to start changing in your reporting now.",
    category: "Accounting",
    date: "2026-04-09",
    image: insightImages["ifrs-18-financial-statements"],
    body: [
      {
        type: "paragraph",
        text: "IFRS 18 reshapes the face of the income statement. It does not change how much profit you make, but it changes how that profit is presented, which subtotals are mandatory, and what you must say about the performance measures you use outside the statements.",
      },
      { type: "heading", text: "Structure replaces convention" },
      {
        type: "paragraph",
        text: "Income and expenses are classified into defined categories, with specified subtotals presented on the face of the statement. Presentation choices that were previously a matter of house style become a matter of classification, and comparatives have to be restated onto the new structure.",
      },
      { type: "heading", text: "Management-defined performance measures" },
      {
        type: "paragraph",
        text: "The measures management uses publicly to explain performance — the adjusted figures in the investor deck — come into scope for disclosure, with a reconciliation to the nearest specified subtotal. If your commentary quotes a measure, be ready to explain how it is calculated and why it is useful.",
      },
      { type: "heading", text: "Aggregation and disaggregation" },
      {
        type: "paragraph",
        text: "The standard is explicit that useful groupings matter: items should be aggregated by shared characteristics and disaggregated where doing so tells the reader something. In practice this pushes the work down into the chart of accounts, which is where the effort actually lands.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Draft your income statement under the new structure using last year's numbers. That single exercise surfaces the mapping gaps in the chart of accounts, the comparatives you will have to restate, and the measures you will need to explain — while there is still time to change the ledger rather than the disclosure.",
      },
    ],
  },
  {
    slug: "economic-substance-regulations-filing",
    title: "Economic Substance Regulations: Who Still Needs to File?",
    excerpt:
      "Relevant activities, exempted licensees and the notification-then-report sequence. A short test to establish whether this year's filing applies to your entity.",
    category: "Compliance",
    date: "2026-03-26",
    image: insightImages["economic-substance-regulations-filing"],
    body: [
      {
        type: "paragraph",
        text: "Economic substance obligations are easy to assume away. An entity that carried on a relevant activity in the period has a filing to make even if that activity produced no income, and the assumption that a quiet year means no filing is a common and avoidable error.",
      },
      { type: "heading", text: "Start with the activity, not the licence" },
      {
        type: "paragraph",
        text: "The test looks at what the entity actually did during the period, not at the wording on its trade licence. Holding company activity, intra-group financing, distribution and service-centre arrangements and headquarters functions all deserve a careful read — several catch entities whose licence suggests something else entirely.",
      },
      { type: "heading", text: "Notification, then report" },
      {
        type: "paragraph",
        text: "The sequence matters. A notification identifies whether a relevant activity was carried on and whether income was earned from it; a report, where required, sets out how the substance requirements were met — directed and managed in-jurisdiction, adequate people, premises and expenditure, and core income-generating activities performed locally.",
      },
      { type: "heading", text: "Evidence is contemporaneous or it is weak" },
      {
        type: "paragraph",
        text: "Board minutes that show decisions taken in-jurisdiction, records of who performed the work, and evidence of premises and expenditure are persuasive when they were created at the time. Assembled after a query, they persuade far less.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Test each entity in the group against the relevant activity list for the period just closed, note the filing each one triggers, and diarise the deadlines. Where substance is thin, the fix — meetings, resourcing, decision records — has to happen inside the period, not at filing.",
      },
    ],
  },
  {
    slug: "vat-on-uae-real-estate",
    title: "VAT on UAE Real Estate: Residential, Commercial and Off-Plan",
    excerpt:
      "The treatment turns on the type of property and the timing of supply. We set out where the zero rate applies, where exemption bites, and what that means for input tax recovery.",
    category: "Tax",
    date: "2026-03-12",
    image: insightImages["vat-on-uae-real-estate"],
    body: [
      {
        type: "paragraph",
        text: "Real estate is where VAT stops being a single rate and becomes a set of distinctions. The treatment of a supply depends on what the property is, whether the supply is a sale or a lease, and when it happens relative to first occupation — and each distinction carries a different consequence for recovery.",
      },
      { type: "heading", text: "Residential, commercial, bare land" },
      {
        type: "paragraph",
        text: "Commercial property broadly follows the standard rate. Residential property behaves differently: the first supply of a new residential building attracts favourable treatment, while subsequent supplies are generally exempt. Bare land follows its own rule again. Mixed-use developments therefore need apportionment rather than a single answer.",
      },
      { type: "heading", text: "Why exemption is the expensive outcome" },
      {
        type: "paragraph",
        text: "Exempt supplies do not carry output tax, but they also restrict recovery of the input tax attributable to them. For a developer or landlord this is the number that matters: the cost of an exempt letting is not the VAT charged, it is the VAT that can no longer be recovered on construction and maintenance.",
      },
      { type: "heading", text: "Off-plan and the timing of supply" },
      {
        type: "paragraph",
        text: "Staged payments, handover dates and the point of first supply have to be tracked deliberately, because the treatment of an off-plan unit can hinge on when the supply is treated as taking place. Get the timeline documented per unit; retrofitting it across a development is painful.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Classify your portfolio by property type and supply type, then check that your apportionment method reflects it and is applied consistently. Where a development is mixed-use, agree the method before the first recovery claim rather than defending it afterwards.",
      },
    ],
  },
  {
    slug: "aml-cft-expectations-dnfbps",
    title: "AML/CFT: What Regulators Expect from DNFBPs",
    excerpt:
      "Registration is only the start. Risk assessments, customer due diligence files and suspicious transaction reporting are all now examined during inspection.",
    category: "Compliance",
    date: "2026-02-26",
    image: insightImages["aml-cft-expectations-dnfbps"],
    body: [
      {
        type: "paragraph",
        text: "Designated non-financial businesses and professions — real estate brokers, dealers in precious metals and stones, corporate service providers, auditors and lawyers among them — carry obligations that look like a financial institution's in miniature. Registration on the relevant platform is the visible step; the framework behind it is what an inspection actually tests.",
      },
      { type: "heading", text: "The framework, in order" },
      {
        type: "paragraph",
        text: "An inspector generally works through the same sequence, so it is worth building it in that order:",
      },
      {
        type: "list",
        items: [
          "A business risk assessment that reflects your actual customers, products, channels and geographies",
          "Policies and controls proportionate to the risks that assessment identifies",
          "Customer due diligence files, with enhanced measures where risk is higher",
          "Ongoing monitoring and screening, including sanctions and politically exposed persons",
          "A named compliance officer, staff training records, and independent review",
        ],
      },
      { type: "heading", text: "Reporting is not optional or discretionary" },
      {
        type: "paragraph",
        text: "Suspicious transaction and activity reporting obligations sit alongside the file-keeping, and the decision not to report needs to be as documented as the decision to report. A file that records the reasoning is defensible; a silent file is not.",
      },
      { type: "heading", text: "Where inspections find gaps" },
      {
        type: "paragraph",
        text: "The recurring findings are mundane: a generic risk assessment copied from a template, due diligence collected at onboarding and never refreshed, screening performed once, and training that exists as a slide deck nobody attended.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Read your own risk assessment and ask whether it describes your business. If it does not, that is the place to start — every control below it inherits its weaknesses. Then sample your own customer files the way an inspector would.",
      },
    ],
  },
  {
    slug: "fair-value-measurement-reporting",
    title: "Fair Value Measurement: When Reporting Needs a Valuation Expert",
    excerpt:
      "Level 3 inputs, investment property and share-based payments all invite auditor challenge. Here is how to build a valuation file that stands up to review.",
    category: "Accounting",
    date: "2026-02-12",
    image: insightImages["fair-value-measurement-reporting"],
    body: [
      {
        type: "paragraph",
        text: "Some balances are measured rather than counted, and measurement is where audit friction concentrates. Investment property, unquoted investments, share-based payments and the intangibles recognised on an acquisition all rest on judgement — and judgement has to be evidenced.",
      },
      { type: "heading", text: "The hierarchy tells you how much work is coming" },
      {
        type: "paragraph",
        text: "Quoted prices in active markets need little defence. Observable inputs need a documented source. Unobservable inputs need a model, an assumption set, and a reason each assumption is reasonable — plus sensitivity disclosure showing what happens when it is not.",
      },
      { type: "heading", text: "What a defensible valuation file contains" },
      {
        type: "paragraph",
        text: "Auditors are looking for a file that a third party could follow:",
      },
      {
        type: "list",
        items: [
          "The measurement objective and the basis selected, with a reason for the choice",
          "Inputs and their sources, dated as at the measurement date",
          "The model itself, in a form that can be re-performed",
          "Sensitivity analysis on the assumptions that move the answer most",
          "Who prepared it, who reviewed it, and their competence to do so",
        ],
      },
      { type: "heading", text: "Independence and timing" },
      {
        type: "paragraph",
        text: "Where a balance is material and the inputs are unobservable, an independent specialist saves time overall — but only if engaged before the year-end close. A valuation commissioned during fieldwork tends to arrive after the audit has already formed a view.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "List the balances in your accounts that are measured rather than counted, mark those with unobservable inputs, and check each has a file that could be re-performed. Anything that fails that test is next year's audit adjustment.",
      },
    ],
  },
  {
    slug: "cash-flow-forecasting",
    title: "Cash Flow Forecasting: Turning the Ledger into a Decision Tool",
    excerpt:
      "A thirteen-week rolling forecast changes how a business negotiates with banks, suppliers and shareholders. We cover the structure, the inputs and the review discipline.",
    category: "Advisory",
    date: "2026-01-29",
    image: insightImages["cash-flow-forecasting"],
    body: [
      {
        type: "paragraph",
        text: "Profit is an opinion until it converts to cash. A short-horizon cash forecast, maintained weekly, is the single most useful management tool a growing business can adopt — and it costs nothing but discipline.",
      },
      { type: "heading", text: "Why thirteen weeks" },
      {
        type: "paragraph",
        text: "A quarter ahead is far enough to see a problem while you can still act on it, and near enough that the numbers are real rather than aspirational. Beyond that horizon you are modelling; inside it you are managing.",
      },
      { type: "heading", text: "Build it from receipts and payments" },
      {
        type: "paragraph",
        text: "Forecast the movements, not the accruals: collections by customer against their actual payment behaviour, payroll and its associated costs on their real dates, supplier payments by term, tax payments on their filing dates, and financing flows. Where a customer habitually pays late, forecast the habit rather than the term.",
      },
      { type: "heading", text: "The discipline is the value" },
      {
        type: "paragraph",
        text: "Each week, roll the forecast forward and compare last week's forecast to what actually happened. The variance is the point: it tells you which assumptions are wrong, and after a month or two the forecast starts to earn trust with lenders and shareholders precisely because it has a track record.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Start with one page and the next thirteen weeks, using your aged receivables and payables as the base. Add scenarios only once the base case is reliable — a stress case built on a forecast nobody trusts is arithmetic, not insight.",
      },
    ],
  },
  {
    slug: "golden-visa-eligibility-routes",
    title: "Golden Visa Eligibility: Which Route Fits Your Profile?",
    excerpt:
      "Investors, entrepreneurs, specialised talent and outstanding students each qualify under different criteria. A comparison of the routes and the evidence each one requires.",
    category: "Corporate Services",
    date: "2026-01-15",
    image: insightImages["golden-visa-eligibility-routes"],
    body: [
      {
        type: "paragraph",
        text: "Long-term residence in the UAE is granted through several distinct routes, each with its own criteria and its own evidence file. Most refusals we see are not eligibility failures — they are the right applicant applying through the wrong route, or with the wrong documents.",
      },
      { type: "heading", text: "The main routes" },
      {
        type: "paragraph",
        text: "Broadly, the categories cover:",
      },
      {
        type: "list",
        items: [
          "Investors, including real estate and capital investment routes",
          "Entrepreneurs and founders of businesses meeting the published criteria",
          "Specialised talent — professionals, scientists, creatives and similar fields",
          "Outstanding students and graduates",
        ],
      },
      {
        type: "paragraph",
        text: "Each has its own approving body, its own supporting documents, and its own attestation requirements. Thresholds and conditions are updated from time to time, so confirm the current criteria before assembling a file.",
      },
      { type: "heading", text: "The file matters more than the form" },
      {
        type: "paragraph",
        text: "Whichever route applies, the application succeeds on evidence: attested qualifications, valuation or ownership documents, salary or investment proof, and letters from recognised bodies where the route calls for them. Attestation of foreign documents is the step most likely to add weeks, so start it first.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Identify the one or two routes your profile fits best, then build the evidence list before touching the application. Where a family is included, plan the dependants' documents in the same pass rather than as a second exercise.",
      },
    ],
  },
  {
    slug: "internal-audit-family-business",
    title: "Internal Audit for Family Businesses: Where to Start",
    excerpt:
      "Governance does not have to arrive all at once. Begin with the three cycles where value leaks fastest — procurement, payroll and cash — then widen the scope.",
    category: "Advisory",
    date: "2025-12-18",
    image: insightImages["internal-audit-family-business"],
    body: [
      {
        type: "paragraph",
        text: "Family businesses run on trust, and trust is genuinely efficient — until scale outgrows the founder's line of sight. Internal audit is not a statement of suspicion; it is the mechanism that lets a business keep making fast decisions without losing visibility of them.",
      },
      { type: "heading", text: "Start where value leaks fastest" },
      {
        type: "paragraph",
        text: "Three cycles usually repay attention first: procurement, where supplier selection and pricing sit; payroll, where headcount, overtime and end-of-service accumulate; and cash and banking, where authority limits and reconciliation live. Reviewing these three tells you most of what you need to know about control health.",
      },
      { type: "heading", text: "Separate ownership from management deliberately" },
      {
        type: "paragraph",
        text: "The governance question in a family business is rarely technical. It is whether decisions are being taken as owner or as manager, and whether that is visible. Written authority limits, a reporting calendar and a forum in which management reports to ownership do more for control than any additional software.",
      },
      { type: "heading", text: "Make findings actionable" },
      {
        type: "paragraph",
        text: "A finding without an owner and a date is an observation. Each one should name the person accountable, the change required and the date it is due — then be re-tested. The second review is what turns audit into improvement.",
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Pick one cycle and review it end to end this quarter. A single well-executed review generates more momentum than an ambitious plan that never starts, and it gives the board something concrete to respond to.",
      },
    ],
  },
  {
    slug: "wps-payroll-compliance-uae",
    title: "WPS and Payroll Compliance in the UAE: A Practical Guide",
    excerpt:
      "Salary files, end-of-service accruals and gratuity calculations are where payroll most often drifts out of compliance. A monthly checklist to keep the register clean.",
    category: "Accounting",
    date: "2025-12-04",
    image: insightImages["wps-payroll-compliance-uae"],
    body: [
      {
        type: "paragraph",
        text: "Payroll is the most regular obligation a business has, and regularity is exactly why it drifts. The Wage Protection System requires salaries to be paid through approved channels within the expected window, and the consequences of a rejected or late file reach beyond the payroll team into visa and licence processes.",
      },
      { type: "heading", text: "The file has to match the contract" },
      {
        type: "paragraph",
        text: "Most rejections trace back to a mismatch between what is submitted and what is registered: the labour card details, the contracted salary structure, or the employee identifiers. Keeping the payroll master reconciled to the employment records is the whole discipline.",
      },
      { type: "heading", text: "Accrue end-of-service as you go" },
      {
        type: "paragraph",
        text: "Gratuity and leave accruals build quietly and are then recognised in a lump when someone resigns. Accruing monthly on a documented basis keeps the balance sheet honest and removes the surprise from a departure — particularly where headcount is growing.",
      },
      { type: "heading", text: "A monthly checklist" },
      {
        type: "paragraph",
        text: "The same short list, run every month, prevents almost all of it:",
      },
      {
        type: "list",
        items: [
          "Reconcile the payroll register to the employee master, including joiners and leavers",
          "Confirm salary structures match the registered contracts",
          "Submit within the expected window and retain the confirmation",
          "Update leave and end-of-service accruals",
          "Post payroll to the ledger and reconcile the control accounts",
        ],
      },
      { type: "heading", text: "What to do next" },
      {
        type: "paragraph",
        text: "Run the checklist against last month's payroll as a test. If any line takes more than a few minutes to evidence, that is the process to fix first — and the one an inspection would find.",
      },
    ],
  },
];

export function insightHref(insight: Insight) {
  return `/insights/${insight.slug}`;
}

/**
 * The helpers below take the list to work against, because the list a page
 * renders is no longer just the array above — it is the built-in articles
 * merged with the region's published rows from the database. Callers on the
 * public site pass the merged list from `src/lib/content.ts`; the default
 * keeps the built-in articles usable on their own.
 */

/** The article for a URL segment, or undefined so the route can 404. */
export function getInsight(slug: string, list: Insight[] = insights) {
  return list.find((insight) => insight.slug === slug);
}

/**
 * The articles either side of this one, in publication order: `previous` is
 * the one published before it, `next` the one after. Undefined at each end.
 *
 * Matched by slug rather than by reference: the caller's list is rebuilt on
 * every request, so the object passed in is not the one inside it.
 */
export function adjacentInsights(insight: Insight, list: Insight[] = insights) {
  const index = list.findIndex((item) => item.slug === insight.slug);
  if (index === -1) return { previous: undefined, next: undefined };

  return {
    previous: list[index + 1],
    next: list[index - 1],
  };
}

/** Same category first, then the most recent — never the article itself. */
export function relatedInsights(
  insight: Insight,
  limit = 4,
  list: Insight[] = insights,
) {
  const others = list.filter((item) => item.slug !== insight.slug);
  const sameCategory = others.filter(
    (item) => item.category === insight.category,
  );
  const rest = others.filter((item) => item.category !== insight.category);

  return [...sameCategory, ...rest].slice(0, limit);
}
