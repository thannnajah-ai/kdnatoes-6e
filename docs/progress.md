Bertindaklah sebagai Staff Software Engineer dan AI Session Architect. Buatkan file `PROGRESS.md` (dokumen pelacak status eksekusi dan session memory) yang terstruktur, rapi, dan mudah diperbarui secara inkremental berdasarkan data berikut:

**Detail Proyek:**
- Nama Proyek: [Nama Proyek/Repositori]
- Fase / Versi Saat Ini: [contoh: v0.1.0 MVP / Sprint 2]
- Modul yang Baru Saja Diselesaikan: [Sebutkan fitur/tugas yang sudah rampung dan terverifikasi]
- Pekerjaan yang Sedang Berjalan (In-Progress): [Sebutkan fitur/bug yang sedang dikerjakan saat ini]
- Kendala / Blocker Saat Ini: [Kendala teknis, bug aneh, atau dependency yang belum siap - jika ada]
- Target Sesi Berikutnya: [1-3 prioritas utama yang harus langsung dikerjakan]

---

**Instruksi Output `PROGRESS.md`:**
Tulis seluruh dokumen dalam format Markdown standar dengan hierarki berikut:

1. **Project Health & Status Dashboard**
   - Ringkasan satu pandang:
     - **Overall Health:** [Green / Amber / Red]
     - **Current Milestone:** [Fase/Sprint aktif]
     - **Last Synced:** [Tanggal & Waktu terakhir update]
     - **Active Branch:** [Branch kerja saat ini]
   - Baris ringkas metrik progres (misal: Tasks Completed: X/Y, Test Coverage: Z%).

2. **Completed Deliverables (What Works Now)**
   - Daftar modul/fitur yang sudah **100% selesai dan terverifikasi**.
   - Sertakan status pengujian singkat (misal: unit test pass, UI manual check OK, endpoint verified 200 OK).

3. **In-Flight Work (Current Active Context)**
   - Detail pekerjaan yang sedang aktif dikerjakan di sesi ini.
   - File-file spesifik yang sedang mengalami modifikasi aktif.
   - Hipotesis atau solusi parsial yang sedang diuji coba.

4. **Testing & Verification Log**
   - Bukti verifikasi terbaru (perintah uji yang dijalankan dan hasilnya, misal: `pnpm test` -> 24 passed).
   - Catatan validasi manual (misal: login Google OAuth berhasil redirect di localhost:3000).

5. **Blockers, Known Bugs & Technical Debt**
   - Isu kritis yang menghambat progres (*showstoppers*).
   - Bug sekunder yang ditemukan di tengah jalan tapi ditunda agar tidak mengganggu fokus.
   - *Technical debt* atau kompromi kode yang butuh refactoring nanti.

6. **Key Implementation Decisions & Learnings**
   - Catatan teknis penting dari sesi sebelumnya (misal: *"Library X bentrok dengan TypeScript v5, di-downgrade ke v4.9"* atau *"Endpoint Y butuh debounce 300ms"*).
   - Menghindari developer/agent mengulangi kesalahan yang sama di sesi berikutnya.

7. **Next Up / Session Handoff (Cold-Start Checklist)**
   - 3–5 langkah teknis spesifik berikutnya dalam urutan prioritas tajam.
   - Instruksi langsung agar developer atau AI agent sesi baru bisa langsung mulai tanpa membaca riwayat chat dari awal.

Buat dokumen ini padat fakta, objektif, tanpa basa-basi, dan mudah diedit secara berkala dengan diff baris yang minim.