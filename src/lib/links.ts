/**
 * True for links that leave this site. Derived from the href rather than a
 * flag on each entry, so the two can never disagree.
 */
export function isExternal(href: string) {
  return /^(https?:)?\/\//.test(href);
}

/** Attributes every outbound link should carry. */
export const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer",
} as const;
