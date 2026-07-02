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
    avatar: r.avatar || '',
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
  const base = {
    name: p.name, country: p.country || '🇹🇷', age: p.age, online: true, admin: !!p.admin,
    devices: p.devices || [], bio: p.bio || '', tags: p.tags || [], socials: p.socials || {},
    rating: 0, times: p.times || [], games: p.games || [], user_id: p.user_id || null,
  }
  try {
    const { data, error } = await supabase.from('profiles').insert({ ...base, avatar: p.avatar || '🎮' }).select().single()
    if (error) throw error
    return rowToPlayer(data)
  } catch (e) {
    // avatar kolonu henüz eklenmediyse (migration çalışmadıysa) avatarsız tekrar dene
    if (String(e.message || '').toLowerCase().includes('avatar')) {
      try {
        const { data, error } = await supabase.from('profiles').insert(base).select().single()
        if (error) throw error
        return rowToPlayer(data)
      } catch (e2) { console.warn('[db] addProfile retry', e2.message); return null }
    }
    console.warn('[db] addProfile', e.message); return null
  }
}

export async function updateProfile(userId, patch) {
  if (!supaEnabled || !userId) return null
  try {
    const allowed = {}
    ;['name','country','age','online','devices','bio','tags','socials','times','games','avatar'].forEach(k => { if (patch[k] !== undefined) allowed[k] = patch[k] })
    const { data, error } = await supabase.from('profiles').update(allowed).eq('user_id', userId).select().single()
    if (error) throw error
    return rowToPlayer(data)
  } catch (e) { console.warn('[db] updateProfile', e.message); return null }
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
export async function getRatings(myUid) {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('ratings').select('profile_id,rater_user,stars')
    if (error) throw error
    const sum = {}, cnt = {}, mine = {}
    ;(data || []).forEach(x => {
      sum[x.profile_id] = (sum[x.profile_id] || 0) + x.stars
      cnt[x.profile_id] = (cnt[x.profile_id] || 0) + 1
      if (myUid && x.rater_user === myUid) mine[x.profile_id] = x.stars
    })
    const avg = {}
    Object.keys(sum).forEach(pid => { avg[pid] = Math.round((sum[pid] / cnt[pid]) * 10) / 10 })
    return { avg, cnt, mine }
  } catch (e) { console.warn('[db] getRatings', e.message); return null }
}
export async function setRating(profileId, stars, raterUser) {
  if (!supaEnabled) return
  try {
    const row = raterUser ? { profile_id: profileId, rater_user: raterUser, stars } : { profile_id: profileId, stars }
    await supabase.from('ratings').upsert(row, { onConflict: 'profile_id,rater_user' })
  } catch (e) { console.warn('[db] setRating', e.message) }
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

/* ---------- Kimlik doğrulama (Supabase Auth) ---------- */
export async function signUp(email, password, meta) {
  if (!supaEnabled) return { error: 'no-supabase' }
  try {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: meta || {} } })
    if (error) return { error: error.message }
    return { user: data.user, session: data.session }
  } catch (e) { return { error: e.message } }
}
export async function signIn(email, password) {
  if (!supaEnabled) return { error: 'no-supabase' }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { user: data.user, session: data.session }
  } catch (e) { return { error: e.message } }
}
export async function signOut() {
  if (!supaEnabled) return
  try { await supabase.auth.signOut() } catch (e) { console.warn('[db] signOut', e.message) }
}
export async function getSession() {
  if (!supaEnabled) return null
  try { const { data } = await supabase.auth.getSession(); return data ? data.session : null }
  catch (e) { console.warn('[db] getSession', e.message); return null }
}
export async function getMyProfile(userId) {
  if (!supaEnabled || !userId) return null
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle()
    if (error) throw error
    return data ? rowToPlayer(data) : null
  } catch (e) { console.warn('[db] getMyProfile', e.message); return null }
}

// ---- Davetler (invites) — kalıcı ----
export async function getInvites(myProfileId) {
  if (!supaEnabled || !myProfileId) return null
  try {
    const { data, error } = await supabase.from('invites').select('from_profile,to_profile,game,status')
    if (error) throw error
    const rows = data || []
    const incoming = rows.filter(r => r.to_profile === myProfileId && r.status === 'pending').map(r => r.from_profile)
    const outgoing = rows.filter(r => r.from_profile === myProfileId && r.status === 'pending').map(r => r.to_profile)
    const friends = [...new Set(rows.filter(r => r.status === 'accepted').map(r => r.from_profile === myProfileId ? r.to_profile : r.from_profile))]
    return { incoming, outgoing, friends }
  } catch (e) { console.warn('[db] getInvites', e.message); return null }
}
export async function addInvite(fromUser, fromProfile, toProfile, game) {
  if (!supaEnabled) return false
  try {
    const { error } = await supabase.from('invites').upsert(
      { from_user: fromUser, from_profile: fromProfile, to_profile: toProfile, game: game || null, status: 'pending' },
      { onConflict: 'from_user,to_profile', ignoreDuplicates: true }
    )
    if (error) throw error
    return true
  } catch (e) { console.warn('[db] addInvite', e.message); return false }
}
export async function cancelInvite(toProfile) {
  if (!supaEnabled) return false
  try {
    const { error } = await supabase.from('invites').delete().eq('to_profile', toProfile)
    if (error) throw error
    return true
  } catch (e) { console.warn('[db] cancelInvite', e.message); return false }
}
export async function respondInvite(fromProfile, status) {
  if (!supaEnabled) return false
  try {
    const { error } = await supabase.from('invites').update({ status }).eq('from_profile', fromProfile)
    if (error) throw error
    return true
  } catch (e) { console.warn('[db] respondInvite', e.message); return false }
}

// ---- Mesajlar (chat) — kalıcı ----
function fmtMsgTime(iso) {
  try {
    const d = new Date(iso), now = new Date()
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const y = new Date(now); y.setDate(now.getDate() - 1)
    if (d.toDateString() === y.toDateString()) return 'Dün'
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
  } catch (e) { return '' }
}
export async function getMessages(myProfileId) {
  if (!supaEnabled || !myProfileId) return null
  try {
    const { data, error } = await supabase.from('messages')
      .select('sender_profile,recipient_profile,text,created_at')
      .order('created_at', { ascending: true })
    if (error) throw error
    const convos = {}
    ;(data || []).forEach(m => {
      const other = m.sender_profile === myProfileId ? m.recipient_profile : m.sender_profile
      if (!convos[other]) convos[other] = []
      convos[other].push({ me: m.sender_profile === myProfileId, t: m.text, time: fmtMsgTime(m.created_at) })
    })
    return convos
  } catch (e) { console.warn('[db] getMessages', e.message); return null }
}
export async function sendMessage(senderProfile, recipientProfile, text) {
  if (!supaEnabled) return false
  try {
    const { error } = await supabase.from('messages')
      .insert({ sender_profile: senderProfile, recipient_profile: recipientProfile, text })
    if (error) throw error
    return true
  } catch (e) { console.warn('[db] sendMessage', e.message); return false }
}

// ---- Takım Duvarı (wall_posts) ----
export async function getWallPosts() {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('wall_posts')
      .select('id,author_profile,author_name,text,game,created_at')
      .order('created_at', { ascending: false }).limit(100)
    if (error) throw error
    return (data || []).map(p => ({ id: p.id, authorId: p.author_profile, author: p.author_name, text: p.text, game: p.game, time: fmtMsgTime(p.created_at) }))
  } catch (e) { console.warn('[db] getWallPosts', e.message); return null }
}
export async function addWallPost(authorProfile, authorName, text, game) {
  if (!supaEnabled) return null
  try {
    const { data, error } = await supabase.from('wall_posts')
      .insert({ author_profile: authorProfile, author_name: authorName, text, game: game || null })
      .select('id,author_profile,author_name,text,game,created_at').single()
    if (error) throw error
    return { id: data.id, authorId: data.author_profile, author: data.author_name, text: data.text, game: data.game, time: fmtMsgTime(data.created_at) }
  } catch (e) { console.warn('[db] addWallPost', e.message); return null }
}
export async function deleteWallPost(id) {
  if (!supaEnabled) return false
  try { const { error } = await supabase.from('wall_posts').delete().eq('id', id); if (error) throw error; return true }
  catch (e) { console.warn('[db] deleteWallPost', e.message); return false }
}
