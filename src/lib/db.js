import { supabase, supaEnabled } from './supabase'

/* Bir profil satırını uygulamanın beklediği oyuncu nesnesine çevirir */
function rowToPlayer(r) {
  return {
    id: r.id,
    name: r.name,
    country: r.country || '🌐',
    age: r.age,
    online: !!r.online,
    admin: !!r.admin,
    devices: r.devices || ['PC'],
    bio: r.bio || '',
    tags: r.tags || [],
    socials: r.socials || {},
    rating: typeof r.rating === 'number' ? r.rating : 0,
    times: r.times || [],
    games: r.games || [],
  }
}

/* ---------- Oyuncular / profiller ---------- */
export async function getPlayers() {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('profiles').select('*').order('id', { ascending: true })
    if (error) throw error
    return (data || []).map(rowToPlayer)
  } catch (e) { console.warn('[db] getPlayers', e.message); return null }
}

export async function addProfile(p) {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('profiles').insert({
      name: p.name, country: p.country || '🇹🇷', age: p.age, online: true, admin: !!p.admin,
      devices: p.devices || [], bio: p.bio || '', tags: p.tags || [], socials: p.socials || {},
      rating: 0, times: p.times || [], games: p.games || [],
    }).select().single()
    if (error) throw error
    return rowToPlayer(data)
  } catch (e) { console.warn('[db] addProfile', e.message); return null }
}

/* ---------- İletişim mesajları ---------- */
export async function getContactMessages() {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(m => ({
      id: m.id, name: m.name, email: m.email, subject: m.subject, message: m.message,
      read: !!m.read, date: new Date(m.created_at).toLocaleString('tr-TR'),
    }))
  } catch (e) { console.warn('[db] getContactMessages', e.message); return null }
}
export async function addContactMessage(m) {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('contact_messages')
      .insert({ name: m.name, email: m.email, subject: m.subject, message: m.message, read: false })
      .select().single()
    if (error) throw error
    return data
  } catch (e) { console.warn('[db] addContactMessage', e.message); return null }
}
export async function setMessageRead(id) {
  if (!supaEnabled) return
  try { await supabase.from('contact_messages').update({ read: true }).eq('id', id) }
  catch (e) { console.warn('[db] setMessageRead', e.message) }
}
export async function deleteMessage(id) {
  if (!supaEnabled) return
  try { await supabase.from('contact_messages').delete().eq('id', id) }
  catch (e) { console.warn('[db] deleteMessage', e.message) }
}

/* ---------- Profil duvarı yorumları ---------- */
export async function getComments() {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('wall_comments').select('*').order('created_at', { ascending: false })
    if (error) throw error
    const walls = {}
    ;(data || []).forEach(c => {
      ;(walls[c.profile_id] = walls[c.profile_id] || []).push({
        id: c.id, author: c.author, text: c.text, stars: c.stars,
        time: new Date(c.created_at).toLocaleDateString('tr-TR'), reported: false,
      })
    })
    return walls
  } catch (e) { console.warn('[db] getComments', e.message); return null }
}
export async function addComment(profileId, c) {
  if (!supaEnabled) return
  try { await supabase.from('wall_comments').insert({ profile_id: profileId, author: c.author, text: c.text, stars: c.stars }) }
  catch (e) { console.warn('[db] addComment', e.message) }
}
export async function deleteComment(id) {
  if (!supaEnabled) return
  try { await supabase.from('wall_comments').delete().eq('id', id) }
  catch (e) { console.warn('[db] deleteComment', e.message) }
}

/* ---------- Puanlar ---------- */
export async function getRatings() {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('ratings').select('*')
    if (error) throw error
    const r = {}
    ;(data || []).forEach(x => { r[x.profile_id] = x.stars })
    return r
  } catch (e) { console.warn('[db] getRatings', e.message); return null }
}
export async function setRating(profileId, stars) {
  if (!supaEnabled) return
  try { await supabase.from('ratings').upsert({ profile_id: profileId, stars }, { onConflict: 'profile_id' }) }
  catch (e) { console.warn('[db] setRating', e.message) }
}

/* ---------- Banlar ---------- */
export async function getBans() {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('bans').select('profile_id')
    if (error) throw error
    return (data || []).map(b => b.profile_id)
  } catch (e) { console.warn('[db] getBans', e.message); return null }
}
export async function setBan(profileId, banned) {
  if (!supaEnabled) return
  try {
    if (banned) await supabase.from('bans').upsert({ profile_id: profileId }, { onConflict: 'profile_id' })
    else await supabase.from('bans').delete().eq('profile_id', profileId)
  } catch (e) { console.warn('[db] setBan', e.message) }
}

/* ---------- Site ayarları (tek satır) ---------- */
export async function getSettings() {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
    if (error) throw error
    if (!data) return null
    return { siteCfg: data.site_cfg, seo: data.seo, ads: data.ads }
  } catch (e) { console.warn('[db] getSettings', e.message); return null }
}
export async function saveSettings(part) {
  if (!supaEnabled) return
  try {
    const row = { id: 1 }
    if (part.siteCfg) row.site_cfg = part.siteCfg
    if (part.seo) row.seo = part.seo
    if (part.ads) row.ads = part.ads
    await supabase.from('site_settings').upsert(row, { onConflict: 'id' })
  } catch (e) { console.warn('[db] saveSettings', e.message) }
}
