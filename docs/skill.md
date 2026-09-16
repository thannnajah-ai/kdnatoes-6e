Bertindaklah sebagai AI DevEx Architect dan Staff Software Engineer. Buatkan file `SKILL.md` (atau `SKILLS.md`) yang terstruktur, modular, dan siap dieksekusi oleh AI Agent (seperti Claude Code, Cursor, Cline) maupun engineer internal berdasarkan detail repositori berikut:

**Detail Proyek:**
- Nama Proyek: [Nama Proyek/Sistem]
- Tech Stack: [contoh: Next.js 14, TypeScript, Tailwind, Prisma, PostgreSQL / Flutter, BLoC, Supabase]
- Tools & CLI yang Tersedia: [contoh: pnpm, prisma cli, docker-compose, vitest, eslint]
- Domain / Modul Kritis: [contoh: Autentikasi JWT, Payment Gateway, Optimasi Image, Query Optimization]
- Alur Kerja Rutin yang Ingin Distandarisasi: [contoh: Menambah API endpoint baru, Membuat komponen UI baru, Menjalankan migrasi database aman, Menulis unit test]

---

**Instruksi Output `SKILL.md`:**
Tuliskan seluruh isi dalam format Markdown standar dengan struktur berikut:

1. **Skill Taxonomy & Overview**
   - Matriks klasifikasi skill berdasarkan kategori:
     - `Core Dev`: Pembuatan fitur, komponen UI, modul logika.
     - `Data & DB`: Migrasi skema, seeding, optimasi query.
     - `Testing & QA`: Unit test, integrasi, mock data generation.
     - `DevOps & Infra`: Docker setup, deployment, env validation.

2. **Skill Execution Standard (Standard Operating Procedure)**
   - Format baku untuk setiap skill mencakup:
     - **Trigger Condition:** Kapan skill ini harus dipanggil.
     - **Pre-requisites:** Dependensi file, environment, atau permission yang wajib aktif.
     - **Deterministic Steps:** Langkah eksekusi langkah-demi-langkah (step-by-step).
     - **Verification / Output Check:** Perintah terminal atau validasi untuk memastikan skill sukses.

3. **Core Skills Catalog (Sertakan minimal 4-5 skill konkret siap pakai)**
   - *Skill 1: New Feature / Endpoint Generator* (Alur pembuatan rute API, validasi skema request/response, controller, dan integrasi database).
   - *Skill 2: Database Migration & Seeding Workflow* (Alur pembuatan migrasi baru tanpa merusak data lama, rollback check, dan update mock seed).
   - *Skill 3: UI Component Fabrication* (Standar pembuatan komponen reusable, styling token, accessibility check, dan variasi state: loading, error, empty).
   - *Skill 4: Test Suite Implementation* (Alur penulisan unit test untuk business logic, mock external service, dan target coverage).
   - *Skill 5: Refactoring & Dead-Code Elimination* (Pola aman pembersihan kode tanpa side-effect).

4. **Tool & Command Bindings**
   - Tabel referensi cepat perintah terminal yang dipasangkan ke masing-masing skill (Command, Parameter, Ekspektasi Output).

5. **Guardrails & Error Recovery per Skill**
   - Mitigasi jika terjadi kegagalan (misal: migrasi database gagal, build error setelah menambah komponen).
   - Aturan larangan khusus per skill (misal: dilarang menghapus migration file lama, dilarang bypass type check).

Buat instruksi setiap skill sangat prosedural, gunakan perintah terminal nyata sesuai tech stack, dan hilangkan kalimat teoritis umum agar agent dapat mengeksekusinya tanpa ambigu.