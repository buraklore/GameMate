import { createClient } from '@supabase/supabase-js'

// Vite ortam değişkenleri (.env dosyasından okunur)
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Env değişkenleri tanımlı değilse uygulama demo (bellek) modunda çalışır.
export const supaEnabled = Boolean(url && key)
export const supabase = supaEnabled ? createClient(url, key) : null

if (supaEnabled) {
  console.info('[GameMate] Supabase bağlı:', url)
} else {
  console.info('[GameMate] Supabase env değişkenleri yok — demo (bellek) modunda çalışılıyor.')
}
