Bertindaklah sebagai Engineering Lead dan Technical Project Manager. Buatkan file `TODO.md` (task tracking roadmap) yang komprehensif, terstruktur, dan actionable untuk repositori kami berdasarkan detail berikut:

**Detail Proyek:**
- Nama Proyek: [Nama Proyek]
- Deskripsi & Scope: [Jelaskan singkat fokus proyek saat ini atau lampirkan ringkasan PRD]
- Tech Stack: [contoh: Next.js, Tailwind, Prisma, PostgreSQL / Flutter, BLoC, Supabase]
- Status Saat Ini: [contoh: Inisiasi awal (fresh repo) / Migrasi backend / Menambahkan fitur X]
- Target Rilis / Milestone: [contoh: MVP Rilis internal dalam 3 minggu]

---

**Instruksi Output `TODO.md`:**
Tuliskan seluruh isi dalam format Markdown standar dengan struktur berikut:

1. **Project Status Dashboard**
   - Ringkasan progres global (tabel ringkas: Fase, Status [Not Started / In Progress / Completed], Target Tanggal).
   - Indikator Sprint aktif saat ini.

2. **Phase 1: Environment & Project Setup**
   - Inisialisasi repositori, konfigurasi tooling (Linter, Formatter, TypeScript strict check).
   - Setup environment variables (`.env.example`), Docker container, atau script database dev.

3. **Phase 2: Database & Core Infrastructure**
   - Skema basis data & migration scripts awal.
   - Setup koneksi database, ORM/query builder, dan seed data dasar.
   - Konfigurasi auth provider / middleware keamanan dasar.

4. **Phase 3: Core Features (Breakdown per Modul)**
   - Pecah setiap modul fitur utama ke dalam sub-tugas teknis granular (Backend/API -> State/Logic -> UI/View).
   - Gunakan format task checklist interaktif: `- [ ] [ID-Fitur] Deskripsi tugas teknis spesifik`.
   - Berikan tag prioritas pada tiap tugas utama: `[P0 - Critical]`, `[P1 - High]`, `[P2 - Normal]`.

5. **Phase 4: UI/UX States & Edge Cases**
   - Penanganan Loading skeletons, Empty states, dan Global Error Boundaries.
   - Responsivitas mobile dan cross-browser validation.

6. **Phase 5: Testing, Security & Observability**
   - Unit testing untuk fungsi kalkulasi/logika bisnis krusial.
   - Integration / E2E test alur kritis pengguna (*happy path*).
   - Setup logging, Sentry error monitoring, dan validasi sanitasi input.

7. **Phase 6: Pre-Launch & Deployment**
   - Setup production build optimization dan audit bundle size.
   - Setup CI/CD pipeline (GitHub Actions untuk lint, test, deploy).
   - Deployment checklist ke hosting/server production.

8. **Backlog & Nice-to-Have (Post-MVP)**
   - Ide fitur tambahan yang ditunda ke fase rilis berikutnya.

9. **Definition of Done (DoD)**
   - 4-6 kriteria baku sebelum sebuah checklist item boleh diubah statusnya menjadi `- [x]`.

Pecah tugas menjadi langkah-langkah kecil (atomik) yang dapat diselesaikan dalam 1 sesi coding (30–60 menit per task). Hindari item tugas yang terlalu abstrak seperti "selesaikan backend".