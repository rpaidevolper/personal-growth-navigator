-- 個人成長導航系統：使用者分享（投稿）收件表
-- 用法：Supabase 後台 → SQL Editor → New query → 貼上整份 → Run。可重複執行。
--
-- 安全設計：網頁用的是公開的 anon key，所以權限全靠這裡把關。
--   * 訪客（anon）只能「新增」，不能讀取、修改、刪除任何一筆（連自己送的也讀不到）。
--   * 新增時強制為「待審核」，必須勾選聲明與授權，並限制大小與頻率。
--   * 擁有者在 Supabase 後台（Table Editor）審核，把 status 改成 approved / rejected。

create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  kind          text not null default 'path' check (kind in ('path')),
  share_id      text not null check (char_length(share_id) between 8 and 64),
  role          text check (char_length(role) <= 100),
  track         text check (char_length(track) <= 40),
  stage         text check (char_length(stage) <= 40),
  target        text check (char_length(target) <= 100),
  industry      text check (char_length(industry) <= 40),
  years         text check (char_length(years) <= 20),
  contact_email text check (contact_email is null or char_length(contact_email) <= 200),
  payload       jsonb not null check (octet_length(payload::text) <= 200000),
  consent       boolean not null,
  declaration   boolean not null,
  app_version   text check (char_length(app_version) <= 40),
  reviewer_note text,
  reviewed_at   timestamptz
);

comment on table public.submissions is '個人成長導航系統的使用者分享；contact_email 不公開，只供審核聯繫';
create index if not exists submissions_status_idx on public.submissions (status, created_at desc);
create index if not exists submissions_share_idx on public.submissions (share_id, created_at desc);

alter table public.submissions enable row level security;

-- 訪客只有 INSERT 權限（return=minimal，不需要 SELECT）
revoke all on table public.submissions from anon, authenticated;
grant insert on table public.submissions to anon, authenticated;

drop policy if exists "anyone can submit pending" on public.submissions;
create policy "anyone can submit pending" on public.submissions
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and consent = true
    and declaration = true
    and reviewer_note is null
    and reviewed_at is null
  );

-- 頻率限制：同一個分享編號每小時最多 5 次；全站每小時最多 300 筆（擋灌水）
create or replace function public.submissions_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.submissions
      where share_id = new.share_id and created_at > now() - interval '1 hour') >= 5 then
    raise exception '分享太頻繁，請稍後再試' using errcode = 'P0001';
  end if;
  if (select count(*) from public.submissions
      where created_at > now() - interval '1 hour') >= 300 then
    raise exception '目前分享量過大，請稍後再試' using errcode = 'P0001';
  end if;
  -- 不信任前端傳來的時間與審核欄位
  new.created_at := now();
  new.status := 'pending';
  return new;
end;
$$;

drop trigger if exists submissions_rate_limit on public.submissions;
create trigger submissions_rate_limit
  before insert on public.submissions
  for each row execute function public.submissions_rate_limit();

-- 下一階段（共享資料庫）才需要：公開「已通過」的匿名版本，不含 email
-- create or replace view public.approved_paths as
--   select id, created_at, role, track, stage, target, industry, years,
--          payload - 'contributor' as payload
--   from public.submissions where status = 'approved';
-- grant select on public.approved_paths to anon;
