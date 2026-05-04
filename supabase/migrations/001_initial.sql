-- Anchor Life Planner — Initial Schema
-- Run this in your Supabase SQL editor or via supabase db push

-- ── Tasks ────────────────────────────────────────────────────────
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  text        text not null,
  priority    int not null default 2 check (priority in (1, 2, 3)),
  done        boolean not null default false,
  project     text not null default 'Inbox',
  due_date    date,
  time        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Schedule blocks ──────────────────────────────────────────────
create table if not exists schedule_blocks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  title       text not null,
  start_ts    timestamptz not null,
  end_ts      timestamptz not null,
  kind        text not null default 'personal' check (kind in ('ritual','focus','meeting','personal','wellness')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Habits ───────────────────────────────────────────────────────
create table if not exists habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  name        text not null,
  icon        text not null default 'circle',
  created_at  timestamptz not null default now()
);

create table if not exists habit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  habit_id    uuid not null references habits on delete cascade,
  date        date not null,
  done        boolean not null default false,
  unique (user_id, habit_id, date)
);

-- ── Wellness ─────────────────────────────────────────────────────
create table if not exists wellness_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  date         date not null,
  sleep_hours  numeric(4,2),
  water_cups   int,
  steps        int,
  mood         int check (mood between 1 and 10),
  mood_note    text,
  created_at   timestamptz not null default now(),
  unique (user_id, date)
);

-- ── Notes ────────────────────────────────────────────────────────
create table if not exists notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  title       text not null,
  body        text not null default '',
  tag         text not null default 'other',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Projects ─────────────────────────────────────────────────────
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  name        text not null,
  due_date    date,
  progress    int not null default 0 check (progress between 0 and 100),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── People ───────────────────────────────────────────────────────
create table if not exists people (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  name             text not null,
  relation         text not null default 'friend',
  last_contact_at  timestamptz,
  created_at       timestamptz not null default now()
);

-- ── Home / Chores ─────────────────────────────────────────────────
create table if not exists chores (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  name         text not null,
  frequency    text not null default 'Weekly',
  last_done_at timestamptz,
  created_at   timestamptz not null default now()
);

-- ── Books ────────────────────────────────────────────────────────
create table if not exists books (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  title       text not null,
  author      text not null default '',
  progress    int not null default 0 check (progress between 0 and 100),
  status      text not null default 'queued' check (status in ('reading','queued','done')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Meals ────────────────────────────────────────────────────────
create table if not exists meals (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  day_of_week  text not null,
  slot         text not null check (slot in ('breakfast','lunch','dinner')),
  name         text not null,
  unique (user_id, day_of_week, slot)
);

-- ── Finance ──────────────────────────────────────────────────────
create table if not exists finance_categories (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users on delete cascade,
  name           text not null,
  monthly_budget numeric(10,2) not null default 0
);

create table if not exists finance_transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  category_id  uuid references finance_categories on delete set null,
  amount       numeric(10,2) not null,
  occurred_on  date not null,
  note         text
);

-- ── Business metrics ──────────────────────────────────────────────
create table if not exists business_metrics (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users on delete cascade,
  month                text not null,
  mrr                  numeric(10,2) not null default 0,
  clients              int not null default 0,
  invoices_outstanding int not null default 0,
  created_at           timestamptz not null default now(),
  unique (user_id, month)
);

-- ── Row-Level Security ────────────────────────────────────────────
-- Enable RLS on all tables, then add policies so each user
-- can only see/modify their own rows.

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'tasks','schedule_blocks','habits','habit_logs','wellness_logs',
    'notes','projects','people','chores','books','meals',
    'finance_categories','finance_transactions','business_metrics'
  ] loop
    execute format('alter table %I enable row level security', tbl);
    execute format('
      create policy "User owns their rows" on %I
        for all using (auth.uid() = user_id)
        with check (auth.uid() = user_id)
    ', tbl, tbl);
  end loop;
end;
$$;

-- ── Updated_at trigger ────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_tasks
  before update on tasks
  for each row execute function set_updated_at();

create trigger set_updated_at_notes
  before update on notes
  for each row execute function set_updated_at();

create trigger set_updated_at_projects
  before update on projects
  for each row execute function set_updated_at();

create trigger set_updated_at_books
  before update on books
  for each row execute function set_updated_at();
