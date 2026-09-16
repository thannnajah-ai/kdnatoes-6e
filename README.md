<div align="center">

# XII-E / KDNATOES
### *Retro Windows 95 Desktop OS & Tekken 5 Arcade Digital Yearbook*

[![GitHub repo size](https://img.shields.io/github/repo-size/thannnajah-ai/kdnatoes-6e?style=for-the-badge&color=008080)](https://github.com/thannnajah-ai/kdnatoes-6e)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blueviolet?style=for-the-badge&logo=pwa)](manifest.json)
[![Tech Stack](https://img.shields.io/badge/Tech-Vanilla%20HTML%2FCSS%2FJS-orange?style=for-the-badge&logo=javascript)](script.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Aesthetic](https://img.shields.io/badge/Style-Windows%2095%20Bevel-000080?style=for-the-badge&logo=windows95)](style.css)

[**Live Demo**](https://kdnatoes-6e.vercel.app) • [**Fitur**](#yang-ada-di-sini) • [**Cara Menjalankan**](#cara-jalankan) • [**Dokumentasi**](docs/DESIGN.md)

---

</div>

Portal kelas XII-E bergaya desktop Windows 95 dan arkade Tekken 5. HTML, CSS, dan JavaScript saja. Tidak ada framework, tidak ada build tool.

## Yang ada di sini

**Desktop OS simulasi**
Jendela bisa digeser, di-resize, di-minimize ke taskbar, di-maximize. Ada start menu, taskbar dengan jam, dan cursor pixel kustom. Ikon digambar manual pakai SVG.

**MS Paint**
Kanvas dengan tool pencil, brush, eraser, paint bucket, spray, dan teks. Ada palet warna ala Win95 (plus pilihan ukuran brush), dan ekspor ke PNG.

**Personalia kelas ala Tekken 5**
Kartu siswa dengan flip depan/belakang (foto + nama di depan, biodata + quote di belakang). Roster bergaya arcade fighter dengan stat bar. Bisa dicari.

**Recycle Bin & arsip rahasia**
Galeri momen tersembunyi yang terkunci. Cara membukanya ada di `script.js` — cari kode rahasianya.

**Jadwal & tugas**
Jadwal pelajaran per hari dan to-do list. Tambah, centang, hapus. Tersimpan di localStorage, jadi nggak hilang saat refresh.

**Sound retro**
Semua suara (startup, klik, error, disk drive) disintesis langsung lewat Web Audio API. Nol file audio eksternal. Ada toggle mute dan volume.

**Ekstra**
Winamp 2.x player klasik, kalkulator, guestbook.

## Tech stack

| Layer | Teknologi |
| :--- | :--- |
| Markup | HTML5 semantic + ARIA |
| Styling | CSS3, custom properties, grid, animasi |
| Logic | Vanilla JS (ES6+), Canvas 2D, Web Audio API |
| Data | localStorage |
| Aset | Pixel art, script Python konversi foto |
| PWA | `manifest.json` (installable, tanpa service worker) |

## Struktur repo

```
kdnatoes-6e/
├── index.html          # Struktur halaman utama
├── style.css           # Design tokens, bevel, UI Tekken
├── script.js           # Window manager, paint, audio, tugas, personalia
├── manifest.json       # PWA manifest
├── assets/
│   ├── personalia/     # Foto anggota kelas
│   ├── archive/        # Arsip rahasia Recycle Bin
│   └── bliss_1080p.jpg # Wallpaper desktop
├── scripts/
│   └── convert_photos.py
└── docs/
    ├── PRD.md
    ├── DESIGN.md
    └── ARCHITECTURE.md
```

## Cara menjalankan

Langsung buka `index.html` di browser (Windows: dobel klik; Mac: `open index.html`; Linux: `xdg-open index.html`).

Untuk menjalankan lewat server lokal:

```bash
python -m http.server 8000
# atau
npx serve .
# atau
php -S localhost:8000
```

Lalu buka `http://localhost:8000`.

Deploy ke Vercel: `npx vercel`, atau hubungkan repo di dashboard Vercel. GitHub Pages: Settings > Pages > pilih branch `main`, folder `/ (root)`.

## Design tokens (Win95)

```css
:root {
  --win-desktop: #008080;          /* teal khas desktop Win95 */
  --win-gray: #c0c0c0;             /* abu-abu jendela */
  --win-title-active-start: #000080;
  --win-title-active-end: #1084d0;
  --win-bevel-light: #ffffff;      /* highlight 3D */
  --win-bevel-shadow: #808080;     /* shadow 3D */
  --font-pixel: 'Pixelify Sans', 'VT323', monospace;
}
```

Selengkapnya di `style.css` dan `docs/DESIGN.md`.

## Lisensi

MIT.

## Kredit

- Kelas XII-E / KDNATOES — konsep, konten, foto
- Font: Pixelify Sans & VT323 (Google Fonts, SIL OFL)
- Inspirasi visual: Windows 95/98 dan Tekken 5