Bertindaklah sebagai Principal System Architect. Buatkan file `ARCHITECTURE.md` teknis yang mendalam, jelas, dan siap pakai untuk repositori kami berdasarkan data berikut:

**Informasi Proyek:**
- Nama Proyek: [Nama Aplikasi / Sistem]
- Domain / Kategori: [contoh: FinTech / EdTech / E-Commerce / SaaS Multi-tenant]
- Arsitektur Utama: [contoh: Modular Monolith / Microservices / Clean Architecture / Event-Driven / Serverless]
- Tech Stack:
  - Frontend: [contoh: Next.js (App Router), Tailwind CSS, Zustand]
  - Mobile (jika ada): [contoh: Flutter, BLoC]
  - Backend: [contoh: Node.js/NestJS, Go/Gin, atau Supabase]
  - Database & Cache: [contoh: PostgreSQL, Redis]
  - Message Broker / Queue: [contoh: RabbitMQ, BullMQ, Kafka - opsional]
  - Cloud / Hosting / Infra: [contoh: AWS (ECS, RDS, S3), Docker, Vercel, Railway]

---

**Instruksi Output `ARCHITECTURE.md`:**
Tulis seluruh dokumen dalam format Markdown dengan struktur teknis berikut:

1. **System Overview & High-Level Architecture**
   - Gambaran umum sistem dan tujuan teknis utama (skalabilitas, konkurensi, efisiensi data).
   - Diagram arsitektur konseptual dalam format teks/ASCII art atau Mermaid diagram (`graph TD` / `sequenceDiagram`).

2. **Core Components & Layer Responsibilities**
   - Breakdown lapisan aplikasi (misal: Presentation Layer, Application/Business Logic Layer, Domain Layer, Infrastructure/Data Layer).
   - Batasan tanggung jawab (*separation of concerns*) dan dependency rule antar modul.

3. **Data Flow & Communication Patterns**
   - Alur data *end-to-end* (Client -> Gateway/CDN -> Reverse Proxy/API -> Services -> DB/Cache).
   - Protokol komunikasi yang digunakan (REST API, GraphQL, gRPC, WebSocket, Webhooks).
   - Strategi caching (in-memory, Redis, HTTP caching headers, invalidation strategy).

4. **Data Architecture & Persistence**
   - Strategi database (relasional vs NoSQL, indexing strategy, read/write replica).
   - Pengelolaan migrasi basis data (ORM/tools: Prisma, Drizzle, Alembic, Flyway, dll.).
   - Strategi penyimpanan objek/aset (S3 bucket, Cloudinary, presigned URL).

5. **Security & Identity Architecture**
   - Alur autentikasi dan otorisasi (JWT flow, Refresh Token rotation, OAuth2, RBAC/PBAC).
   - Enkripsi data (*in-transit* via TLS 1.3 dan *at-rest*).
   - Sanitasi input, mitigasi kerentanan (CORS, Rate Limiting, OWASP Top 10).

6. **Infrastructure & Deployment Topology**
   - Gambaran arsitektur hosting, containerization (Docker), dan orkestrasi.
   - Diagram lingkungan kerja (Development, Staging, Production).
   - Pipeline CI/CD ringkas (lint, test, build, migration, deploy).

7. **Architectural Decision Records (ADR) Summary**
   - Cantumkan minimal 3 keputusan arsitektural penting dalam format ringkas:
     - **Context:** Masalah yang dihadapi.
     - **Decision:** Pilihan teknis yang diambil.
     - **Trade-offs:** Kelebihan dan konsekuensi/kompromi yang diterima.

8. **Reliability, Scalability & Disaster Recovery**
   - Penanganan error (*graceful degradation*, retry policy, circuit breaker).
   - Logging, tracing, dan observability (OpenTelemetry, Sentry, Prometheus/Grafana).
   - Strategi backup database dan failover.

Fokus pada kejelasan diagramatis, minimalkan penjelasan non-teknis, dan prioritaskan spesifikasi arsitektur konkret yang memandu keputusan desain kode harian.