"use client";

import * as React from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import {
  Bold,
  Columns3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Rows3,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  Underline,
  Undo2,
} from "lucide-react";

import {
  IMAGE_ACCEPT,
  uploadImage,
  type UploadFolder,
} from "@/lib/admin/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  emptyRichDoc,
  richTextExtensions,
  type RichDoc,
} from "@/lib/rich-text";
import { cn } from "@/lib/utils";

/**
 * The article editor.
 *
 * Writes into a hidden input as ProseMirror JSON, so the surrounding form
 * submits through a plain Server Action with no client-side fetch of its own.
 * The schema comes from `richTextExtensions`, shared with the renderer — what
 * the editor can produce is exactly what the article page can display.
 *
 * The styling below mirrors <RichBody> so the editing surface reads as the
 * finished article rather than as a form field.
 */
export function RichTextEditor({
  name = "body",
  value,
  error,
  folder = "insights",
  label = "Article",
  hint = "The first paragraph becomes the standfirst.",
  required = true,
}: {
  name?: string;
  value?: RichDoc | null;
  error?: string;
  /** What this body is, in the words of the thing being edited. */
  label?: string;
  /** Note beside the label. Pass an empty string for none. */
  hint?: string;
  /**
   * Whether the form insists on it before publishing. An article without a
   * body is not an article; an event without one is an event whose details
   * have not been written yet, which is a normal thing to publish.
   */
  required?: boolean;
  /**
   * Where images inserted into the body are filed. Defaults to insights, which
   * is where most long-form writing happens — but an event body has to say so,
   * or its artwork ends up under insights/ and the folder prefix stops meaning
   * anything.
   */
  folder?: UploadFolder;
}) {
  // Mirrors the document into form state. Kept as a string because that is
  // what the hidden input carries and what the action parses.
  const [json, setJson] = React.useState(() =>
    JSON.stringify(value ?? emptyRichDoc),
  );

  const editor = useEditor({
    extensions: richTextExtensions,
    content: value ?? emptyRichDoc,
    // Required under SSR: rendering on the first pass would produce markup the
    // server never sent, and React would throw a hydration mismatch.
    immediatelyRender: false,
    onUpdate: ({ editor }) => setJson(JSON.stringify(editor.getJSON())),
    editorProps: {
      attributes: {
        class: cn(
          "min-h-80 px-4 py-4 outline-none",
          "flex flex-col gap-4",
          "[&_p]:text-base [&_p]:leading-relaxed [&_p]:text-neutral-700",
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-brand-navy",
          "[&_h3]:text-base [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:text-brand-navy",
          "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5",
          "[&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-1.5 [&_ol]:pl-5",
          "[&_li]:text-base [&_li]:leading-relaxed [&_li]:text-neutral-700",
          "[&_li>p]:m-0",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic",
          "[&_strong]:font-bold [&_strong]:text-brand-navy",
          "[&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4",
          "[&_img]:max-w-full [&_img]:rounded-lg",
          // Tables get visible bounds while editing: an unruled grid is very
          // hard to work in, even though the article styles them more lightly.
          "[&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse",
          "[&_td]:border [&_td]:border-neutral-300 [&_td]:px-2 [&_td]:py-1 [&_td]:align-top",
          "[&_th]:border [&_th]:border-neutral-300 [&_th]:bg-neutral-100 [&_th]:px-2 [&_th]:py-1",
          "[&_th]:text-left [&_th]:font-bold [&_th]:text-brand-navy",
          "[&_.selectedCell]:bg-brand/5",
        ),
      },
    },
  });

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-brand-navy">
          {label}
          {required && (
            <span aria-hidden className="ml-1.5 text-brand">
              *
            </span>
          )}
        </label>
        {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-xl bg-white ring-1 ring-neutral-200",
          "focus-within:ring-2 focus-within:ring-brand",
          error && "ring-destructive/50",
        )}
      >
        <Toolbar editor={editor} folder={folder} />
        <EditorContent editor={editor} />
      </div>

      <input type="hidden" name={name} value={json} readOnly />

      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

type Editor = NonNullable<ReturnType<typeof useEditor>>;

function Toolbar({
  editor,
  folder,
}: {
  editor: Editor | null;
  folder: UploadFolder;
}) {
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [href, setHref] = React.useState("");

  // v3 does not re-render on every transaction. Selecting exactly the flags
  // the toolbar draws keeps it in step without re-rendering on every keypress.
  const state = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
            strike: editor.isActive("strike"),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            bulletList: editor.isActive("bulletList"),
            orderedList: editor.isActive("orderedList"),
            blockquote: editor.isActive("blockquote"),
            link: editor.isActive("link"),
            inTable: editor.isActive("table"),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
          }
        : null,
  });

  if (!editor || !state) {
    // Matches the toolbar's height, so the editor does not jump when Tiptap
    // finishes mounting on the client.
    return <div className="h-11 border-b border-neutral-200 bg-neutral-50" />;
  }

  function applyLink() {
    if (!editor) return;
    const trimmed = href.trim();

    if (trimmed) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: trimmed })
        .run();
    }

    setLinkOpen(false);
    setHref("");
  }

  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="flex flex-wrap items-center gap-0.5 px-1.5 py-1.5">
        <Tool
          label="Bold"
          icon={Bold}
          active={state.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <Tool
          label="Italic"
          icon={Italic}
          active={state.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <Tool
          label="Underline"
          icon={Underline}
          active={state.underline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <Tool
          label="Strikethrough"
          icon={Strikethrough}
          active={state.strike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <Divider />

        {/* Only h2 and h3: h1 is the article title, drawn by the page. */}
        <Tool
          label="Heading"
          text="H2"
          active={state.h2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />
        <Tool
          label="Subheading"
          text="H3"
          active={state.h3}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        />

        <Divider />

        <Tool
          label="Bulleted list"
          icon={List}
          active={state.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <Tool
          label="Numbered list"
          icon={ListOrdered}
          active={state.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <Tool
          label="Quote"
          icon={Quote}
          active={state.blockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />

        <Divider />

        <Tool
          label="Add link"
          icon={Link2}
          active={state.link || linkOpen}
          onClick={() => {
            setHref(editor.getAttributes("link").href ?? "");
            setLinkOpen((open) => !open);
          }}
        />
        {state.link && (
          <Tool
            label="Remove link"
            icon={Link2Off}
            onClick={() => editor.chain().focus().unsetLink().run()}
          />
        )}

        <Divider />

        <Tool
          label="Insert table"
          icon={TableIcon}
          active={state.inTable}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        />
        {/* Row and column controls only mean anything inside a table. */}
        {state.inTable && (
          <>
            <Tool
              label="Add row below"
              icon={Rows3}
              onClick={() => editor.chain().focus().addRowAfter().run()}
            />
            <Tool
              label="Add column after"
              icon={Columns3}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            />
            <Tool
              label="Delete row"
              text="\u2212R"
              onClick={() => editor.chain().focus().deleteRow().run()}
            />
            <Tool
              label="Delete column"
              text="\u2212C"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            />
            <Tool
              label="Delete table"
              icon={Trash2}
              onClick={() => editor.chain().focus().deleteTable().run()}
            />
          </>
        )}

        <ImageTool editor={editor} folder={folder} />

        <div className="ml-auto flex items-center gap-0.5">
          <Tool
            label="Undo"
            icon={Undo2}
            disabled={!state.canUndo}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <Tool
            label="Redo"
            icon={Redo2}
            disabled={!state.canRedo}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </div>
      </div>

      {linkOpen && (
        <div className="flex items-center gap-2 border-t border-neutral-200 px-1.5 py-1.5">
          <Input
            value={href}
            autoFocus
            placeholder="https://example.com"
            onChange={(event) => setHref(event.target.value)}
            onKeyDown={(event) => {
              // Enter must not reach the surrounding form and submit it.
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }
              if (event.key === "Escape") setLinkOpen(false);
            }}
            className="h-7"
          />
          <Button type="button" size="sm" onClick={applyLink}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Puts a picture in the middle of an article.
 *
 * Uploads through the same action and into the same bucket as a cover image, so
 * there is one place artwork lives and one set of rules about what may be
 * uploaded. The document only ever carries the resulting URL — `allowBase64` is
 * off, because a base64 image would be stored inside the article row and sent
 * with every request for it.
 */
function ImageTool({
  editor,
  folder,
}: {
  editor: Editor;
  folder: UploadFolder;
}) {
  const [uploading, setUploading] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);

    // Same two-hop upload as the cover-image field, and for the same reason: an
    // in-body image is every bit as likely to be over 1 MB as a cover.
    const result = await uploadImage(file, folder);

    if (result.url) {
      editor.chain().focus().setImage({ src: result.url, alt: "" }).run();
    } else if (result.error) {
      window.alert(result.error);
    }

    setUploading(false);
    // Let the same file be chosen again after a failure.
    if (input.current) input.current.value = "";
  }

  return (
    <>
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
      <Tool
        label={uploading ? "Uploading image…" : "Insert image"}
        icon={uploading ? Loader2 : ImagePlus}
        disabled={uploading}
        onClick={() => input.current?.click()}
      />
    </>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-neutral-200" />;
}

function Tool({
  label,
  icon: Icon,
  text,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  text?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-sm font-bold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        active
          ? "bg-brand/10 text-brand"
          : "text-neutral-600 hover:bg-neutral-200 hover:text-brand-navy",
      )}
    >
      {Icon ? <Icon className="size-4" /> : text}
    </button>
  );
}
