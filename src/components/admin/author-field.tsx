"use client";

import { Check, ChevronDown } from "lucide-react";

import { Field, fieldProps } from "@/components/admin/field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { insightAuthors, insightByline } from "@/lib/insights";
import { cn } from "@/lib/utils";

/**
 * Who wrote the article.
 *
 * A real dropdown, not a datalist. The datalist this replaces offered the same
 * six names, but a browser only reveals those suggestions once you start typing
 * into the field — so to an editor who had not been told they were there, the
 * field looked exactly like the free-text box it had always been, and the names
 * may as well not have existed. A list worth having is a list you can see.
 *
 * The empty value is a real option rather than an absence: "leave it blank to
 * get the house byline" is a rule you have to know, and one nobody discovers by
 * looking at an empty box.
 *
 * A byline already on the article that is not one of the six — the imported
 * archive is full of them — is kept, and shown at the top of the menu as the
 * current selection. Choosing a name is not allowed to quietly discard the one
 * that was there.
 */
export function AuthorField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (author: string) => void;
  error?: string;
}) {
  const known = insightAuthors.includes(value);
  const selectedLabel = value || insightByline;

  return (
    <Field
      name="author"
      label="Author"
      hint="The byline on the article. Defaults to the house byline."
      error={error}
    >
      {/* The value the form actually submits. The trigger below is a button, so
          without this the field would post nothing. */}
      <input type="hidden" {...fieldProps("author", error)} value={value} />

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex h-8 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-2.5 py-1 text-left text-sm transition-colors outline-none",
            "focus-visible:border-ring aria-expanded:border-ring",
            error && "border-destructive",
          )}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {selectedLabel}
          </span>
          <ChevronDown aria-hidden className="size-4 shrink-0 opacity-60" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          // Matches the trigger, so the menu reads as the field opening rather
          // than as a panel appearing next to it.
          className="w-(--radix-dropdown-menu-trigger-width)"
        >
          <AuthorOption
            label={insightByline}
            hint="House byline"
            selected={!value}
            onSelect={() => onChange("")}
          />

          <DropdownMenuSeparator />

          {/* A byline from outside the list, kept rather than dropped. */}
          {value && !known && (
            <>
              <AuthorOption
                label={value}
                hint="On this article"
                selected
                onSelect={() => onChange(value)}
              />
              <DropdownMenuSeparator />
            </>
          )}

          {insightAuthors.map((name) => (
            <AuthorOption
              key={name}
              label={name}
              selected={value === name}
              onSelect={() => onChange(name)}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Field>
  );
}

function AuthorOption({
  label,
  hint,
  selected,
  onSelect,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem onSelect={onSelect} className="justify-between gap-3">
      <span className="flex min-w-0 flex-col">
        <span className="truncate">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </span>
      {selected && <Check aria-hidden className="size-4 shrink-0 text-brand" />}
    </DropdownMenuItem>
  );
}
