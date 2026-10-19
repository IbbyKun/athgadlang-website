"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ImageUp, Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  emptyAgendaItem,
  emptySpeaker,
  type AgendaDraft,
  type SpeakerDraft,
} from "@/lib/admin/form";
import { IMAGE_ACCEPT, IMAGE_HINT, uploadImage } from "@/lib/admin/upload";

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
  locked = false,
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
  /**
   * Holds every row in place. Rows are keyed by index, so work still running
   * against a row (an upload) would land on whichever row moved into its slot.
   */
  locked?: boolean;
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
                    disabled={locked || index === 0}
                    onClick={() => onMove(index, -1)}
                    icon={ArrowUp}
                  />
                  <IconButton
                    label={`Move ${rowNoun} ${index + 1} down`}
                    disabled={locked || index === items.length - 1}
                    onClick={() => onMove(index, 1)}
                    icon={ArrowDown}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={locked}
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

/**
 * Optional photograph for a presenter who is not on the leadership team.
 *
 * Uploads on selection, like <ImageField>, and reports a failure beside the
 * control rather than losing the form. The URL itself lives in the row's draft.
 */
function SpeakerPhoto({
  url,
  onChange,
  onUploading,
}: {
  url: string;
  onChange: (url: string) => void;
  /** Told when an upload starts and ends, so the list can hold its rows still. */
  onUploading: (uploading: boolean) => void;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [failure, setFailure] = React.useState<string>();
  const input = React.useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    onUploading(true);
    setFailure(undefined);

    const result = await uploadImage(file, "events");

    if (result.error) setFailure(result.error);
    else if (result.url) onChange(result.url);

    setUploading(false);
    onUploading(false);
    // Let the same file be chosen again after a failure.
    if (input.current) input.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5 sm:col-span-2">
      <span className="text-xs font-semibold text-neutral-600">
        Photo (optional)
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {url && (
          // A plain <img>: an admin preview of a URL that has just been
          // created, as in <ImageField>.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="size-14 rounded-lg bg-neutral-100 object-cover"
          />
        )}

        <input
          ref={input}
          type="file"
          accept={IMAGE_ACCEPT}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => input.current?.click()}
        >
          {uploading ? (
            <Loader2 aria-hidden className="animate-spin" />
          ) : (
            <ImageUp aria-hidden />
          )}
          {uploading ? "Uploading…" : url ? "Replace" : "Upload photo"}
        </Button>

        {url && !uploading && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
          >
            <Trash2 aria-hidden />
            Remove
          </Button>
        )}

        <span className="text-xs text-neutral-500">{IMAGE_HINT}</span>
      </div>

      {failure && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {failure}
        </p>
      )}
    </div>
  );
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
  // A count, not a flag: two rows can be uploading at once.
  const [uploads, setUploads] = React.useState(0);

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
        locked={uploads > 0}
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
                  // Linking a leader drops any uploaded photo: the roster
                  // portrait is used instead, and the server discards it too.
                  list.update(
                    index,
                    event.target.value
                      ? { leader: event.target.value, photo: "" }
                      : { leader: "" },
                  )
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

            {!speaker.leader && (
              <SpeakerPhoto
                url={speaker.photo}
                onChange={(photo) => list.update(index, { photo })}
                onUploading={(uploading) =>
                  setUploads((count) => count + (uploading ? 1 : -1))
                }
              />
            )}
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
