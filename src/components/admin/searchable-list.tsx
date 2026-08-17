"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type SearchableItem = {
  /** Stable key. The row's database id. */
  id: string;
  /** What the query is matched against, e.g. the title and the slug. */
  terms: (string | null | undefined)[];
  /** The rendered row, built by the page that knows its shape. */
  children: React.ReactNode;
};

/**
 * Search over an admin list.
 *
 * Filtering happens in the browser, against rows the page has already loaded.
 * These lists run to a few hundred items and every one of them is already on
 * the page, so a round trip per keystroke would buy nothing and cost the
 * instant feedback that makes a search box worth having. If they ever grow past
 * a couple of thousand rows this is the thing to revisit, and it would want
 * paging and a server-side query together rather than one without the other.
 *
 * Words match independently and in any order, so "dmcc audit" finds "DMCC
 * Approved Auditors" whichever way round it was typed. The slug is searched as
 * well as the title, because a slug is what you have in hand when you are
 * chasing a URL that is 404ing.
 */
function matches(item: SearchableItem, words: string[]) {
  if (!words.length) return true;
  const haystack = item.terms.filter(Boolean).join(" ").toLowerCase();
  return words.every((word) => haystack.includes(word));
}

function useSearch() {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  return {
    query,
    setQuery,
    inputRef,
    words: query.toLowerCase().split(/\s+/).filter(Boolean),
    clear() {
      setQuery("");
      inputRef.current?.focus();
    },
  };
}

type Search = ReturnType<typeof useSearch>;

function SearchBox({
  search,
  label,
  count,
}: {
  search: Search;
  label: string;
  count: string;
}) {
  const { query, setQuery, inputRef, clear } = search;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-0 flex-1 sm:max-w-sm">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
        />
        <label htmlFor="admin-search" className="sr-only">
          Search {label} by title or slug
        </label>
        <input
          id="admin-search"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === "Escape" && clear()}
          placeholder={`Search ${label} by title or slug`}
          className={cn(
            "h-9 w-full rounded-sm border border-input bg-transparent pl-8 pr-8 text-sm outline-none transition-colors",
            "focus-visible:border-ring placeholder:text-muted-foreground",
            // Safari draws its own clear button on type=search. Ours is the one
            // that also puts focus back in the field.
            "[&::-webkit-search-cancel-button]:appearance-none",
          )}
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-sm text-neutral-500 transition-colors hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
      </div>

      {/* Announced, so a screen reader hears the list shrink as you type. */}
      <p aria-live="polite" className="text-xs text-neutral-500">
        {count}
      </p>
    </div>
  );
}

function NoMatches({ query }: { query: string }) {
  return (
    <p className="rounded-xl bg-white p-6 text-center text-sm text-neutral-500 ring-1 ring-neutral-200">
      Nothing matches{" "}
      <span className="font-semibold text-brand-navy">{query}</span>.
    </p>
  );
}

function Rows({ items }: { items: SearchableItem[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.id}>{item.children}</li>
      ))}
    </ul>
  );
}

/** One flat list with a search box over it. */
export function SearchableList({
  items,
  label,
  className,
}: {
  items: SearchableItem[];
  /** Plural noun for the count and the empty state, e.g. "articles". */
  label: string;
  className?: string;
}) {
  const search = useSearch();
  const visible = items.filter((item) => matches(item, search.words));

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <SearchBox
        search={search}
        label={label}
        count={
          search.query
            ? `${visible.length} of ${items.length} ${label}`
            : `${items.length} ${label}`
        }
      />

      {visible.length === 0 ? (
        <NoMatches query={search.query} />
      ) : (
        <Rows items={visible} />
      )}
    </div>
  );
}

/**
 * Several titled groups under one search box, for a list that is already
 * divided — events are split into upcoming and already run.
 *
 * One box rather than one per group: you search for an event, not for an
 * upcoming event, and you often do not know which half it is in. Groups that
 * match nothing drop out entirely rather than sitting there as empty headings.
 */
export function SearchableGroups({
  groups,
  label,
  className,
}: {
  groups: { title: string; items: SearchableItem[] }[];
  label: string;
  className?: string;
}) {
  const search = useSearch();
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  const filtered = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matches(item, search.words)),
    }))
    .filter((group) => group.items.length > 0);

  const shown = filtered.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <SearchBox
        search={search}
        label={label}
        count={
          search.query ? `${shown} of ${total} ${label}` : `${total} ${label}`
        }
      />

      {filtered.length === 0 ? (
        <NoMatches query={search.query} />
      ) : (
        <div className="flex flex-col gap-8">
          {filtered.map((group) => (
            <section key={group.title} className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {group.title} ({group.items.length})
              </h2>
              <Rows items={group.items} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
