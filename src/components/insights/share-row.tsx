"use client";

import * as React from "react";
import { Check, Link2 } from "lucide-react";

import {
  FacebookIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/icons/social";
import { cn } from "@/lib/utils";

type Target = {
  label: string;
  Icon: (props: React.ComponentProps<"svg">) => React.ReactElement;
  /** Builds the share intent from the live page URL and the article title. */
  intent: (url: string, title: string) => string;
};

const targets: Target[] = [
  {
    label: "Facebook",
    Icon: FacebookIcon,
    intent: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "X",
    Icon: XIcon,
    intent: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url,
      )}&text=${encodeURIComponent(title)}`,
  },
  {
    label: "LinkedIn",
    Icon: LinkedinIcon,
    intent: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url,
      )}`,
  },
];

/**
 * Share buttons for an article.
 *
 * Buttons rather than links: the page is prerendered for five regional
 * domains, so the canonical URL is only known in the browser. Each intent is
 * built from `window.location.href` at click time.
 */
export function ShareRow({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  // Clears the confirmation, and cancels cleanly if the row unmounts first.
  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // Clipboard permission denied — nothing useful to say, so stay quiet.
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="text-sm font-semibold text-brand-navy">Share:</span>

      <ul className="flex items-center gap-2">
        {targets.map(({ label, Icon, intent }) => (
          <li key={label}>
            <button
              type="button"
              aria-label={`Share on ${label}`}
              onClick={() =>
                window.open(
                  intent(window.location.href, title),
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className={buttonClass}
            >
              <Icon className="size-4" />
            </button>
          </li>
        ))}

        <li>
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copy link to this article"
            className={buttonClass}
          >
            {copied ? (
              <Check aria-hidden className="size-4" />
            ) : (
              <Link2 aria-hidden className="size-4" />
            )}
          </button>
        </li>
      </ul>

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}

const buttonClass = cn(
  "grid size-9 place-items-center rounded-full bg-neutral-100 text-brand-navy ring-1 ring-neutral-200 transition-colors",
  "hover:bg-brand hover:text-white hover:ring-brand",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
);
