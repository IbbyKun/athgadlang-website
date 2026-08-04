"use client";

import * as React from "react";
import { ArrowUpRight, ChevronRight, Search } from "lucide-react";

import { loadSearchIndex } from "@/app/actions/content";
import { Input } from "@/components/ui/input";
import { SectionLink } from "@/components/ui/section-link";
import { externalLinkProps } from "@/lib/links";
import { searchSite, type SearchItem } from "@/lib/search";
import { cn } from "@/lib/utils";

type SearchFormProps = {
  /** Which region's content to search. */
  region: string;
  placeholder?: string;
  className?: string;
  /** Called once a result has been opened — closes the mobile drawer. */
  onNavigate?: () => void;
};

/**
 * Site search: services and their sections, people, events, articles and
 * recorded sessions — including everything published from the admin panel.
 *
 * The index is fetched once, when the box is first opened, and then matched in
 * the browser: results appear as the query is typed, with no request per
 * keystroke and no search page in between. It is not embedded in the page,
 * because with the article archive published it runs to tens of kilobytes that
 * most visits would never use. Matching is fuzzy — see `searchSite` — so "crptx"
 * finds Corporate Tax.
 *
 * Enter clicks the highlighted result rather than routing itself, which keeps
 * every kind of destination — a page, a section of one, a recording on YouTube
 * — handled in one place: the link.
 */
export function SearchForm({
  region,
  placeholder = "Search ...",
  className,
  onNavigate,
}: SearchFormProps) {
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState<SearchItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const asked = React.useRef(false);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const results = React.useMemo(() => searchSite(query, index), [query, index]);

  /**
   * Fetches the index the first time the box is opened, and keeps it.
   *
   * On focus rather than on first keystroke: opening the box is the earliest
   * signal, and it buys the round trip the time it takes to type two characters —
   * which is when results first appear anyway.
   */
  const ensureIndex = React.useCallback(() => {
    if (asked.current) return;
    asked.current = true;
    setLoading(true);

    loadSearchIndex(region)
      .then(setIndex)
      .catch(() => {
        // Let a failed load be retried on the next focus.
        asked.current = false;
      })
      .finally(() => setLoading(false));
  }, [region]);
  const listId = "site-search-results";

  const container = React.useRef<HTMLDivElement>(null);
  const list = React.useRef<HTMLUListElement>(null);

  const show = open && query.trim().length >= 2;

  const close = () => {
    setOpen(false);
    setActive(0);
  };

  const openResult = (index: number) => {
    // Clicking the anchor rather than pushing a route: the link already knows
    // whether it is a page, a section on one, or an outbound recording.
    list.current?.querySelectorAll("a")[index]?.click();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
      return;
    }

    if (!show || results.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => {
        const next = current + step;
        if (next < 0) return results.length - 1;
        if (next >= results.length) return 0;
        return next;
      });
    }
  };

  return (
    <div
      ref={container}
      className={cn("group relative flex items-center", className)}
      // Closes when focus leaves the input and the results together, so a
      // click on a result is not cancelled before it lands.
      onBlur={(event) => {
        if (!container.current?.contains(event.relatedTarget as Node)) close();
      }}
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (show && results.length > 0) openResult(active);
        }}
        className="flex w-full items-center"
      >
        <label htmlFor="site-search" className="sr-only">
          Search the site
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute left-2.5 size-4 text-brand"
        />
        <Input
          id="site-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            ensureIndex();
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={show}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            show && results.length > 0 ? `search-result-${active}` : undefined
          }
          className={cn(
            "h-10 w-full rounded-sm border-transparent bg-transparent pl-9 shadow-none",
            "placeholder:text-neutral-400 focus-visible:bg-white md:w-36 md:focus-visible:w-56",
            // A brand-red border on focus instead of the Input's default ring.
            "focus-visible:border-brand focus-visible:ring-0",
            "transition-[width,background-color,border-color] duration-300",
          )}
        />
      </form>

      {show && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-neutral-500">
              {loading ? (
                "Searching…"
              ) : (
                <>
                  Nothing matches{" "}
                  <span className="font-medium">{query.trim()}</span>.
                </>
              )}
            </p>
          ) : (
            <ul ref={list} id={listId} role="listbox" className="max-h-96 overflow-y-auto p-1.5">
              {results.map((item, index) => (
                <li key={item.href} role="presentation">
                  <Result
                    item={item}
                    id={`search-result-${index}`}
                    active={index === active}
                    onPointerEnter={() => setActive(index)}
                    onSelect={() => {
                      close();
                      setQuery("");
                      onNavigate?.();
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Result({
  item,
  id,
  active,
  onPointerEnter,
  onSelect,
}: {
  item: SearchItem;
  id: string;
  active: boolean;
  onPointerEnter: () => void;
  onSelect: () => void;
}) {
  const className = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 outline-none transition-colors",
    active ? "bg-brand/5" : "hover:bg-neutral-50",
  );

  const body = (
    <>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-brand-navy">
          {item.title}
        </span>
        {item.subtitle && (
          <span className="truncate text-xs text-neutral-500">
            {item.subtitle}
          </span>
        )}
      </span>

      <span className="ml-auto flex shrink-0 items-center gap-1.5">
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-neutral-500">
          {item.kind}
        </span>
        {item.external ? (
          <ArrowUpRight aria-hidden className="size-3.5 text-brand" />
        ) : (
          <ChevronRight aria-hidden className="size-3.5 text-brand" />
        )}
      </span>
    </>
  );

  if (item.external) {
    return (
      <a
        id={id}
        role="option"
        aria-selected={active}
        href={item.href}
        {...externalLinkProps}
        onPointerEnter={onPointerEnter}
        onClick={onSelect}
        className={className}
      >
        {body}
      </a>
    );
  }

  return (
    <SectionLink
      id={id}
      role="option"
      aria-selected={active}
      href={item.href}
      onPointerEnter={onPointerEnter}
      onClick={onSelect}
      className={className}
    >
      {body}
    </SectionLink>
  );
}
