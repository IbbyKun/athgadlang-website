"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchFormProps = {
  /** Where the query is submitted. */
  action?: string;
  placeholder?: string;
  className?: string;
};

export function SearchForm({
  action = "/search",
  placeholder = "Search ...",
  className,
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`${action}?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={cn("group relative flex items-center", className)}
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
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 w-36 rounded-full border-transparent bg-transparent pl-9 shadow-none",
          "placeholder:text-neutral-400 focus-visible:w-56 focus-visible:border-input focus-visible:bg-white",
          "transition-[width,background-color,border-color] duration-300",
        )}
      />
    </form>
  );
}
