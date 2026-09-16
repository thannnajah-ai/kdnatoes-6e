Bertindaklah sebagai Senior Product Manager dan Technical Architect. Buatkan file `PRD.md` (Product Requirements Document) yang mendalam, terstruktur, dan siap dipakai developer berdasarkan informasi berikut:

**Informasi Produk:**
- Nama Produk: [Nama Aplikasi/Sistem]
- Masalah yang Diselesaikan: [Jelaskan pain point pengguna]
- Solusi & Value Proposition: [Deskripsi solusi inti produk]
- Target Pengguna: [Profil target user / persona]
- Fitur Utama (MVP): [Daftar 3-5 fitur inti yang wajib ada]
- Tech Stack (opsional/jika ada preferensi): [Contoh: Flutter, Node.js/Express, PostgreSQL, Tailwind]
- Platform: [Mobile (iOS/Android) / Web / Desktop]

---

**Instruksi Output `PRD.md`:**
Tuliskan seluruh dokumen dalam format Markdown dengan struktur berikut:

1. **Executive Summary**
   - Latar belakang masalah, visi produk, dan ringkasan solusi.
   - Target rilis dan sasaran pasar.

2. **Goals & Success Metrics (KPIs)**
   - Sasaran bisnis & produk (misal: akuisisi, retensi, performa).
   - Metrik kuantitatif yang terukur (contoh: load time < 2s, 80% completion rate).

3. **User Personas & Core Journeys**
   - Detail minimal 2 persona pengguna.
   - User Journey Map ringkas dari onboarding hingga mencapai value utama produk.

4. **Product Scope (In-Scope vs Out-of-Scope)**
   - Fitur yang masuk dalam rilis MVP (Phase 1).
   - Fitur yang secara tegas ditunda/dikesampingkan ke Phase 2 (Nice-to-have).

5. **Functional Requirements & User Stories**
   - Breakdown per modul/fitur dalam format User Story: 
     *"Sebagai [role], saya ingin [tindakan], sehingga [manfaat]."*
   - Sertakan kriteria penerimaan (**Acceptance Criteria**) dengan format Given-When-Then untuk tiap fitur inti.

6. **Non-Functional Requirements (NFR)**
   - Performa & latensi.
   - Keamanan, autentikasi, & privasi data.
   - Skalabilitas dan kompatibilitas perangkat/browser.

7. **Technical Architecture & Data Model Draft**
   - Rekomendasi/konfirmasi tech stack (Frontend, Backend, Database, Cloud/Hosting).
   - Gambaran skema entitas data utama (Entity-Relationship ringkas).
   - Daftar endpoint API krusial (Method, Path, Deskripsi).

8. **UI/UX & Wireframe Guidelines**
   - Alur navigasi antar halaman (Screen Flow).
   - Komponen UI penting dan state handling (Empty, Loading, Error, Success state).

9. **Milestones & Timeline**
   - Pembagian fase pengembangan (Sprint planning / Phase breakdown).
   - Risiko potensial beserta mitigasinya.

Gunakan bahasa yang presisi, minim jargon kosong, dan fokus pada kejelasan teknis agar developer dapat langsung menurunkan dokumen ini menjadi backlog atau task board.