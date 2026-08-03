"use client";

import * as React from "react";

import { Field } from "@/components/admin/field";
import { tenants, type TenantCode } from "@/lib/tenants";
import { cn } from "@/lib/utils";

/**
 * Which regional sites an item appears on.
 *
 * Each region is its own subdomain and its own prerendered site, so this is a
 * real publishing decision rather than a tag: a UK-only article never renders
 * on ksa.athgadlang.com. Everything is ticked by default, because most content
 * is group-wide and the narrow case should be the one you have to choose.
 */
export function RegionField({
  selected,
  error,
}: {
  selected: TenantCode[];
  error?: string;
}) {
  const [regions, setRegions] = React.useState<TenantCode[]>(selected);

  const toggle = (code: TenantCode) =>
    setRegions((current) =>
      current.includes(code)
        ? current.filter((item) => item !== code)
        : [...current, code],
    );

  const all = regions.length === tenants.length;

  return (
    <Field
      name="regions"
      label="Regions"
      hint="The regional sites this appears on."
      error={error}
      required
    >
      <div className="flex flex-wrap items-center gap-2">
        {tenants.map((tenant) => {
          const active = regions.includes(tenant.code);

          return (
            <label
              key={tenant.code}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium ring-1 transition-colors",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                active
                  ? "bg-brand/10 text-brand ring-brand/30"
                  : "bg-white text-neutral-500 ring-neutral-200 hover:bg-neutral-50",
              )}
            >
              <input
                type="checkbox"
                name="regions"
                value={tenant.code}
                checked={active}
                onChange={() => toggle(tenant.code)}
                className="sr-only"
              />
              {tenant.label}
            </label>
          );
        })}

        <button
          type="button"
          onClick={() =>
            setRegions(all ? [] : tenants.map((tenant) => tenant.code))
          }
          className="rounded-lg px-2 py-1.5 text-xs font-semibold text-neutral-500 underline underline-offset-4 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {all ? "Clear all" : "Select all"}
        </button>
      </div>
    </Field>
  );
}
