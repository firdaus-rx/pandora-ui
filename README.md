# 🎵 Pandora UI

Frontend Vue 3 untuk [Pandora DL](https://github.com/firdaus-rx/pandora-dl) — AI Media Downloader.

```
🎨 Tema putih + aksen merah-ungu gradien
📱 Responsive mobile & desktop
🧠 Chat dengan session history & polling realtime
🎬 Preview audio/video inline
🔔 Konfirmasi modal untuk aksi destruktif
🇮🇩 Bahasa Indonesia penuh
```

---

## 🚀 Deploy dengan Docker Compose

### Prasyarat

- Docker + Docker Compose
- [Pandora DL API](https://github.com/firdaus-rx/pandora-dl) sudah berjalan

### 1. Setup Network

Buat network agar UI bisa komunikasi dengan API:

```bash
docker network create pandora-network
```

### 2. Jalankan

```bash
git clone https://github.com/firdaus-rx/pandora-ui.git
cd pandora-ui

# Build & jalankan
docker compose up -d --build
```

### 3. Akses

| Service | URL |
|---------|-----|
| Pandora UI | `http://localhost:8093` |
| Pandora API | `http://localhost:8092/api` |

### 4. Konfigurasi API URL

Edit `.env` atau set environment variable:

```bash
# Jika API di host berbeda
VITE_API_URL=http://192.168.1.100:8092

# Jika API di container lain (default)
VITE_API_URL=http://pandora-dl:3000
```

---

## ⚡ Development (Vite Dev Server)

```bash
bun install
bun run dev
# → http://localhost:5173 (proxy /api → localhost:3000)
```

Pastikan Pandora API berjalan di `localhost:3000`.

---

## 🏗️ Build

```bash
bun run build
# → dist/ siap di-deploy ke Nginx / static server
```

---

## 📁 Struktur

```
src/
├── api/          # HTTP client ke backend
├── components/   # Sidebar, TopBar, ConfirmModal
├── composables/  # useConfirm, useResponsive
├── router/       # Vue Router
├── stores/       # Pinia (auth, library)
└── views/        # Login, Dashboard, Library, Chat, Player, Settings
```

---

## 🔗 Related

- [Pandora DL](https://github.com/firdaus-rx/pandora-dl) — Backend API
