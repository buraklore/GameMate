# GameMate

Oyuncuları aynı oyunda, uyumlu takım arkadaşlarıyla buluşturan eşleştirme platformu (React + Vite prototip).

## Çalıştırma

Gereksinim: Node.js 18+

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini aç.

## Derleme (production)

```bash
npm run build      # çıktı: dist/
npm run preview    # derlenmiş sürümü önizle
```

`dist/` klasörü herhangi bir statik sunucuya (Netlify, Vercel, Cloudflare Pages, nginx) yüklenebilir.

## Özellikler

- Türkçe arayüz; çok rollü, PC / PS5 platform desteği
- Önce platform (PC/PS5) seçimi; oyun/rol/etiket için tikli çoklu-seçim
- PC'ye özel oyunlar (LoL, CS2, Dota 2) PS5'te listelenmez
- Oyuncu bulma (filtreler), davet/eşleşme akışı, arkadaşlar, sohbet
- Profil duvarı, 0–5 puanlama, yorum şikayet sistemi
- Reklam alanları (demo + gerçek AdSense) ve üst menü banner'ı
- Admin paneli: kullanıcı/ban yönetimi, şikayet edilen yorumlar, reklam yönetimi,
  iletişim mesajları, **SEO yönetimi** (canlı title/meta + JSON-LD + Google önizleme),
  site görünümü ayarları (logo, açılış büyüklüğü, footer)
- Sayfalar: Nasıl Çalışır, Blog, Hakkında, Gizlilik, Kurallar, İletişim
- Tamamen mobil uyumlu

## Notlar

- Bu bir **istemci-taraflı (SPA) prototiptir**; durum bellekte tutulur, sayfa yenilenince
  sıfırlanır. Kalıcılık için bir backend (ör. ekteki `schema.sql` / `ARCHITECTURE.md`)
  gereklidir.
- SEO yönetimi `document.title` ve `<head>` meta etiketlerini canlı günceller. Tam SEO
  (sitemap.xml, robots.txt, sunucu-taraflı render) için Next.js gibi bir SSR çatısı önerilir.

## Yapı

```
gamemate-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx        # giriş noktası
    ├── GameMate.jsx    # tüm uygulama (tek dosya)
    └── index.css       # minimal reset
```

---

## Supabase (kalıcı veri) kurulumu

Uygulama, ortam değişkenleri **tanımlı değilse demo (bellek) modunda** çalışır — hiçbir şey kaydedilmez. Supabase bağladığında şunlar kalıcı olur: oyuncu havuzu, iletişim mesajları (admin paneline düşer), profil duvarı yorumları, puanlar, banlar ve site/SEO/reklam ayarları.

### Adımlar

1. **Proje aç:** [supabase.com](https://supabase.com) → yeni proje oluştur (otomatik bir PostgreSQL veritabanı verir).
2. **Tabloları kur:** Supabase panelinde **SQL Editor** → `supabase/schema.sql` dosyasının içeriğini yapıştır → **Run**. (Tablolar, RLS politikaları ve örnek oyuncular oluşturulur.)
3. **API anahtarlarını al:** **Project Settings → API** bölümünden `Project URL` ve `anon public` anahtarını kopyala.
4. **.env oluştur:** Proje kökünde `.env.example` dosyasını `.env` olarak kopyala ve doldur:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. **Çalıştır:** `npm run dev`. Konsolda `Supabase bağlı` yazısını görmelisin. Artık kayıtlar veritabanına yazılır.

### Vercel'e dağıtım

- GitHub'a yükle → Vercel'de **Import** et (Vite otomatik algılanır). Bu klasörü repo köküne koymadıysan **Root Directory**'yi `gamemate-app` yap.
- Vercel proje ayarlarında **Settings → Environment Variables** bölümüne `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` ekle → yeniden dağıt.

### Önemli notlar (canlı kullanım öncesi)

- **Gerçek kullanıcı girişi (Supabase Auth) henüz yok.** Kayıt formu profili veritabanına ekler ama "kendi hesabına tekrar giriş" akışı yoktur. Sonraki adım: Supabase Auth (e-posta/şifre veya Google) entegrasyonu.
- **RLS politikaları prototip için açıktır** (anon anahtar herkese okuma/yazma izni verir). Canlıya almadan önce `schema.sql` içindeki politikaları kısıtla (ör. yalnızca admin yazabilsin) ve Auth ekle.
- SEO tarafı istemci-taraflıdır; tam SEO (sitemap, SSR/meta önizleme) için Next.js gibi bir sunucu-taraflı çatı gerekir.
