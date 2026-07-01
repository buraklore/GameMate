-- ============================================================
--  GameMate — GÜVENLİK MİGRASYONU (RLS sertleştirme)
--  Supabase Dashboard → SQL Editor'a yapıştırıp "Run" deyin.
--  Bu dosya, prototip için açık bırakılan "herkes her şeyi yazabilir"
--  politikalarını kaldırır ve güvenli, rol tabanlı politikalar kurar.
--  Idempotent: birden çok kez çalıştırılabilir.
-- ============================================================

-- ---------- 0) RLS'nin açık olduğundan emin ol ----------
alter table public.profiles         enable row level security;
alter table public.contact_messages enable row level security;
alter table public.wall_comments    enable row level security;
alter table public.ratings          enable row level security;
alter table public.bans             enable row level security;
alter table public.site_settings    enable row level security;

-- ---------- 1) Eski GÜVENSİZ politikaları kaldır ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','contact_messages','wall_comments','ratings','bans','site_settings']
  loop
    execute format('drop policy if exists "anon_all_%1$s" on public.%1$I;', t);
  end loop;
end$$;

-- ---------- 2) Admin kontrolü (RLS içinde kullanılır) ----------
-- security definer: profiles üzerindeki RLS'yi güvenle atlayarak
-- yalnızca "çağıran kullanıcı admin mi?" sorusunu boolean döndürür.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and admin = true
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
--  3) PROFİLLER
--     - Herkes profilleri görebilir (keşfedilebilirlik — tasarım gereği)
--     - Kullanıcı yalnızca KENDİ profilini oluşturur/günceller/siler
--     - admin / id / user_id / rating kolonları API'den DEĞİŞTİRİLEMEZ
--       (yetki yükseltme ve kimlik sahtekârlığı engellenir)
-- ============================================================
drop policy if exists "profiles_select"        on public.profiles;
drop policy if exists "profiles_insert_own"    on public.profiles;
drop policy if exists "profiles_update_own"    on public.profiles;
drop policy if exists "profiles_update_admin"  on public.profiles;
drop policy if exists "profiles_delete_own"    on public.profiles;

create policy "profiles_select" on public.profiles
  for select to anon, authenticated using (true);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (user_id = auth.uid() and admin = false);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Admin moderasyon için başka profilleri de güncelleyebilir
create policy "profiles_update_admin" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "profiles_delete_own" on public.profiles
  for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Kolon düzeyi yetki: admin, id, user_id, rating, created_at
-- API üzerinden GÜNCELLENEMEZ. (admin verme yalnızca Dashboard/service_role ile)
revoke update on public.profiles from anon;
revoke update on public.profiles from authenticated;
grant  update (name, country, age, online, devices, bio, avatar, tags, socials, times, games)
  on public.profiles to authenticated;

-- ============================================================
--  4) İLETİŞİM MESAJLARI (PII — e-posta/mesaj)
--     - Yalnızca ADMIN okuyabilir/güncelleyebilir/silebilir
--     - Herkes form gönderebilir (uzunluk sınırlarıyla)
-- ============================================================
drop policy if exists "contact_select_admin" on public.contact_messages;
drop policy if exists "contact_insert"       on public.contact_messages;
drop policy if exists "contact_update_admin" on public.contact_messages;
drop policy if exists "contact_delete_admin" on public.contact_messages;

create policy "contact_select_admin" on public.contact_messages
  for select to authenticated using (public.is_admin());

create policy "contact_insert" on public.contact_messages
  for insert to anon, authenticated
  with check (
    char_length(name)    between 1 and 100 and
    char_length(email)   between 3 and 200 and
    char_length(coalesce(subject,'')) <= 200 and
    char_length(message) between 1 and 5000
  );

create policy "contact_update_admin" on public.contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "contact_delete_admin" on public.contact_messages
  for delete to authenticated using (public.is_admin());

-- ============================================================
--  5) DUVAR YORUMLARI
--     - Herkes okuyabilir
--     - Yalnızca GİRİŞ YAPMIŞ kullanıcı yorum ekleyebilir (sınırlı)
--     - Silme/güncelleme yalnızca ADMIN
-- ============================================================
drop policy if exists "wall_select"        on public.wall_comments;
drop policy if exists "wall_insert"        on public.wall_comments;
drop policy if exists "wall_update_admin"  on public.wall_comments;
drop policy if exists "wall_delete_admin"  on public.wall_comments;

create policy "wall_select" on public.wall_comments
  for select to anon, authenticated using (true);

create policy "wall_insert" on public.wall_comments
  for insert to authenticated
  with check (
    char_length(author) between 1 and 60 and
    char_length(text)   between 1 and 1000 and
    stars between 0 and 5
  );

create policy "wall_update_admin" on public.wall_comments
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "wall_delete_admin" on public.wall_comments
  for delete to authenticated using (public.is_admin());

-- ============================================================
--  6) PUANLAR
--     - Herkes okuyabilir
--     - Yalnızca giriş yapmış kullanıcı puan yazabilir (0–5)
--     - Silme yalnızca ADMIN
-- ============================================================
drop policy if exists "ratings_select"       on public.ratings;
drop policy if exists "ratings_insert"       on public.ratings;
drop policy if exists "ratings_update"       on public.ratings;
drop policy if exists "ratings_delete_admin" on public.ratings;

create policy "ratings_select" on public.ratings
  for select to anon, authenticated using (true);

create policy "ratings_insert" on public.ratings
  for insert to authenticated with check (stars between 0 and 5);

create policy "ratings_update" on public.ratings
  for update to authenticated using (true) with check (stars between 0 and 5);

create policy "ratings_delete_admin" on public.ratings
  for delete to authenticated using (public.is_admin());

-- ============================================================
--  7) BANLAR
--     - Herkes okuyabilir (banlı oyuncuları gizlemek için)
--     - Ban ekleme/silme/güncelleme yalnızca ADMIN
-- ============================================================
drop policy if exists "bans_select"        on public.bans;
drop policy if exists "bans_insert_admin"  on public.bans;
drop policy if exists "bans_update_admin"  on public.bans;
drop policy if exists "bans_delete_admin"  on public.bans;

create policy "bans_select" on public.bans
  for select to anon, authenticated using (true);

create policy "bans_insert_admin" on public.bans
  for insert to authenticated with check (public.is_admin());

create policy "bans_update_admin" on public.bans
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "bans_delete_admin" on public.bans
  for delete to authenticated using (public.is_admin());

-- ============================================================
--  8) SİTE AYARLARI (SEO / reklam / genel yapılandırma)
--     - Herkes okuyabilir (uygulama açılışta okur)
--     - Yalnızca ADMIN yazabilir  (reklam/SEO enjeksiyonu engellenir)
-- ============================================================
drop policy if exists "settings_select"       on public.site_settings;
drop policy if exists "settings_insert_admin" on public.site_settings;
drop policy if exists "settings_update_admin" on public.site_settings;

create policy "settings_select" on public.site_settings
  for select to anon, authenticated using (true);

create policy "settings_insert_admin" on public.site_settings
  for insert to authenticated with check (public.is_admin());

create policy "settings_update_admin" on public.site_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
--  9) Uzunluk kısıtlamaları (depolama suistimali / DoS'a karşı)
--     Idempotent — zaten varsa atlar.
-- ============================================================
do $$
begin
  begin alter table public.profiles add constraint profiles_bio_len   check (char_length(bio)  <= 500); exception when duplicate_object then null; end;
  begin alter table public.profiles add constraint profiles_name_len  check (char_length(name) between 1 and 60); exception when duplicate_object then null; end;
  begin alter table public.wall_comments   add constraint wall_text_len   check (char_length(text)    <= 1000); exception when duplicate_object then null; end;
  begin alter table public.wall_comments   add constraint wall_author_len check (char_length(author)  <= 60);   exception when duplicate_object then null; end;
  begin alter table public.contact_messages add constraint cm_msg_len     check (char_length(message) <= 5000); exception when duplicate_object then null; end;
  begin alter table public.contact_messages add constraint cm_name_len    check (char_length(name)    <= 100);  exception when duplicate_object then null; end;
  begin alter table public.contact_messages add constraint cm_email_len   check (char_length(email)   <= 200);  exception when duplicate_object then null; end;
end$$;

-- ============================================================
--  ADMIN BOOTSTRAP (kendi hesabını admin yapmak için)
--  Kayıt olduktan sonra e-postanla aşağıyı bir kez çalıştır:
--
--    update public.profiles set admin = true
--    where user_id = (select id from auth.users where email = 'senin@mailin.com');
--
--  (Artık uygulama üzerinden kimse admin olamaz — sadece burada.)
-- ============================================================
