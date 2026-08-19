-- An artwork of its own for a popup.
--
-- Until now the picture on a popup was always borrowed: the event's cover, or
-- the video's still. That is the right default and stays the default — it is
-- one less thing to prepare, and it cannot go out of date.
--
-- But a borrowed picture is composed for where it normally lives. An event
-- cover is a portrait-heavy poster built to be read at full width; a YouTube
-- still is a frame of a video. Neither was drawn for a 16:9 card with a
-- headline along the foot of it, and there is no way to fix that without
-- somewhere to put a picture that was.
--
-- Empty means "borrow one", which is what every existing row does.

alter table public.site_popups
  add column image_url text not null default '',
  add column image_alt text not null default '';
