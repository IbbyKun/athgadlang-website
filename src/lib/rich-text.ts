import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";

/**
 * The rich text format used by admin-authored articles.
 *
 * Storage is ProseMirror JSON, not HTML. That choice is what makes rendering
 * safe: the document is re-serialised through the schema below, so a node or
 * attribute the schema does not know about cannot reach the page. Storing HTML
 * would mean trusting — and having to sanitise — arbitrary markup instead.
 *
 * This module is imported by both the editor (client) and the renderer
 * (server), so the two can never drift onto different schemas. Keep it free of
 * React and of anything browser-only.
 */

export type RichDoc = JSONContent;

/** Protocols a link is allowed to use. Everything else is stripped. */
const allowedProtocols = ["http", "https", "mailto", "tel"];

/**
 * The editor's vocabulary. Deliberately narrow — headings, emphasis, lists,
 * quotes and links are what an article needs, and every element left out is
 * one less thing that can arrive in the page or break the article typography.
 *
 * Only h2 and h3 are offered: h1 is the article title, rendered by the page.
 */
export const richTextExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    horizontalRule: false,
    link: {
      openOnClick: false,
      defaultProtocol: "https",
      protocols: allowedProtocols,
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    },
  }),
];

/** A document with nothing in it — the starting state for a new article. */
export const emptyRichDoc: RichDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

/** True when the document has no text in it, so a draft can be rejected. */
export function isRichDocEmpty(doc: RichDoc | null | undefined) {
  return richTextToPlainText(doc).trim().length === 0;
}

/**
 * Flattens a document to its text, for excerpts, search and empty checks.
 * Block boundaries become spaces so words from adjacent blocks do not run
 * together.
 */
export function richTextToPlainText(doc: RichDoc | null | undefined): string {
  if (!doc) return "";

  const parts: string[] = [];

  const walk = (node: JSONContent) => {
    if (typeof node.text === "string") parts.push(node.text);
    node.content?.forEach(walk);
    if (node.content?.length) parts.push(" ");
  };

  walk(doc);
  return parts.join("").replace(/\s+/g, " ").trim();
}

/**
 * Removes anything the schema would accept but the site should not carry:
 * currently link marks whose href uses a protocol we do not allow.
 *
 * The editor already refuses such links on input, so this is the second line
 * of defence — it covers documents edited straight into the database and any
 * future import path. Cheap enough to run on both save and render.
 */
export function sanitizeRichDoc(doc: RichDoc): RichDoc {
  const clean = (node: JSONContent): JSONContent => {
    const marks = node.marks?.filter(
      (mark) => mark.type !== "link" || isAllowedHref(mark.attrs?.href),
    );

    return {
      ...node,
      ...(marks ? { marks } : {}),
      ...(node.content ? { content: node.content.map(clean) } : {}),
    };
  };

  return clean(doc);
}

function isAllowedHref(href: unknown): boolean {
  if (typeof href !== "string" || !href) return false;

  // Relative links carry no protocol and are always ours.
  if (href.startsWith("/") || href.startsWith("#")) return true;

  const protocol = href.split(":")[0]?.toLowerCase();
  return allowedProtocols.includes(protocol);
}

/**
 * Renders a document to HTML for `dangerouslySetInnerHTML`.
 *
 * "Dangerously" is a misnomer here: the input has been through the schema and
 * `sanitizeRichDoc`, so the output can only contain the elements the
 * extensions above define. A malformed document — one ProseMirror cannot build
 * a node from — yields an empty string rather than taking the page down.
 */
export function renderRichText(doc: RichDoc | null | undefined): string {
  if (!doc) return "";

  try {
    return generateHTML(sanitizeRichDoc(doc), richTextExtensions);
  } catch (error) {
    console.error("[rich-text] could not render document", error);
    return "";
  }
}

/**
 * Splits the lead paragraph off the front of a document.
 *
 * The article layout sets the opening paragraph larger and rules it off from
 * the rest — the same treatment <InsightBody> gives the built-in articles.
 * Doing it here, on the document, keeps that decision out of the renderer and
 * means the two article formats look identical on the page.
 */
export function splitLead(doc: RichDoc | null | undefined): {
  lead?: RichDoc;
  body: RichDoc;
} {
  const content = doc?.content ?? [];
  const [first, ...rest] = content;

  if (first?.type !== "paragraph" || !first.content?.length) {
    return { body: { type: "doc", content } };
  }

  return {
    lead: { type: "doc", content: [first] },
    body: { type: "doc", content: rest },
  };
}
