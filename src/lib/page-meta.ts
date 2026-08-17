import { type TenantCode } from "@/lib/tenants";

/**
 * Supplied page titles and meta descriptions, per region.
 *
 * This is the SEO metadata sheet, transcribed. It lives as data rather than
 * inline in each page because that is the shape it arrives in and the shape it
 * will be revised in: a spreadsheet with a row per page per region. Editing a
 * title should not mean opening a route file.
 *
 * `pageMetadata` consults this first and falls back to whatever the page passes
 * it, so a page with no row here keeps the title it always had. That is what
 * makes the sheet safe to fill in a few rows at a time.
 *
 * Two deliberate departures from the sheet as supplied:
 *
 *   - Em dashes are resolved, per the same instruction applied to the rest of
 *     the site. A comma where the dash joined a name to a role, a colon where
 *     it introduced a list, a full stop where a new clause began.
 *   - One double space, in the UAE events title, is closed up.
 *
 * NOT INCLUDED: the 174 article rows from the sheet. Article titles and
 * descriptions come from the database, and the articles themselves are being
 * corrected — several have the author's name in the title. Writing metadata
 * against records that are about to change would be work done twice. Those
 * rows land once the archive is fixed; see BLOCKERS.md.
 */
export type PageMeta = { title?: string; description?: string };

export const pageMetaByPath: Record<
  string,
  Partial<Record<TenantCode, PageMeta>>
> = {
  "/about/leadership/abdul-aziz-lang": {
    ae: {
      description:
        "Abdul Aziz Lang is one of athGADLANG's most senior partners: 30+ years in Consulting, Corporate Finance and Strategy, and a Fellow Chartered Accountant.",
    },
    bh: {
      description:
        "Abdul Aziz Lang is one of athGADLANG's most senior partners: 30+ years in Consulting, Corporate Finance and Strategy, and a Fellow Chartered Accountant.",
    },
    sa: {
      description:
        "Abdul Aziz Lang is one of Wathiq's most senior partners, 30+ years in Consulting, Corporate Finance and Strategy, and a Fellow Chartered Accountant.",
    },
    uk: {
      description:
        "Abdul Aziz Lang is one of athGADLANG's most senior partners, 30+ years in Consulting, Corporate Finance and Strategy, and a Fellow Chartered Accountant.",
    },
    pk: {
      description:
        "Abdul Aziz Lang is one of athGADLANG's most senior partners, 30+ years in Consulting, Corporate Finance and Strategy, and a Fellow Chartered Accountant.",
    },
  },
  "/about/leadership/abdullah-taimoor": {
    ae: {
      title: "Abdullah Taimoor, Partner, FAIM | athGADLANG",
      description:
        "Abdullah Taimoor is a Partner at athGADLANG with 18+ years in finance, including auditing at PwC. MBA in Finance, certified ACCA.",
    },
    bh: {
      title: "Abdullah Taimoor, Partner, FAIM | athGADLANG",
      description:
        "18+ years in finance and auditing, including PwC. Abdullah Taimoor is athGADLANG's Partner for Fixed Asset & Inventory Management, MBA, ACCA.",
    },
    sa: {
      title: "Abdullah Taimoor, Partner, FAIM | Wathiq",
      description:
        "18+ years in finance and auditing, including PwC. Abdullah Taimoor is Wathiq's Partner for Fixed Asset & Inventory Management, MBA, ACCA.",
    },
    uk: {
      title: "Abdullah Taimoor, Partner, FAIM | athGADLANG",
      description:
        "18+ years in finance and auditing, including PwC. Abdullah Taimoor is athGADLANG's Partner for Fixed Asset & Inventory Management, MBA, ACCA.",
    },
    pk: {
      title: "Abdullah Taimoor, Partner, FAIM | athGADLANG",
      description:
        "18+ years in finance and auditing, including PwC. Abdullah Taimoor is athGADLANG's Partner for Fixed Asset & Inventory Management, MBA, ACCA.",
    },
  },
  "/about/leadership/arshad-gadit": {
    ae: {
      description:
        "Arshad Gadit is athGADLANG's Global CEO and Partner, with over two decades of audit and advisory experience across Europe, Southeast Asia and the Middle East.",
    },
    bh: {
      description:
        "Arshad Gadit, athGADLANG's Global CEO, brings two decades of audit and advisory experience, including leading BDO Bahrain's audit practice.",
    },
    sa: {
      description:
        "Arshad Gadit, Wathiq's Global CEO, brings two decades of audit and advisory experience, including leading BDO Bahrain's audit practice.",
    },
    uk: {
      description:
        "Arshad Gadit, athGADLANG's Global CEO, brings two decades of audit and advisory experience, including leading BDO Bahrain's audit practice.",
    },
    pk: {
      description:
        "Arshad Gadit, athGADLANG's Global CEO, brings two decades of audit and advisory experience, including leading BDO Bahrain's audit practice.",
    },
  },
  "/about/leadership/arslan-mushtaq": {
    ae: {
      description:
        "Arslan Mushtaq leads athGADLANG's Tax division: 19+ years in VAT, Audit and Internal Audit at PwC, KPMG and FRHI, across the UK and UAE.",
    },
    bh: {
      description:
        "Arslan Mushtaq leads athGADLANG's Tax division: 19+ years in VAT, Audit and Internal Audit at PwC, KPMG and FRHI, across the UK and UAE.",
    },
    sa: {
      description:
        "Arslan Mushtaq leads Wathiq's Tax division, 19+ years in VAT, Audit and Internal Audit at PwC, KPMG and FRHI, across the UK and UAE.",
    },
    uk: {
      description:
        "Arslan Mushtaq leads athGADLANG's Tax division, 19+ years in VAT, Audit and Internal Audit at PwC, KPMG and FRHI, across the UK and UAE.",
    },
    pk: {
      description:
        "Arslan Mushtaq leads athGADLANG's Tax division, 19+ years in VAT, Audit and Internal Audit at PwC, KPMG and FRHI, across the UK and UAE.",
    },
  },
  "/about/leadership/haziq-neshat-akhtar": {
    ae: {
      title: "Haziq N. Akhtar, Partner, Risk Advisory | athGADLANG",
      description:
        "Haziq Neshat Akhtar leads athGADLANG & Wathiq's Advisory division, specializing in risk management, forensic audits and corporate advisory.",
    },
    bh: {
      title: "Haziq N. Akhtar, Partner, Risk Advisory | athGADLANG",
      description:
        "Haziq Neshat Akhtar leads athGADLANG & Wathiq's Advisory division, specializing in risk management, forensic audits and corporate advisory.",
    },
    sa: {
      title: "Haziq N. Akhtar, Partner, Risk Advisory | athGADLANG",
      description:
        "Haziq Neshat Akhtar leads Advisory at athGADLANG and Wathiq, specializing in risk management, forensic audits and corporate advisory.",
    },
    uk: {
      title: "Haziq N. Akhtar, Partner, Risk Advisory | athGADLANG",
      description:
        "Haziq Neshat Akhtar leads athGADLANG and Wathiq's Advisory division, specializing in risk management, forensic audits and corporate advisory.",
    },
    pk: {
      title: "Haziq N. Akhtar, Partner, Risk Advisory | athGADLANG",
      description:
        "Haziq Neshat Akhtar leads athGADLANG and Wathiq's Advisory division, specializing in risk management, forensic audits and corporate advisory.",
    },
  },
  "/about/leadership/khushboo-mushtaq": {
    ae: {
      title: "Khushboo Mushtaq, Director, FAAS | athGADLANG",
      description:
        "Khushboo Mushtaq, athGADLANG's FAAS Director, is a Chartered Accountant (ICAP) with strong IFRS expertise across multiple countries.",
    },
    bh: {
      title: "Khushboo Mushtaq, Director, FAAS | athGADLANG",
      description:
        "Khushboo Mushtaq, athGADLANG's FAAS Director, is a Chartered Accountant (ICAP) with strong IFRS expertise across multiple countries.",
    },
    sa: {
      title: "Khushboo Mushtaq, Director, FAAS | Wathiq",
      description:
        "Khushboo Mushtaq, Wathiq's FAAS Director, is a Chartered Accountant (ICAP) with strong IFRS expertise across multiple countries.",
    },
    uk: {
      title: "Khushboo Mushtaq, Director, FAAS | athGADLANG",
      description:
        "Khushboo Mushtaq, athGADLANG's FAAS Director, is a Chartered Accountant (ICAP) with strong IFRS expertise across multiple countries.",
    },
    pk: {
      title: "Khushboo Mushtaq, Director, FAAS | athGADLANG",
      description:
        "Khushboo Mushtaq, athGADLANG's FAAS Director, is a Chartered Accountant (ICAP) with strong IFRS expertise across multiple countries.",
    },
  },
  "/about/leadership/osman-babar": {
    ae: {
      description:
        "Osman Babar is athGADLANG's Partner for BPO Services, a Fellow of the Institute of Chartered Accountants of Pakistan, with 22+ years of experience.",
    },
    bh: {
      description:
        "Osman Babar is athGADLANG's Partner for BPO Services, a Fellow of the Institute of Chartered Accountants of Pakistan, with 22+ years of experience.",
    },
    sa: {
      description:
        "Osman Babar is Wathiq's Partner for BPO Services, a Fellow of the Institute of Chartered Accountants of Pakistan, with 22+ years of experience.",
    },
    uk: {
      description:
        "Osman Babar is athGADLANG's Partner for BPO Services, a Fellow of the Institute of Chartered Accountants of Pakistan, with 22+ years of experience.",
    },
    pk: {
      description:
        "Osman Babar is athGADLANG's Partner for BPO Services, a Fellow of the Institute of Chartered Accountants of Pakistan, with 22+ years of experience.",
    },
  },
  "/about/leadership/saqib-nisar": {
    ae: {
      description:
        "Saqib Nisar is athGADLANG's Managing Partner, with 25+ years in financial crime, AML, forensics and investigations across multiple industries.",
    },
    bh: {
      description:
        "Saqib Nisar, athGADLANG's Managing Partner, brings 25+ years in financial crime, AML, sanctions and forensic investigations.",
    },
    sa: {
      description:
        "Saqib Nisar, Wathiq's Managing Partner, brings 25+ years in financial crime, AML, sanctions assessments and forensic investigations.",
    },
    uk: {
      description:
        "Saqib Nisar, athGADLANG's Managing Partner, brings 25+ years in financial crime, AML, sanctions assessments and forensic investigations.",
    },
    pk: {
      description:
        "Saqib Nisar, athGADLANG's Managing Partner, brings 25+ years in financial crime, AML, sanctions assessments and forensic investigations.",
    },
  },
  "/about/leadership/sikandar-gadit": {
    ae: {
      title: "Sikandar Gadit, Partner & COO | athGADLANG",
      description:
        "Sikandar Gadit, athGADLANG & Wathiq's COO, brings 25+ years across the UAE, KSA, Bahrain and Pakistan in operations and growth strategy.",
    },
    bh: {
      title: "Sikandar Gadit, Partner & COO | athGADLANG",
      description:
        "Sikandar Gadit, athGADLANG & Wathiq's COO, brings 25+ years across the UAE, KSA, Bahrain and Pakistan in operations and growth strategy.",
    },
    sa: {
      description:
        "Sikandar Gadit, athGADLANG and Wathiq's COO, brings 25+ years across the UAE, KSA, Bahrain and Pakistan in operations and growth strategy.",
    },
    uk: {
      title: "Sikandar Gadit, Partner & COO | athGADLANG",
      description:
        "Sikandar Gadit, athGADLANG and Wathiq's COO, brings 25+ years across the UAE, KSA, Bahrain and Pakistan in operations and growth strategy.",
    },
    pk: {
      title: "Sikandar Gadit, Partner & COO | athGADLANG",
      description:
        "Sikandar Gadit, athGADLANG and Wathiq's COO, brings 25+ years across the UAE, KSA, Bahrain and Pakistan in operations and growth strategy.",
    },
  },
  "/about/leadership/usman-alam": {
    ae: {
      description:
        "Usman Alam brings 17+ years in Assurance, Financial Reporting and Compliance, with experience at PwC and KPMG. Fellow Chartered Accountant (ICAEW).",
    },
    bh: {
      description:
        "Usman Alam is a Partner at athGADLANG with 17+ years in Assurance and Compliance, including roles at PwC and KPMG. Fellow Chartered Accountant, ICAEW.",
    },
    sa: {
      description:
        "Usman Alam is a Partner at Wathiq with 17+ years in Assurance and Compliance, including roles at PwC and KPMG. Fellow Chartered Accountant, ICAEW.",
    },
    uk: {
      description:
        "Usman Alam is a Partner at athGADLANG with 17+ years in Assurance and Compliance, including roles at PwC and KPMG. Fellow Chartered Accountant, ICAEW.",
    },
    pk: {
      description:
        "Usman Alam is a Partner at athGADLANG with 17+ years in Assurance and Compliance, including roles at PwC and KPMG. Fellow Chartered Accountant, ICAEW.",
    },
  },
  "/about/leadership/yasir-gadit": {
    ae: {
      description:
        "Yasir Gadit leads athGADLANG's Consulting division. A Fellow Chartered Accountant (ICAP) with 19+ years of experience adding value for clients.",
    },
    bh: {
      description:
        "Yasir Gadit leads athGADLANG's Consulting division. A Fellow Chartered Accountant (ICAP) with 19+ years of experience adding value for clients.",
    },
    sa: {
      description:
        "Yasir Gadit leads Wathiq's Consulting division. A Fellow Chartered Accountant (ICAP) with 19+ years of experience adding value for clients.",
    },
    uk: {
      description:
        "Yasir Gadit leads athGADLANG's Consulting division. A Fellow Chartered Accountant (ICAP) with 19+ years of experience adding value for clients.",
    },
    pk: {
      description:
        "Yasir Gadit leads athGADLANG's Consulting division. A Fellow Chartered Accountant (ICAP) with 19+ years of experience adding value for clients.",
    },
  },
  "/company-profile": {
    ae: {
      title: "About athGADLANG | Tax, Audit & Advisory",
      description:
        "athGADLANG helps businesses navigate complexity with confidence: tax strategy, consulting, assurance and accounting across the UAE, KSA and Pakistan.",
    },
    bh: {
      title: "About athGADLANG | Tax, Audit & Advisory",
      description:
        "athGADLANG helps businesses navigate complexity: tax strategy, consulting, assurance and accounting across the UAE, KSA, Bahrain, the UK and Pakistan.",
    },
    sa: {
      title: "About Wathiq: Tax, Audit & Advisory",
      description:
        "Wathiq helps businesses navigate complexity, tax strategy, consulting, assurance and accounting across the UAE, KSA, Bahrain, the UK and Pakistan.",
    },
    uk: {
      title: "About athGADLANG | Tax & Advisory",
      description:
        "athGADLANG helps businesses navigate complexity, tax strategy, consulting, assurance and accounting across the UAE, KSA, Bahrain, the UK and Pakistan.",
    },
    pk: {
      title: "About athGADLANG | Tax & Advisory",
      description:
        "athGADLANG helps businesses navigate complexity, tax strategy, consulting, assurance and accounting across the UAE, KSA, Bahrain, the UK and Pakistan.",
    },
  },
  "/events": {
    ae: {
      title: "Tax, Audit & Compliance Events by athGADLANG",
      description:
        "Live webinars and in-person seminars on tax, audit, compliance and business setup across the UAE, KSA, Bahrain and Pakistan, hosted by athGADLANG specialists.",
    },
    bh: {
      title: "Tax, Audit & Compliance Events | athGADLANG",
      description:
        "Live webinars and seminars on tax, audit, compliance and business setup, hosted by the specialists who advise on them day to day.",
    },
    sa: {
      title: "Wathiq: Tax, Audit & Compliance Events",
      description:
        "Live webinars and seminars on tax, audit and business setup, hosted by the Wathiq specialists who advise on them day to day.",
    },
    uk: {
      title: "Tax, Audit & Compliance Events in the UK | athGADLANG",
      description:
        "Live webinars and seminars on tax, audit and business setup, hosted by the athGADLANG specialists who advise on them day to day.",
    },
    pk: {
      title: "Tax, Audit & Compliance Events in Pakistan | athGADLANG",
      description:
        "Live webinars and seminars on tax, audit and business setup, hosted by the athGADLANG specialists who advise on them day to day.",
    },
  },
  "/insights": {
    ae: {
      title: "Regulatory Updates & Expert Analysis | athGADLANG",
    },
    bh: {
      title: "Regulatory Updates & Expert Analysis | athGADLANG",
    },
    sa: {
      title: "Wathiq: Tax, Audit & Compliance Insights",
    },
    uk: {
      title: "Tax, Audit & Compliance Insights in the UK | athGADLANG",
    },
    pk: {
      title: "Tax, Audit & Compliance Insights in Pakistan | athGADLANG",
    },
  },
  "/legal-information": {
    sa: {
      title: "Legal Information | Wathiq Professional Services",
    },
  },
  "/privacy-policy": {
    ae: {
      title: "Privacy Policy | athGADLANG",
    },
    bh: {
      title: "Privacy Policy | athGADLANG Professional Services",
    },
    sa: {
      title: "Privacy Policy | Wathiq Professional Services",
    },
    uk: {
      title: "Privacy Policy | athGADLANG",
    },
    pk: {
      title: "Privacy Policy | athGADLANG, Pakistan",
    },
  },
  "/services": {
    ae: {
      title: "Assurance, Accounting, Tax & Advisory Services | athGADLANG",
    },
    bh: {
      title: "Assurance, Accounting, Tax & Advisory Services | athGADLANG",
    },
    sa: {
      title: "Assurance, Tax & Advisory Services | Wathiq",
    },
    uk: {
      title: "Assurance & Consulting Services in the UK | athGADLANG",
    },
    pk: {
      title: "Assurance & Consulting Services in Pakistan | athGADLANG",
    },
  },
  "/services/accounting": {
    ae: {
      title: "Accurate Accounting, Every Day | athGADLANG",
      description:
        "Our accounting experts ensure your stakeholders have accurate, up-to-date records for day-to-day operations and decision-making.",
    },
    bh: {
      title: "Accounting Services in Bahrain | athGADLANG",
      description:
        "athGADLANG's accounting experts deliver accurate, up-to-date records, so your team can make decisions with confidence, every single day.",
    },
    sa: {
      title: "Accounting & Bookkeeping Services in KSA | Wathiq",
      description:
        "Wathiq's accounting experts deliver accurate, up-to-date records, so your team can make decisions with confidence, every single day.",
    },
    uk: {
      title: "Accounting & Bookkeeping Services in the UK | athGADLANG",
      description:
        "athGADLANG's accounting experts deliver accurate, up-to-date records, so your team can make decisions with confidence, every single day.",
    },
    pk: {
      title: "Accounting & Bookkeeping Services in Pakistan | athGADLANG",
      description:
        "athGADLANG's accounting experts deliver accurate, up-to-date records, so your team can make decisions with confidence, every single day.",
    },
  },
  "/services/assurance": {
    ae: {
      title: "Strategic Assurance Solutions | athGADLANG",
      description:
        "Assurance solutions that go beyond audits: strengthening controls, managing risk and building confidence in your financials and compliance.",
    },
    bh: {
      title: "Assurance & Audit Services in Bahrain | athGADLANG",
      description:
        "athGADLANG's assurance services go beyond audits: strengthening controls and managing risks in your financials and operations in Bahrain.",
    },
    sa: {
      title: "Assurance & Audit Services in Saudi Arabia | Wathiq",
      description:
        "At Wathiq, we offer assurance services that go beyond audits, improving controls, managing risk and building confidence in your financials and operations.",
    },
    uk: {
      title: "Assurance & Audit Services in the UK | athGADLANG",
      description:
        "athGADLANG's assurance services go beyond audits, strengthening controls, managing risk and building confidence in your financials and operations.",
    },
    pk: {
      title: "Assurance & Audit Services in Pakistan | athGADLANG",
      description:
        "athGADLANG's assurance services go beyond audits, strengthening controls, managing risk and building confidence in your financials and operations.",
    },
  },
  "/services/business-process-outsourcing": {
    ae: {
      description:
        "aG Resources's BPO solutions help you delegate non-core functions, financial, customer support and back-office, while you scale faster and operate smarter.",
    },
    bh: {
      description:
        "aG Resources' BPO solutions help you delegate non-core functions: financial, customer support and back-office, while you scale faster and operate smarter.",
    },
    sa: {
      description:
        "Wathiq's BPO solutions help you delegate non-core functions, financial, customer support and back-office, while you scale faster and operate smarter.",
    },
    uk: {
      description:
        "aG Resources' BPO solutions help you delegate non-core functions, financial, customer support and back-office, while you scale faster and operate smarter.",
    },
    pk: {
      description:
        "aG Resources' BPO solutions help you delegate non-core functions, financial, customer support and back-office, while you scale faster and operate smarter.",
    },
  },
  "/services/consulting": {
    ae: {
      title: "Consulting Services in the UAE | athGADLANG",
      description:
        "athGADLANG's consulting services combine deep industry expertise with practical insights, driving sustainable growth for your business.",
    },
    bh: {
      title: "Consulting Services in Bahrain | athGADLANG",
      description:
        "athGADLANG's consulting services combine deep industry expertise with practical insights, driving sustainable growth for your business.",
    },
    sa: {
      title: "Consulting Services in Saudi Arabia | Wathiq",
      description:
        "Wathiq's consulting services combine deep industry expertise with practical insights, helping you unlock opportunities and achieve sustainable growth.",
    },
    uk: {
      title: "Consulting Services in the UK | athGADLANG",
      description:
        "athGADLANG's consulting services combine deep industry expertise with practical insights, helping you unlock opportunities and achieve sustainable growth.",
    },
    pk: {
      title: "Consulting Services in Pakistan | athGADLANG",
      description:
        "athGADLANG's consulting services combine deep industry expertise with practical insights, helping you unlock opportunities and achieve sustainable growth.",
    },
  },
  "/services/corporate-services": {
    ae: {
      description:
        "With aG Corporate Services, get expert corporate services covering UAE company formation, including jurisdiction, trade license, visas, and bank account.",
    },
    bh: {
      description:
        "aG Corporate Services simplifies Bahrain company formation, from choosing the right jurisdiction to trade licenses, visas and bank accounts.",
    },
    sa: {
      title: "Corporate Services in Saudi Arabia | aG Corporate Services",
      description:
        "aG Corporate Services simplifies Saudi Arabia company formation, from choosing the right jurisdiction to trade licenses, visas and bank accounts.",
    },
    uk: {
      description:
        "aG Corporate Services simplifies UK company formation, from choosing the right structure to registration, licensing and banking setup.",
    },
    pk: {
      description:
        "aG Corporate Services simplifies Pakistan company formation, from choosing the right structure to registration, licensing and banking setup.",
    },
  },
  "/services/fixed-asset-inventory-management": {
    ae: {
      description:
        "athGADLANG delivers expert fixed asset and inventory management with precise tracking, valuation and compliance, minimizing risk at every stage.",
    },
    bh: {
      description:
        "athGADLANG's fixed asset and inventory management solutions ensure accurate tracking, valuation and compliance, minimizing risk in dynamic environments.",
    },
    sa: {
      description:
        "Wathiq's fixed asset and inventory management solutions ensure accurate tracking, valuation and compliance, minimizing risk in dynamic environments.",
    },
    uk: {
      description:
        "athGADLANG's fixed asset and inventory management solutions ensure accurate tracking, valuation and compliance, minimizing risk in dynamic environments.",
    },
    pk: {
      description:
        "athGADLANG's fixed asset and inventory management solutions ensure accurate tracking, valuation and compliance, minimizing risk in dynamic environments.",
    },
  },
  "/services/remote-workforce-solutions": {
    ae: {
      description:
        "Access top talent without overhead. aG Resources manages payroll and infrastructure while you scale with dedicated remote professionals.",
    },
    bh: {
      description:
        "aG Resources provides dedicated remote professionals under a secondment model. We manage payroll and infrastructure, you get the expertise.",
    },
    sa: {
      description:
        "Wathiq provides dedicated remote professionals under a secondment model, we manage payroll and infrastructure, you get the expertise.",
    },
    uk: {
      description:
        "aG Resources provides dedicated remote professionals under a secondment model, we manage payroll and infrastructure, you get the expertise.",
    },
    pk: {
      description:
        "aG Resources provides dedicated remote professionals under a secondment model, we manage payroll and infrastructure, you get the expertise.",
    },
  },
  "/services/resourcing": {
    ae: {
      title: "Resourcing & Talent Solutions in the UAE | aG Resources",
      description:
        "aG Resources delivers flexible resourcing solutions that help businesses adapt and scale: the right talent and support, exactly when you need it.",
    },
    bh: {
      title: "Resourcing & Talent Solutions in Bahrain | athGADLANG",
      description:
        "athGADLANG delivers flexible resourcing solutions that help businesses adapt and scale: the right talent and support, exactly when you need it.",
    },
    sa: {
      title: "Resourcing & Talent Solutions in KSA | Wathiq",
      description:
        "Wathiq delivers flexible resourcing solutions that help businesses adapt and scale, the right talent and support, exactly when you need it.",
    },
    uk: {
      title: "Resourcing & Talent Solutions in the UK | athGADLANG",
      description:
        "athGADLANG delivers flexible resourcing solutions that help businesses adapt and scale, the right talent and support, exactly when you need it.",
    },
    pk: {
      title: "Resourcing & Talent Solutions in Pakistan | athGADLANG",
      description:
        "athGADLANG delivers flexible resourcing solutions that help businesses adapt and scale, the right talent and support, exactly when you need it.",
    },
  },
  "/services/talent-acquisition": {
    ae: {
      description:
        "aG Resources is your dedicated recruitment partner, connecting you with top-tier candidates across industries: junior staff to C-suite.",
    },
    bh: {
      description:
        "aG Resources' strategic hiring solutions connect you with top-tier talent across industries, from junior staff to C-suite, wherever you're growing.",
    },
    sa: {
      title: "Talent Acquisition Services in KSA | Wathiq",
      description:
        "Wathiq' strategic hiring solutions connect you with top-tier talent across industries, from junior staff to C-suite, wherever you're growing.",
    },
    uk: {
      description:
        "aG Resources' strategic hiring solutions connect you with top-tier talent across industries, from junior staff to C-suite, wherever you're growing.",
    },
    pk: {
      description:
        "aG Resources' strategic hiring solutions connect you with top-tier talent across industries, from junior staff to C-suite, wherever you're growing.",
    },
  },
  "/services/tax": {
    ae: {
      title: "Tax Services for the UAE's Corporate Tax Era | athGADLANG",
      description:
        "athGADLANG helps businesses navigate UAE Corporate Tax with confidence: compliance, planning and precision, federal to emirate-specific.",
    },
    bh: {
      title: "Tax Services in Bahrain | athGADLANG",
      description:
        "athGADLANG's tax services cover the Bahrain's Corporate Tax regime - compliance, optimization and strategic planning, federal to emirate-specific.",
    },
    sa: {
      title: "\"Tax Services in Saudi Arabia | Wathiq",
      description:
        "Wathiq's tax services help businesses navigate Saudi Arabia's tax landscape, from VAT and Zakat to corporate tax compliance and strategic planning.",
    },
    uk: {
      title: "Tax Services in the UK | athGADLANG",
      description:
        "athGADLANG's tax services help UK businesses navigate HMRC compliance, corporate tax and VAT, with strategic planning built for precision and foresight.",
    },
    pk: {
      title: "Tax Services in Pakistan | athGADLANG",
      description:
        "athGADLANG's tax services help businesses navigate tax compliance, income tax and sales tax, with strategic planning built for precision.",
    },
  },
  "/terms-of-use": {
    ae: {
      title: "Terms Of Use | athGADLANG",
    },
    bh: {
      title: "Terms of Use | athGADLANG Professional Services",
    },
    sa: {
      title: "Terms of Use | Wathiq Professional Services",
    },
    uk: {
      title: "Terms of Use | athGADLANG",
    },
    pk: {
      title: "Terms of Use | athGADLANG, Pakistan",
    },
  },
  "/webinars": {
    ae: {
      title: "Webinars on Tax, Audit & Business Setup | athGADLANG",
    },
    bh: {
      title: "Bahrain Webinars on Tax & Compliance | athGADLANG",
    },
    sa: {
      title: "Wathiq: Tax, Audit & Compliance Webinars",
    },
    uk: {
      title: "Tax, Audit & Compliance Webinars in the UK | athGADLANG",
    },
    pk: {
      title: "Tax, Audit & Compliance Webinars in Pakistan | athGADLANG",
    },
  },
};

/**
 * The supplied title and description for a page, if the sheet has a row for it.
 *
 * Paths are matched exactly and without a trailing slash, the homepage being
 * "/" — the same form `pageMetadata` and `absoluteUrl` already use.
 */
export function pageMetaFor(region: TenantCode, path: string): PageMeta | undefined {
  const key = path.length > 1 ? path.replace(/\/$/, "") : path;
  return pageMetaByPath[key]?.[region];
}
