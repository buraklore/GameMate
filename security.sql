import { createClient } from '@supabase/supabase-js'

// --- Supabase bağlantı bilgileri ---
// 1) Öncelik Vercel/.env ortam değişkenlerindedir.
// 2) Ortam değişkeni yoksa aşağıdaki gömülü (fallback) değerler kullanılır.
//    (anon public anahtarı istemci tarafında olacak şekilde tasarlanmıştır,
//     RLS ile korunur — gömmek güvenlidir.)
const FALLBACK_URL = 'https://cadnnyqjbrbzfdvnjwtm.supabase.co'
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZG5ueXFqYnJiemZkdm5qd3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MzcxMzMsImV4cCI6MjA5ODQxMzEzM30.MjAQSqbsCW42wlduqLEiFN0hs3VoadHrOBhyzeOlN8A'

const url = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY

// Hem ortam değişkeni hem fallback boşsa uygulama demo (bellek) modunda çalışır.
export const supaEnabled = Boolean(url && key)
export const supabase = supaEnabled ? createClient(url, key) : null

if (import.meta.env.DEV) {
  console.info(supaEnabled ? '[GameMate] Supabase bağlı.' : '[GameMate] Demo (bellek) modu.')
}
