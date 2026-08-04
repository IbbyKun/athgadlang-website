import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";

import { siteConfig } from "@/lib/site-config";
import { defaultFavicon } from "@/lib/tenants";
import "./globals.css";

// `--font-sans` is what globals.css maps Tailwind's font-sans onto.
// Montserrat is a variable font, so no `weight` list is needed.
const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Defaults; the [tenant] layout overrides title and icons per region.
 *
 * Deliberately no `title.template` here: a parent template also wraps a child
 * segment's `title.default`, which turned the tenant title into
 * "athGADLANG - tagline | athGADLANG". The template lives in the tenant layout.
 */
export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  icons: {
    icon: [{ url: defaultFavicon.svg, type: "image/svg+xml" }],
    apple: [{ url: defaultFavicon.apple, sizes: "180x180" }],
  },
};

/**
 * Owns the document shell only. Header and footer live in the [tenant] layout,
 * since they need to know which region is being served.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      /*
        Suspends `scroll-smooth` for the duration of a route change, so moving
        between pages jumps to the top instead of animating the whole way there.
        In-page anchors — the footer's Top link, every SectionLink to /#contact —
        keep scrolling smoothly, which is the only reason scroll-smooth is here.

        Next 16 stopped doing this by default and warns in development until the
        attribute says which behaviour is wanted.
      */
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
