/**
 * What we need to know about a YouTube link.
 *
 * Pure string work, deliberately: the admin panel reads it in the browser to
 * preview a pasted link, the server action reads it to validate one, and the
 * public site reads it to point a card at the video's own still. One set of
 * rules, so all three agree on what a given link means.
 */

/** Video ids are always 11 characters of base64url. */
const idPattern = /^[\w-]{11}$/;

/** True for `host` itself and for any subdomain of it — not for `nothost`. */
function isHost(hostname: string, host: string) {
  return hostname === host || hostname.endsWith(`.${host}`);
}

/**
 * The video id in `value`, or "" if there is not one.
 *
 * Accepts anything YouTube shows in an address bar — watch links, youtu.be
 * shorteners, /embed, /live and /shorts — as well as a bare id, because editors
 * paste the URL from the browser far more often than the id.
 *
 * Both halves are checked, the host and the id format: an id-shaped path
 * segment on someone else's domain is not a YouTube video, and neither is a
 * mistyped link. Either way this is where it fails, rather than later as a
 * thumbnail that will not load or a card that opens nothing.
 */
export function parseYoutubeId(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (idPattern.test(trimmed)) return trimmed;

  const url = URL.parse(trimmed);
  if (!url) return "";

  const segments = url.pathname.split("/").filter(Boolean);
  let candidate: string | undefined;

  if (isHost(url.hostname, "youtu.be")) {
    candidate = segments[0];
  } else if (
    isHost(url.hostname, "youtube.com") ||
    isHost(url.hostname, "youtube-nocookie.com")
  ) {
    // /watch?v=<id>, or the last segment of /embed/<id>, /live/<id>,
    // /shorts/<id>.
    candidate =
      url.searchParams.get("v") ??
      (segments.length > 1 ? segments[segments.length - 1] : undefined);
  }

  return candidate && idPattern.test(candidate) ? candidate : "";
}

/**
 * The stills YouTube keeps for every video, at the two sizes worth using.
 *
 * `max` is 1280x720 but only exists for videos uploaded at that resolution or
 * better — YouTube answers 404 for the rest. `hq` is 480x360 and always exists:
 * a 16:9 frame letterboxed into 4:3, so cropping it to 16:9 removes exactly the
 * black bands and nothing else.
 */
const stillFile = { max: "maxresdefault", hq: "hqdefault" } as const;

/**
 * Address of a video's still. `i.ytimg.com` rather than `img.youtube.com`:
 * same bytes, and it is the hostname allowlisted in next.config.ts.
 */
export function youtubeThumbnail(id: string, size: keyof typeof stillFile = "hq") {
  return `https://i.ytimg.com/vi/${id}/${stillFile[size]}.jpg`;
}

/** Where a video plays. */
export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}
