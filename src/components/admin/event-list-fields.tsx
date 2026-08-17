"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  emptyAgendaItem,
  emptySpeaker,
  type AgendaDraft,
  type SpeakerDraft,
} from "@/lib/admin/form";

/**
 * The two ordered lists on an event: who is presenting, and the running order.
 *
 * Both are edited as rows that can be added, removed and moved, and both travel
 * to the server as JSON in a hidden input — the same approach the rich text
 * editor takes, and the reason neither needs indexed field names like
 * `speakers.0.name` that the action would then have to reassemble.
 *
 * Order is the point of both lists, so reordering is a first-class control
 * rather than something to be achieved by deleting and retyping.
 */

/** Shared scaffolding: the heading, the rows, and the button that adds one. */
function RowList<T>({
  name,
  legend,
  rowNoun,
  hint,
  error,
  items,
  onAdd,
  onRemove,
  onMove,
  addLabel,
  emptyLabel,
  children,
}: {
  /** Also the hidden input's name and the key the action reports errors under. */
  name: string;
  legend: string;
  /** Singular noun for a row, used in the reorder buttons' labels. */
  rowNoun: string;
  hint: string;
  error?: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, delta: number) => void;
  addLabel: string;
  emptyLabel: string;
  children: (item: T, index: number) => React.ReactNode;
}) {
  return (
    /*
      A fieldset with a legend, not a <Field>. `Field` renders a <label for=...>,
      which needs a single control to point at; this group has three inputs per
      row and no one control that the name belongs to, so a label here would
      reference an element that does not exist. A legend names the group without
      claiming to name a control.
    */
    <fieldset className="flex flex-col gap-3">
      <legend className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-brand-navy">{legend}</span>
        <span className="text-xs leading-relaxed text-neutral-500">{hint}</span>
      </legend>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-500">
          {emptyLabel}
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((item, index) => (
            // Index as key. These rows have no stable identity — a name is
            // editable and may be blank or duplicated mid-typing — and the
            // inputs are controlled, so React rebuilding a row on reorder
            // renders the right values either way.
            <li
              key={index}
              className="flex flex-col gap-3 rounded-xl bg-neutral-50 p-3 ring-1 ring-neutral-200"
            >
              {children(item, index)}

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <IconButton
                    label={`Move ${rowNoun} ${index + 1} up`}
                    disabled={index === 0}
                    onClick={() => onMove(index, -1)}
                    icon={ArrowUp}
                  />
                  <IconButton
                    label={`Move ${rowNoun} ${index + 1} down`}
                    disabled={index === items.length - 1}
                    onClick={() => onMove(index, 1)}
                    icon={ArrowDown}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  aria-label={`Remove ${rowNoun} ${index + 1}`}
                >
                  <Trash2 aria-hidden />
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={onAdd}
      >
        <Plus aria-hidden />
        {addLabel}
      </Button>

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-xs font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}

function IconButton({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      onClick={onClick}
      // The arrows carry no text, so the name has to come from somewhere.
      aria-label={label}
    >
      <Icon aria-hidden className="size-4" />
    </Button>
  );
}

/** Add/remove/move over a list held in component state. */
function useRowList<T>(initial: T[], blank: T) {
  const [items, setItems] = React.useState(initial);

  return {
    items,
    add: () => setItems((current) => [...current, { ...blank }]),
    remove: (index: number) =>
      setItems((current) => current.filter((_, i) => i !== index)),
    move: (index: number, delta: number) =>
      setItems((current) => {
        const target = index + delta;
        if (target < 0 || target >= current.length) return current;

        const next = [...current];
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      }),
    update: (index: number, patch: Partial<T>) =>
      setItems((current) =>
        current.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      ),
  };
}

export function SpeakersField({
  value,
  leaders,
  error,
}: {
  value: SpeakerDraft[];
  /** The leadership roster, for the optional link to a profile. */
  leaders: { slug: string; name: string }[];
  error?: string;
}) {
  const list = useRowList(value, emptySpeaker);

  return (
    <>
      <input
        type="hidden"
        name="speakers"
        value={JSON.stringify(list.items)}
        readOnly
      />

      <RowList
        name="speakers"
        legend="Presenters"
        rowNoun="presenter"
        error={error}
        hint="Shown on the event page. A row left blank is dropped when you save."
        items={list.items}
        onAdd={list.add}
        onRemove={list.remove}
        onMove={list.move}
        addLabel="Add a presenter"
        emptyLabel="No presenters yet. The page simply omits the section."
      >
        {(speaker, index) => (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-600">
                Name
              </span>
              <Input
                value={speaker.name}
                onChange={(event) =>
                  list.update(index, { name: event.target.value })
                }
                placeholder="Arshad Gadit"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-600">
                Role
              </span>
              <Input
                value={speaker.role}
                onChange={(event) =>
                  list.update(index, { role: event.target.value })
                }
                placeholder="Managing Partner"
              />
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-semibold text-neutral-600">
                Link to a leadership profile
              </span>
              <span className="text-xs leading-relaxed text-neutral-500">
                Gives the presenter their photograph and a link to their page.
                Leave as “Not on the leadership team” for anyone else, they
                appear with their initials.
              </span>
              {/*
                A select rather than free text: the value is a slug that has to
                match the roster in the codebase exactly, and a typo would
                silently fall back to initials with nothing to explain why.
              */}
              <select
                value={speaker.leader}
                onChange={(event) =>
                  list.update(index, { leader: event.target.value })
                }
                className="h-10 rounded-lg bg-white px-3 text-sm text-brand-navy ring-1 ring-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <option value="">Not on the leadership team</option>
                {leaders.map((leader) => (
                  <option key={leader.slug} value={leader.slug}>
                    {leader.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </RowList>
    </>
  );
}

export function AgendaField({
  value,
  timezone,
  error,
}: {
  value: AgendaDraft[];
  /** Echoed in the hint, so it is clear which clock the times are on. */
  timezone: string;
  error?: string;
}) {
  const list = useRowList(value, emptyAgendaItem);

  return (
    <>
      <input
        type="hidden"
        name="agenda"
        value={JSON.stringify(list.items)}
        readOnly
      />

      <RowList
        name="agenda"
        legend="Running order"
        rowNoun="item"
        error={error}
        hint={
          timezone
            ? `Times are read as ${timezone}, the same clock as the event's timings.`
            : "Times are shown exactly as entered, on the same clock as the event's timings."
        }
        items={list.items}
        onAdd={list.add}
        onRemove={list.remove}
        onMove={list.move}
        addLabel="Add an item"
        emptyLabel="No running order yet. The page simply omits the section."
      >
        {(item, index) => (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-600">
                Time
              </span>
              {/*
                Free text, not <input type="time">. The page prints this exactly
                as entered and a time input would force a locale-formatted
                24-hour value, which is not always what an invitation says.
              */}
              <Input
                value={item.time}
                onChange={(event) =>
                  list.update(index, { time: event.target.value })
                }
                placeholder="12:10"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-600">
                What happens
              </span>
              <Input
                value={item.title}
                onChange={(event) =>
                  list.update(index, { title: event.target.value })
                }
                placeholder="Where the rules have moved since last year"
              />
            </label>
          </div>
        )}
      </RowList>
    </>
  );
}
