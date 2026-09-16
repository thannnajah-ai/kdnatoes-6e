# DESIGN SYSTEM & UI/UX SPECIFICATION
**Proyek:** ClassXII - Website Kelas XII-E / KDNATOES  
**Tema:** Retro Desktop OS (Windows 95/98 / Pixel PC Aesthetic)  
**Versi:** 2.0.0  
**Status:** Approved & Implemented in Base UI  

---

## 1. Design Principles & Visual Philosophy

1. **90s Cyber Nostalgia & Desktop OS Metaphor**  
   Website dirancang sebagai antarmuka sistem operasi desktop klasik Windows 95/98. Pengguna disajikan pengalaman bernostalgia dengan kanvas desktop berlatar hijau toska (*Windows Teal*), ikon pintasan pixel art, jendela program dengan title bar biru tua, serta taskbar klasik di bagian bawah layar.
2. **Authentic 3D Bevel Architecture (Chiaroscuro 3D)**  
   Ciri khas visual utama adalah ilusi kedalaman 3D mekanis berbasis cahaya datang dari sudut kiri-atas. Setiap komponen antarmuka memiliki status timbul (*outset / raised*) untuk elemen yang dapat ditekan atau jendela utama, dan status tenggelam (*inset / sunken*) untuk area input teks, kanvas gambar, dan status bar.
3. **Pixel-Art Precision & High-Density UI**  
   Semua ornamen grafis, ikon, kursor, dan tombol kontrol menggunakan estetika pixel art dengan garis tepi tegas tanpa anti-aliasing berlebihan (*crisp pixel rendering*).
4. **Snappy & Mechanical Micro-Interactions**  
   Menghindari transisi lambat atau animasi melayang modern. Tombol bereaksi secara taktil dan instan: saat ditekan (*active state*), border bevel langsung terbalik (*inverted*) dan konten teks bergeser 1 piksel ke kanan-bawah (`translate(1px, 1px)`), memberikan sensasi tombol fisik komputer 90-an.

---

## 2. Design Tokens (Foundational Specs)

### 2.1 Color System

#### Color Palette
| Token Name | Hex Value | RGB / HSL | Penggunaan / Konteks |
| :--- | :--- | :--- | :--- |
| `--win-desktop` | `#008080` | `rgb(0, 128, 128)` | Warna latar kanvas desktop Windows 95 |
| `--win-gray` | `#c0c0c0` | `rgb(192, 192, 192)` | Warna dasar chrome jendela, panel, dan taskbar |
| `--win-gray-light` | `#dfdfdf` | `rgb(223, 223, 223)` | Permukaan terang kontrol tombol dan dialog |
| `--win-titlebar-active` | `#000080` | `rgb(0, 0, 128)` | Warna dasar title bar jendela yang aktif |
| `--win-titlebar-gradient`| `#1084d0` | `rgb(16, 132, 208)` | Gradien sisi kanan title bar aktif |
| `--win-titlebar-inactive`| `#808080` | `rgb(128, 128, 128)` | Title bar jendela yang sedang tidak aktif |
| `--win-bevel-light` | `#ffffff` | `rgb(255, 255, 255)` | Garis cahaya atas-kiri border timbul (highlight) |
| `--win-bevel-shadow` | `#808080` | `rgb(128, 128, 128)` | Garis bayangan medium bawah-kanan border |
| `--win-bevel-dark` | `#000000` | `rgb(0, 0, 0)` | Garis terluar bayangan bawah-kanan (shadow pekat) |
| `--win-text-dark` | `#000000` | `rgb(0, 0, 0)` | Teks isi jendela, label, dan menu bar |
| `--win-text-light` | `#ffffff` | `rgb(255, 255, 255)` | Teks putih tebal pada title bar dan button highlight |
| `--win-text-muted` | `#808080` | `rgb(128, 128, 128)` | Teks keterangan non-aktif atau placeholder |

#### Semantic & Retro Accent Colors
| Token Name | Hex Value | Konteks Penggunaan |
| :--- | :--- | :--- |
| `--win-accent-bsod` | `#0000aa` | Layar biru Blue Screen of Death (BSOD) |
| `--win-error` | `#cc0000` | Ikon error `(X)` merah dialog "IT'S NOT FAIR" |
| `--win-warning` | `#ffc000` | Segitiga peringatan kuning |
| `--win-folder-yellow` | `#f4d03f` | Ikon folder direktori |
| `--win-selection` | `#000080` | Latar item yang terpilih / menu hover |

#### MS Paint Classic 28-Color Palette
Terdiri atas dua baris swatches warna:
- **Baris 1:** `#000000`, `#808080`, `#800000`, `#808000`, `#008000`, `#008080`, `#000080`, `#800080`, `#808040`, `#004040`, `#0080ff`, `#004080`, `#8000ff`, `#804000`
- **Baris 2:** `#ffffff`, `#c0c0c0`, `#ff0000`, `#ffff00`, `#00ff00`, `#00ffff`, `#0000ff`, `#ff00ff`, `#ffff80`, `#00ff80`, `#80ffff`, `#8080ff`, `#ff0080`, `#ff8040`

---

### 2.2 3D Bevel Standard Specifications

Aturan border ganda untuk menghasilkan tampilan otentik Windows 95:

#### 1. Raised / Outset (Timbul - Untuk Jendela, Tombol, dan Taskbar)
```css
/* Outset Double Bevel */
border-top: 1px solid #ffffff;
border-left: 1px solid #ffffff;
border-right: 1px solid #000000;
border-bottom: 1px solid #000000;
box-shadow: inset 1px 1px 0px #dfdfdf,
            inset -1px -1px 0px #808080;
```

#### 2. Sunken / Inset (Tenggelam - Untuk Kanvas Paint, Input, Status Bar, Tombol Aktif)
```css
/* Inset Double Bevel */
border-top: 1px solid #808080;
border-left: 1px solid #808080;
border-right: 1px solid #ffffff;
border-bottom: 1px solid #ffffff;
box-shadow: inset 1px 1px 0px #000000,
            inset -1px -1px 0px #dfdfdf;
```

#### 3. Button Pressed State (`:active`)
```css
border-top: 1px solid #000000;
border-left: 1px solid #000000;
border-right: 1px solid #ffffff;
border-bottom: 1px solid #ffffff;
box-shadow: inset 1px 1px 0px #808080;
padding-top: calc(var(--padding-y) + 1px);
padding-left: calc(var(--padding-x) + 1px);
```

---

### 2.3 Typography Scale

- **Pixel & Display Font:** `'Pixelify Sans'`, `'VT323'`, `'Silkscreen'`, monospace
- **Desktop System UI Font:** `'MS Sans Serif'`, `Tahoma`, `'Segoe UI'`, `Arial`, sans-serif
- **Monospace / Terminal (BSOD):** `'Fixedsys'`, `'Courier New'`, monospace

| Role | Font Family | Size (px) | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Title Bar Text** | MS Sans Serif, Tahoma | 12px - 13px | 700 (Bold) | 1.2 | 0.5px |
| **Menu Bar Item** | Tahoma, Arial | 12px | 400 (Reg) | 1.0 | 0px |
| **Window Headline** | Pixelify Sans, sans-serif | 18px - 22px | 700 (Bold) | 1.3 | 0px |
| **Body Base** | Tahoma, Segoe UI, sans-serif | 13px | 400 (Reg) | 1.4 | 0px |
| **Button Text** | Tahoma, sans-serif | 12px | 500 (Medium) | 1.0 | 0px |
| **Status Bar / Tooltip** | MS Sans Serif, Tahoma | 11px | 400 (Reg) | 1.2 | 0px |
| **BSOD Terminal** | Fixedsys, Courier New | 14px | 700 (Bold) | 1.5 | 0px |

---

## 3. Component Specifications & Anatomy

### 3.1 Window Chrome (`.win-window`)
Setiap jendela program terdiri atas 4 bagian standar:
1. **Title Bar (`.win-titlebar`):**
   - Latar: Gradien `#000080` ke `#1084d0` (aktif) atau `#808080` (tidak aktif).
   - Elemen Kiri: Ikon program 16x16 dan teks judul window (putih tebal).
   - Elemen Kanan: Tiga tombol kontrol mini (`_` minimize, `□` maximize, `X` close) berbentuk bujur sangkar 16x14px ber-border timbul.
2. **Menu Bar (`.win-menubar`):**
   - Daftar item menu: `File`, `Edit`, `View`, `Image`, `Options`, `Help`.
   - Huruf akses pintas diberi garis bawah (`<u>F</u>ile`).
   - Hover state: Latar berubah menjadi biru dongker `#000080` dengan teks putih.
3. **Window Body / Canvas (`.win-body`):**
   - Area isi konten dengan latar abu-abu `#c0c0c0` atau putih `#ffffff` ber-border sunken.
4. **Status Bar (`.win-statusbar`):**
   - Bilah informasi di bagian bawah jendela dengan panel sunken berjejer.

---

### 3.2 Hero Component: "untitled - Paint" (MS Paint Window)
Menghadirkan replika fungsional MS Paint klasik Windows 95 sesuai gambar referensi:
- **Tool Palette (Sisi Kiri):**
  - Grid 2 kolom x 8 baris (total 16 alat): Free-form Select, Rectangular Select, Eraser, Fill Bucket, Pick Color, Magnifier, Pencil, Brush, Airbrush, Text (A), Line, Curve, Rectangle, Polygon, Ellipse, Rounded Rectangle.
  - Opsi sub-tool di bagian bawah (pilihan ketebalan kuas / bentuk kuas).
- **Drawing Canvas:**
  - Area kanvas HTML5 interaktif dengan border sunken.
  - Mendukung goresan kuas/pensil langsung dengan mouse dan touch.
  - Tombol aksi: "Clear Canvas" dan "Save Art".
- **Color Palette (Bagian Bawah):**
  - Kotak indikator warna aktif (Warna utama & warna sekunder tumpang-tindih).
  - 28 kotak warna klasik Windows 95 yang dapat diklik untuk mengganti kuas.
- **Status Bar:**
  - Menampilkan bantuan: *"For Help, click Help Topics on the Help Menu."* dan koordinat posisi kursor mouse secara dinamis (*"420, 180px"*).

---

### 3.3 Dialog Popups & Easter Eggs
1. **Dialog "IT'S NOT FAIR":**
   - Dialog peringatan kecil dengan title bar "IT'S NOT FAIR", ikon tanda silang merah `(X)`, teks "It's not fair", dan tombol beveled `[ Kenalkan ]` atau `[ Tutup ]`.
2. **Dialog "VIRUS!1! - GhostInTheMachine.exe":**
   - Title bar bertuliskan `VIRUS!1! - GhostInTheMachine.exe`.
   - Gambar dithered pixel art mata misterius di tengah.
   - Kotak peringatan teks: *"WARNING: You can shut down the system, but tbh we will be here waiting for you when you get back..."*
   - Tiga tombol aksi: `[ Plead for Mercy ]`, `[ Pay Now! ]`, `[ Cry :( ]`.
3. **Dialog "Window ?????":**
   - Title bar "Window", pesan "?????" dengan satu tombol `[ OK ]`.
4. **Blue Screen of Death (BSOD):**
   - Layar penuh berwarna biru pekat `#0000aa` dengan teks putih monospace saat pengguna memilih opsi "Shut Down..." pada Start Menu.

---

### 3.4 Taskbar & Start Menu
1. **Windows Taskbar (`.win-taskbar`):**
   - Tersemat fixed di bagian paling bawah layar setinggi 30px.
   - Border atas timbul putih terang (`1px solid #ffffff`).
   - Sisi Kiri: Tombol **Start** dengan logo 4-warna Windows 95 (merah, hijau, biru, kuning) dan teks tebal "Start".
   - Area Tengah: Daftar tab jendela yang sedang dibuka; jendela yang aktif tampil tenggelam/ditekan (*sunken*).
   - Sisi Kanan: **System Tray** ber-border sunken dengan ikon speaker volume dan jam digital live yang bergulir real-time.
2. **Start Menu Popup (`.win-start-menu`):**
   - Menu bertingkat yang muncul ke atas saat tombol Start diklik.
   - Sisi kiri vertikal terdapat banner bergradien biru bertuliskan **"Windows 95 / XII-E"**.
   - Daftar pilihan: Programs, Jadwal Pelajaran, Papan Tugas, Struktur Kelas, Galeri Kenangan, Pengaturan Suara, dan opsi Shut Down...

---

### 3.5 Desktop Shortcuts & Pixel Cursors
1. **Desktop Icons:**
   - Grid ikon vertikal di sisi kiri desktop:
     - 🖥️ **My Computer:** Profil & Visi Kelas XII-E.
     - 📁 **Jadwal Pelajaran:** Roster mingguan Senin - Jumat.
     - 📝 **Papan Tugas:** Pengumuman tugas dan ujian.
     - 🌳 **Struktur Kelas:** Pengurus kelas dan Wali Kelas.
     - 💿 **Galeri Kenangan:** Album foto kebersamaan.
     - 🎨 **MS Paint XII-E:** Jendela kreatif kanvas kelas.
     - 🗑️ **Recycle Bin:** Tempat sampah digital nostalgia.
2. **Pixel Cursors:**
   - **Default Pointer:** Panah putih pixel dengan outline hitam 1px dan bayangan pixel.
   - **Pointer Link / Button:** Tangan penunjuk (*pixel hand pointer*) putih dengan outline hitam persis seperti di gambar referensi.

---

## 4. Responsive Layout & Mobile Behavior

1. **Desktop View (> 1024px):**
   - Pengalaman OS penuh dengan jendela-jendela yang dapat di-drag, di-minimize ke taskbar, atau di-maximize full window.
2. **Tablet & Mobile View (<= 1024px):**
   - Jendela menyesuaikan lebar layar (*stacking layout*) dengan padding yang nyaman.
   - Taskbar tetap berada di bawah layar untuk navigasi cepat antar modul kelas.
   - Tombol kontrol jendela tetap mudah diakses dengan touch target yang ramah jari (*min 36x36px* pada mobile).

---

## 5. Accessibility & Audio-Visual Fidelity

1. **Rasio Kontras (WCAG Compliance):**
   - Teks hitam murni `#000000` di atas latar `#c0c0c0` memiliki kontras `10.5:1`.
   - Teks putih `#ffffff` di atas title bar `#000080` memiliki kontras `12.6:1`.
2. **Keyboard Navigation & ARIA:**
   - Setiap jendela memiliki atribut `role="dialog"` atau `role="region"` dengan `aria-labelledby` ke title bar masing-masing.
   - Semua tombol dan link memiliki fokus visual outline putus-putus (*dotted focus ring*) khas Windows 95.
3. **Retro Audio (Web Audio API):**
   - Menggunakan sintesis suara nada pendek (sinewave/square wave klik) saat tombol ditekan atau dialog peringatan muncul, tanpa membebani browser dengan file audio eksternal. Tersedia tombol mute di system tray.