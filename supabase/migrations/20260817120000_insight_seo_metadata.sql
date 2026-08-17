-- Per-article SEO metadata.
--
-- The article page has been deriving its <title> from the headline and its
-- meta description from the excerpt. That is a reasonable default and a poor
-- ceiling: a headline is written to be read on the page, where it sits under a
-- category and a date and has the article beneath it, while a title tag is
-- read cold in a list of ten competing results and has about sixty characters
-- to earn the click. The two jobs pull in different directions often enough to
-- deserve their own fields.
--
-- Null in both means "carry on deriving it", so every article that predates
-- this migration keeps exactly the metadata it had.

alter table public.insights
  add column meta_title       text,
  add column meta_description text;

comment on column public.insights.meta_title is
  'Title tag, without the brand suffix. The site appends " | athGADLANG" or " | Wathiq" per region, so this must not carry one. Null falls back to the headline.';

comment on column public.insights.meta_description is
  'Meta description, aim for 150-160 characters. Null falls back to the excerpt.';
