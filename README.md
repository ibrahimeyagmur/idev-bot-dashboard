# IDev - Discord Bot Dashboard

Discord bot yönetim paneli. React frontend + Express backend + Discord.js bot entegrasyonu.

## Özellikler

- **Karşılama & Veda Mesajları** - Özelleştirilebilir embed mesajlar
- **Seviye Sistemi** - XP tabanlı seviye, rol ödülleri
- **Gömülü Mesajlar** - Görsel embed oluşturucu
- **Otomatik Moderasyon** - Reklam ve küfür engelleme
- **Otomatik Cevap** - Anahtar kelime bazlı otomatik yanıt

## Teknoloji

- **Frontend**: React 19 + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript + Discord.js
- **Veritabanı**: croxydb (JSON tabanlı)
- **Auth**: Discord OAuth2

## Proje Yapısı

```
/
├── src/                    # Frontend (React)
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── ...
├── backend/                # Backend + Bot
│   ├── src/
│   │   ├── bot/           # Discord bot
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── services/
│   └── croxydb/           # Veritabanı
└── package.json
```

## Gereksinimler

- Node.js 18+
- npm veya yarn

## Kurulum

### 1. Discord Developer Portal

1. [Discord Developer Portal](https://discord.com/developers/applications) adresine gidin
2. Yeni uygulama oluşturun
3. **Bot** sekmesinden bot oluşturun ve token alın
4. **OAuth2** sekmesinden:
   - Redirect URI ekleyin: `http://localhost:3001/auth/discord/callback`
   - Client ID ve Client Secret kopyalayın
5. Bot için gerekli izinler:
   - `Manage Guild`
   - `Send Messages`
   - `Manage Messages`
   - `Embed Links`
   - `Manage Roles`

### 2. Ortam Değişkenleri

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3001
VITE_DISCORD_CLIENT_ID=your_discord_client_id
```

**Backend** (`backend/.env`):
```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_REDIRECT_URI=http://localhost:3001/auth/discord/callback
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your_super_secret_session_key_min_32_chars
PORT=3001
NODE_ENV=development
```

### 3. Bağımlılıkları Yükle

```bash
npm run install:all
```

### 4. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

## Production

### Build

```bash
npm run build
npm run build:backend
```

### Başlat

```bash
cd backend && npm start
```

### Deploy Notları

- HTTPS zorunlu (cookie secure)
- Reverse proxy (nginx) önerilir
- `NODE_ENV=production` ayarla
- `SESSION_SECRET` güçlü olmalı (32+ karakter)

## Troubleshooting

**Login olmuyor**
- CORS ayarlarını kontrol et
- Cookie `secure: false` dev ortamında
- Redirect URI doğru olmalı

**Bot çalışmıyor**
- `DISCORD_BOT_TOKEN` doğru mu?
- Bot sunucuya ekli mi?
- Gerekli izinler var mı?

**429 Rate Limit**
- Sayfa geçişlerinde cache kullanılıyor
- Çok fazla istek atılıyorsa bekleyin

## Lisans

MIT
