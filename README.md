<div align="center">

# 🪟 XII - E / KDNATOES
### *Retro Windows 95 Desktop OS & Tekken 5 Arcade Digital Yearbook*

[![GitHub repo size](https://img.shields.io/github/repo-size/thannnajah-ai/kdnatoes-6e?style=for-the-badge&color=008080)](https://github.com/thannnajah-ai/kdnatoes-6e)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blueviolet?style=for-the-badge&logo=pwa)](manifest.json)
[![Tech Stack](https://img.shields.io/badge/Tech-Vanilla%20HTML%2FCSS%2FJS-orange?style=for-the-badge&logo=javascript)](script.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Aesthetic](https://img.shields.io/badge/Style-Windows%2095%20Bevel-000080?style=for-the-badge&logo=windows95)](style.css)

[**Live Demo**](https://kdnatoes-6e.vercel.app) • [**Fitur**](#-fitur-utama) • [**Cara Menjalankan**](#-cara-menjalankan) • [**Shortcut Keyboard**](#%EF%B8%8F-keyboard-shortcuts) • [**Dokumentasi**](docs/DESIGN.md)

---

</div>

## 📖 Tentang Proyek

**KDNATOES (Kelas XII-E)** adalah portal kelas yang dirancang dengan estetika retro **Windows 95/98** dikombinasikan dengan sentuhan arkade **Tekken 5**.

Dibangun secara murni menggunakan **Vanilla Web Technologies** (Zero Dependency / No Framework) dengan arsitektur UI *Authentic 3D Bevel Chiaroscuro*, simulasi sistem operasi desktop yang fully-interactive, kanvas MS Paint fungsional, dan sound engine retro berbasis Web Audio API.

---

## 🎮 Fitur Utama

### 1. 🪟 Desktop OS Windows 95 Simulation
- **Window Management**: Jendela dapat di-drag, resize, minimize ke taskbar, maximize, dan ditutup.
- **Start Menu Klasik**: Akses cepat ke program, jadwal, personalia, pengaturan suara, dan shutdown dialog.
- **Taskbar & Tray Clock**: Statusbar real-time dengan jam digital, indikator audio, dan daftar program aktif.
- **Custom Retro Cursors & Icons**: Ikon pixel art dengan render crisp dan bayangan bevel 3D.

### 2. 🎨 MS Paint Interaktif (Full Functionality)
- **Canvas Tools**: Pencil, Brush, Eraser, Paint Bucket (Flood Fill), Line, Rectangle, Ellipse, Spray/Airbrush, dan Text Tool.
- **28-Color Retro Palette**: Palet warna otentik Windows 95 dengan status warna primer & sekunder.
- **Fitur Lanjutan**: Multi-layer support, Undo/Redo history, Brush size selector, dan ekspor langsung ke format `.png`.

### 3. 🥊 Roster Personalia Kelas (Tekken 5 Mode)
- **Kartu Siswa 3D Flip**: Tampilan depan foto & nama, bagian belakang biodata & quote kenangan.
- **Tekken 5 Arcade Fighter UI**: Stat bar pertarungan, profil karakter, dan tampilan roster bernuansa arcade game 90-an.
- **Pencarian & Filter**: Filter siswa berdasarkan nama, minat, atau peran dalam kelas.

### 4. 🗑️ Recycle Bin & Arsip Rahasia (Easter Egg)
- Galeri foto dan momen-momen "aib"/kenangan tersembunyi yang terkunci.
- **Unlock via Konami Code**: Tekan `↑ ↑ ↓ ↓ ← → ← → B A` di keyboard untuk membuka arsip rahasia!

### 5. 📅 Jadwal Pelajaran & Manajemen Tugas
- **Kalender Mingguan**: Jadwal pelajaran interaktif per hari.
- **To-Do Task List**: Tambah, centang selesai, dan hapus tugas kelas dengan persistensi otomatis di `localStorage`.

### 6. 🔊 Web Audio API Retro Soundboard
- Sintesis audio retro tanpa aset audio eksternal berat (startup chimes, error beeps, click sounds, disk drive chatter).
- Toggle Mute / Volume slider di taskbar tray.

### 7. 📱 PWA & Offline Support
- Dukungan instalasi sebagai aplikasi mandiri di PC (Chrome/Edge) dan Android/iOS.
- Offline-ready via Service Worker caching.

---

## 🛠️ Stack Teknologi

| Layer | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Markup** | HTML5 Semantic | Struktur desktop OS, ARIA accessibility, window modals |
| **Styling** | CSS3 (Pure Vanilla) | 5,000+ baris CSS, 3D Bevel tokens, CSS Grid, custom properties |
| **Logic** | JavaScript (ES6+) | 8,500+ baris Vanilla JS, zero dependencies, Web Audio API, Canvas 2D |
| **Aset** | Pixel Art & Python | Script konversi otomatis `convert_photos.py` untuk pixel art styling |
| **PWA** | Web Manifest & Service Worker | Installable desktop/mobile app & offline cache |

> ⚡ **Zero Dependencies:** Tidak memerlukan `npm install`, `vite`, `webpack`, ataupun framework berat. Cukup browser modern!

---

## 📁 Struktur Repositori

```bash
kdnatoes-6e/
├── 📄 index.html          # Entry point aplikasi & struktur Windows 95
├── 🎨 style.css           # Design tokens, Windows 95 bevels & Tekken UI
├── ⚡ script.js           # Window manager, MS Paint canvas, audio, task logic
├── 📱 manifest.json       # Konfigurasi Progressive Web App (PWA)
├── 📂 assets/
│   ├── personalia/        # Foto & potret retro anggota kelas
│   ├── archive/           # Arsip foto rahasia Recycle Bin
│   └── bliss_1080p.jpg    # Wallpaper desktop legendaris
├── 📂 scripts/
│   └── convert_photos.py  # Utilitas konversi foto ke palet pixel art
└── 📂 docs/
    ├── PRD.md             # Product Requirements Document
    ├── DESIGN.md          # Spesifikasi lengkap Design Tokens & Bevels
    └── ARCHITECTURE.md    # Detail arsitektur modul sistem
```

---

## 🚀 Cara Menjalankan

### 1. Langsung via Browser (Offline / Static)
Buka file `index.html` langsung di browser favoritmu:
- **Windows**: Dobel klik `index.html` atau jalankan `start index.html` di PowerShell.
- **Mac**: `open index.html`
- **Linux**: `xdg-open index.html`

### 2. Menggunakan Local Web Server (Disarankan untuk PWA)
Jika ingin menguji fitur PWA dan Service Worker:

```bash
# Opsi A: Python 3
python -m http.server 8000

# Opsi B: Node.js (npx)
npx serve .

# Opsi C: PHP
php -S localhost:8000
```
Buka browser di: `http://localhost:8000`

### 3. Deploy ke Vercel / GitHub Pages

#### Deploy ke Vercel
```bash
npx vercel
```
Atau hubungkan repo ini langsung di dashboard [Vercel](https://vercel.com) untuk *continuous deployment* otomatis setiap `git push`.

#### Deploy ke GitHub Pages
1. Masuk ke tab **Settings** di repositori GitHub kamu.
2. Buka menu **Pages** di sebelah kiri.
3. Pada bagian **Build and deployment > Source**, pilih branch `main` dan folder `/ (root)`.
4. Klik **Save**, dan website akan live dalam beberapa menit.

---

## ⌨️ Keyboard Shortcuts

| Tombol / Kombinasi | Aksi |
| :--- | :--- |
| `Win` / `Ctrl + Esc` | Buka / Tutup Start Menu |
| `Alt + Tab` | Visual Window Switcher |
| `F11` | Masuk / Keluar Fullscreen Mode |
| `↑ ↑ ↓ ↓ ← → ← → B A` | **Konami Code** (Membuka arsip rahasia Recycle Bin) |
| `Esc` | Menutup dialog aktif / pop-up menu |

---

## 🎨 Cuplikan Design Tokens (Windows 95 Classic)

```css
:root {
  --win-desktop: #008080;          /* Classic Teal Desktop */
  --win-gray: #c0c0c0;             /* Base Window Grey */
  --win-title-active-start: #000080;/* Navy Blue Titlebar */
  --win-title-active-end: #1084d0;  /* Gradient Accent */
  --win-bevel-light: #ffffff;      /* 3D Highlight Border */
  --win-bevel-shadow: #808080;     /* 3D Shadow Border */
  --font-pixel: 'Pixelify Sans', 'VT323', monospace;
}
```

---

## 👥 Kontributor & Kredit

- **Kelas XII - E / KDNATOES** — Konsep, konten, foto, dan kenangan.
- **Fonts**: [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) & [VT323](https://fonts.google.com/specimen/VT323) dari Google Fonts (SIL Open Font License).
- **Inspirasi Visual**: Microsoft Windows 95 / 98 & Namco Tekken 5 Arcade.

---

<div align="center">

Dibuat dengan ❤️ dan nostalgia untuk keluarga besar **XII - E (KDNATOES)**.

</div>