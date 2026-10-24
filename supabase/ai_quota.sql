-- 免費 AI 額度：每日使用次數（台北時間每天 0 點重算）
-- 用法：Supabase 後台 → SQL Editor → 貼上整份 → Run。可重複執行。
-- 只有 Edge Function（service_role）能呼叫；網頁的 anon key 讀不到、也改不了。

create table if not exists public.ai_usage (
  day     date not null,
  subject text not null,  -- client:<瀏覽器編號>、ip:<雜湊>、global
  n       int  not null default 0,
  primary key (day, subject)
);
comment on table public.ai_usage is '免費 AI 額度的每日計數；IP 只存加鹽雜湊';

alter table public.ai_usage enable row level security;
revoke all on table public.ai_usage from anon, authenticated;

-- 一次檢查多個額度（每人、每 IP、全站），全部未超過才一起加一
create or replace function public.ai_take(p_subjects text[], p_limits int[])
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  d date := (now() at time zone 'Asia/Taipei')::date;
  i int;
  cur int;
  used int;
begin
  for i in 1 .. array_length(p_subjects, 1) loop
    insert into ai_usage (day, subject, n) values (d, p_subjects[i], 0) on conflict do nothing;
    select n into cur from ai_usage where day = d and subject = p_subjects[i] for update;
    if cur >= p_limits[i] then
      return jsonb_build_object('ok', false, 'scope', split_part(p_subjects[i], ':', 1), 'limit', p_limits[i]);
    end if;
  end loop;
  update ai_usage set n = n + 1 where day = d and subject = any (p_subjects);
  select n into used from ai_usage where day = d and subject = p_subjects[1];
  return jsonb_build_object('ok', true, 'used', used);
end;
$$;

-- AI 服務失敗時把次數退回，不讓使用者白白被扣
create or replace function public.ai_refund(p_subjects text[])
returns void
language sql
security definer
set search_path = public
as $$
  update ai_usage set n = greatest(n - 1, 0)
  where day = (now() at time zone 'Asia/Taipei')::date and subject = any (p_subjects);
$$;

revoke execute on function public.ai_take(text[], int[]) from public, anon, authenticated;
revoke execute on function public.ai_refund(text[]) from public, anon, authenticated;
grant execute on function public.ai_take(text[], int[]) to service_role;
grant execute on function public.ai_refund(text[]) to service_role;
