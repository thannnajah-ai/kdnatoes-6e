Bertindaklah sebagai Principal Software Architect dan AI DevEx Specialist. Buatkan file `AGENTS.md` (instruksi operasional untuk AI Coding Agent) yang ketat, terstruktur, dan siap pakai berdasarkan detail proyek berikut:

**Detail Proyek:**
- Nama Proyek: [Nama Proyek/Repositori]
- Deskripsi Singkat: [Penjelasan singkat fungsi aplikasi/sistem]
- Tech Stack: [contoh: Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma, PostgreSQL / Flutter, BLoC, Supabase]
- Package Manager / Runtime: [contoh: pnpm / bun / npm / flutter / dart]
- Perintah Kunci:
  - Dev Server: [contoh: pnpm dev / flutter run]
  - Testing: [contoh: pnpm test / flutter test]
  - Lint/Format: [contoh: pnpm lint / dart format .]
  - Build: [contoh: pnpm build / flutter build apk]

---

**Instruksi Output `AGENTS.md`:**
Format seluruh isi dalam Markdown bersih dengan struktur berikut:

1. **Role & Operating Philosophy**
   - Peran agen (Senior Engineer dengan fokus pada clean code, modularitas, dan keamanan).
   - Prinsip utama: verifikasi sebelum modifikasi, minimalkan perubahan yang tidak diminta (*no side-effects*), prioritaskan performa.

2. **Repository Architecture & Directory Map**
   - Struktur folder penting (misal: `/src/features`, `/src/components`, `/lib/bloc`, `/lib/views`).
   - Penjelasan ringkas tanggung jawab tiap direktori utama.

3. **Development Workflow & Execution Loop**
   - Siklus kerja wajib AI Agent:
     1. *Read & Analyze*: Membaca file terkait sebelum mengedit.
     2. *Plan*: Memberikan ringkasan rencana perubahan secara singkat.
     3. *Execute*: Melakukan perubahan bertahap.
     4. *Verify*: Menjalankan linter/test untuk memastikan tidak ada regresi.

4. **Coding Standards & Conventions**
   - Standar penamaan file, fungsi, dan variabel.
   - Pola arsitektur (misal: Feature-based folder structure, Repository pattern, BLoC pattern).
   - Penanganan error (*error handling*) dan *defensive programming*.
   - Aturan tipe data (misal: *strict mode*, dilarang menggunakan `any` tanpa justifikasi).

5. **Guardrails & Prohibited Actions (Strict Boundaries)**
   - Perintah terminal yang dilarang (misal: `rm -rf`, `git push --force`, `git reset --hard`).
   - File/direktori terlarang untuk diedit langsung (misal: `.env`, lockfiles, generated migration files tanpa izin).
   - Aturan instalasi library baru (wajib konfirmasi sebelum menambah dependency ke `package.json` / `pubspec.yaml`).

6. **Git & Commit Standards**
   - Format pesan commit (Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`).
   - Batasan commit (atomic commit, jangan menggabungkan fitur dan refactoring dalam satu commit).

Buat dokumen ini ringkas, tegas, padat instruksi teknis, dan hilangkan kalimat basa-basi agar tidak memboroskan context window model.