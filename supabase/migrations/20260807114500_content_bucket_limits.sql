-- Size and type limits on the content bucket.
--
-- Cover images are now uploaded straight from the browser to Storage using a
-- signed upload URL, so the file never passes through a Vercel function. That
-- removes two hard ceilings that were silently breaking uploads — the 1 MB
-- Next.js server action body limit and the 4.5 MB Vercel request body limit —
-- but it also moves the upload out of reach of the checks in
-- `uploadImage`/`createUploadUrl`.
--
-- Which is why these limits belong here. A signed upload URL is a bearer
-- credential: once issued, whoever holds it can PUT whatever they like to that
-- path. The checks in the server action run *before* the URL exists, so they
-- shape what the panel offers, not what Storage accepts. Only the bucket itself
-- can refuse an oversized or non-image file, and it does so regardless of what
-- the client claimed when it asked for the URL.
--
-- So: the action's validation is the friendly error, and this is the actual
-- limit. Both are set to 4 MB deliberately — see maxImageBytes in
-- src/app/admin/actions.ts, which must stay in step with the number below.
--
-- 4 MB = 4 * 1024 * 1024 = 4194304 bytes.
--
-- SVG is excluded on purpose. It is an image to a designer and a script host to
-- a browser: an uploaded .svg can carry <script>, and the bucket is public, so
-- it would be served same-origin from the storage domain.

update storage.buckets
   set file_size_limit = 4194304,
       allowed_mime_types = array[
         'image/jpeg',
         'image/png',
         'image/webp',
         'image/avif'
       ]
 where id = 'content';
