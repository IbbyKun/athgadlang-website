import { createUploadUrl } from "@/app/admin/actions";

/**
 * Uploading an image from the admin panel, in two hops.
 *
 * The server action authorises the upload and hands back a signed URL; the
 * browser then PUTs the file straight to Supabase Storage. The bytes never touch
 * a Vercel function, which is the entire point — routing them through a server
 * action capped the upload at 1 MB (the Next.js default for action request
 * bodies) and would have capped it at 4.5 MB even after raising that, because
 * that is Vercel's own request body limit.
 *
 * Lives here rather than in either component because both the cover-image field
 * and the rich-text editor's image tool upload the same way, and had drifted
 * into two copies of the same broken error handling.
 */

/**
 * 4 MB, matching `maxImageBytes` in src/app/admin/actions.ts and
 * `file_size_limit` on the content bucket. Three places, deliberately: this one
 * fails fast in the browser, the action refuses to issue a URL, and the bucket
 * is the limit that cannot be talked around.
 */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/** For the file input's `accept`, and mirrored by the bucket's allowed types. */
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

/** What the panel tells editors. Kept next to the limit it describes. */
export const IMAGE_HINT = "JPEG, PNG, WebP or AVIF, up to 4 MB";

const megabytes = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export type UploadResult = { url?: string; error?: string };

/**
 * Storage prefix, keeping each kind of artwork apart in the bucket. Mirrors
 * `uploadFolders` in src/app/admin/actions.ts, which is what enforces it — an
 * unrecognised folder there falls back to "insights" rather than erroring.
 */
export type UploadFolder = "insights" | "webinars" | "events" | "popups";

export async function uploadImage(
  file: File,
  folder: UploadFolder,
): Promise<UploadResult> {
  // Checked here as well as on the server so the common mistake — dragging in a
  // 12 MB photo straight off a phone — is answered instantly and specifically,
  // rather than after a round trip that ends in a generic refusal.
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      error: `That image is ${megabytes(file.size)}. The limit is 4 MB. Compress it and try again.`,
    };
  }

  let issued;
  try {
    issued = await createUploadUrl({
      folder,
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    });
  } catch {
    // Only reached if the action itself rejects. Two realistic causes, and
    // neither is worth guessing between in the message: the session really has
    // expired, or the tab is running a build older than the current deployment,
    // whose action IDs have since rotated. A reload fixes the second and
    // reveals the first.
    return {
      error:
        "Could not start the upload. Reload the page and try again. If it keeps happening, sign in again.",
    };
  }

  if (issued.error) return { error: issued.error };
  if (!issued.signedUrl || !issued.publicUrl) {
    return { error: "Could not start the upload. Try again." };
  }

  let response: Response;
  try {
    response = await fetch(issued.signedUrl, {
      method: "PUT",
      headers: {
        "content-type": file.type,
        // A cover image at a given URL never changes: the path carries a fresh
        // UUID per upload, so replacing the picture writes a new object rather
        // than mutating this one.
        "cache-control": "max-age=31536000",
      },
      body: file,
    });
  } catch {
    return { error: "Upload failed. Check your connection and try again." };
  }

  if (!response.ok) {
    // 413 is the bucket's own size limit, which is the one that counts. It
    // should be unreachable given the two checks above, so if an editor ever
    // sees this the three numbers have drifted apart.
    if (response.status === 413) {
      return { error: "That image is over 4 MB. Compress it and try again." };
    }
    // A signed upload URL is valid for two hours. Long enough that this only
    // happens to a form left open overnight, but it is a real state and the
    // remedy is different from a genuine failure.
    if (response.status === 400 || response.status === 403) {
      return {
        error: "The upload link expired. Choose the file again.",
      };
    }
    return { error: `Upload failed (${response.status}). Try again.` };
  }

  return { url: issued.publicUrl };
}
