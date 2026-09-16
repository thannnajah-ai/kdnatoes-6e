Bertindaklah sebagai Principal DevOps Engineer dan Engineering Process Specialist. Buatkan file `WORKFLOW.md` yang terstruktur, komprehensif, dan siap diterapkan di repositori tim maupun AI coding agent berdasarkan detail proyek berikut:

**Detail Proyek:**
- Nama Proyek: [Nama Proyek/Repositori]
- Tech Stack: [contoh: Next.js, Node.js, PostgreSQL / Flutter, Supabase]
- Model Branching: [contoh: Trunk-Based Development / GitHub Flow / Git Flow]
- CI/CD Platform: [contoh: GitHub Actions / GitLab CI / Vercel]
- Deployment Environments: [contoh: Local, Preview/Staging, Production]
- Tools Tracking & Review: [contoh: GitHub Issues, Linear, Jira]

---

**Instruksi Output `WORKFLOW.md`:**
Tuliskan seluruh isi dalam format Markdown standar dengan struktur berikut:

1. **Workflow Philosophy & Core Rules**
   - Prinsip utama pengembangan (misal: *shift-left testing*, *small atomic PRs*, *continuous integration*).
   - Aturan baku repositori (*protected branches*, dilarang *direct push* ke `main`, status check wajib hijau).

2. **Git Branching & Naming Conventions**
   - Pola penamaan branch terstandarisasi:
     - `feat/<issue-id>-<slug>` (fitur baru)
     - `fix/<issue-id>-<slug>` (perbaikan bug)
     - `refactor/<slug>` (restrukturisasi kode)
     - `chore/<slug>` (update dependency/config)
     - `hotfix/<slug>` (emergency patch production)
   - Kebijakan siklus hidup branch (kapan branch dibuat dan kapan dihapus).

3. **End-to-End Feature Development Lifecycle**
   - Langkah demi langkah dari tiket/issue hingga *ready for review*:
     1. Ambil tiket & checkout branch baru dari `main` terbaru.
     2. Implementasi kode lokal & penulisan test.
     3. Pre-commit check (format, lint, unit test lokal).
     4. Push ke remote & pembuatan Pull Request (PR).

4. **Pull Request (PR) & Code Review Protocol**
   - Anatomi PR ideal (judul, deskripsi perubahan, konteks issue, instruksi pengujian, bukti visual/screenshot jika ada perubahan UI).
   - Ukuran ideal PR (maksimal ~300-400 baris diff untuk menjaga kualitas review).
   - Checklist reviewer (keamanan, performa, cakupan test, keterbacaan kode).
   - Strategi merge (contoh: *Squash and Merge* dengan pesan commit bersih).

5. **CI/CD Pipeline & Environments**
   - Alur otomatisasi pada setiap event:
     - *On PR Open/Update:* Lint check, Type check, Unit & Integration test, Preview deployment build.
     - *On Merge to Main:* Deploy otomatis ke Staging / Production, migrasi database otomatis (jika ada).
   - Matriks environment (Local vs Staging vs Production) dan pemisahan kredensial/variabel.

6. **Release Management & Versioning**
   - Standar Semantic Versioning (`vMAJOR.MINOR.PATCH`).
   - Alur pembuatan tag rilis dan generasi Changelog otomatis.
   - Checklist pra-rilis (*sanity check*, verifikasi migration).

7. **Emergency Hotfix & Rollback Workflow**
   - Prosedur cepat ketika terjadi insiden kritis di Production.
   - Langkah mitigasi: *revert PR* vs *forward hotfix*.
   - Standar Post-Mortem (Root Cause Analysis/RCA) pasca insiden.

8. **AI-Agent Collaboration Rules**
   - Batasan khusus saat AI coding agent mengeksekusi workflow:
     - Agent wajib membuat branch terisolasi, dilarang mengubah branch `main` langsung.
     - Agent wajib menjalankan test suite lokal sebelum meminta commit/PR.
     - Agent harus melampirkan ringkasan file yang diubah dan dampak dependensi.

Buat dokumen ini operasional, ringkas, dan memuat diagram alur Mermaid (`gitGraph` atau `graph TD`) untuk menggambarkan alur branch dan pipeline CI/CD.