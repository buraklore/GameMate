import { createRoot } from 'react-dom/client'
import * as db from './lib/db'
import { supaEnabled } from './lib/supabase'
import App from './GameMate.jsx'
import './index.css'

// Veri katmanını global olarak enjekte et. GameMate.jsx bunu window üzerinden
// okur; böylece bileşen dosyası harici import içermez ve her ortamda çalışır.
if (typeof window !== 'undefined') {
  window.__GM_DB = db
  window.__GM_SUPA = supaEnabled
}

createRoot(document.getElementById('root')).render(<App />)
