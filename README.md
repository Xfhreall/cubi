# CUBI - Sistem Absensi Pegawai

Sistem manajemen absensi pegawai berbasis web dengan Next.js 16, Prisma, dan TanStack Query.

## Fitur

- **Dashboard** - Statistik kehadiran dan chart visualisasi
- **Manajemen Pegawai** - CRUD data pegawai dengan pencarian dan filter
- **Absensi** - Check-in/check-out harian dengan riwayat absensi
- **Laporan Bulanan** - Laporan kehadiran per bulan dengan kalender hari kerja

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL dengan Prisma ORM
- **State Management**: TanStack Query + nuqs (URL state)
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Form**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 20+ atau Bun
- PostgreSQL database

### Installation

1. Clone repository dan install dependencies:

```bash
bun install
```

2. Setup environment variables:

```bash
cp .env.example .env
# Edit .env dengan DATABASE_URL Anda
```

3. Setup database:

```bash
bun run db:migrate
bun run db:generate
```

4. Jalankan development server:

```bash
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Jalankan development server |
| `bun run build` | Build untuk production |
| `bun run start` | Jalankan production server |
| `bun run lint` | Jalankan Biome linter |
| `bun run lint:fix` | Fix lint errors |
| `bun run db:migrate` | Jalankan database migration |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:studio` | Buka Prisma Studio |

## Struktur Folder

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── absensi/           # Halaman Absensi
│   ├── pegawai/           # Halaman Pegawai
│   └── laporan/           # Halaman Laporan
├── features/              # Feature-based modules
│   ├── absensi/           # Absensi feature
│   ├── pegawai/           # Pegawai feature
│   └── laporan/           # Laporan feature
├── shared/                # Shared components & utilities
│   ├── components/        # UI Components
│   ├── lib/              # Utilities & helpers
│   └── providers/        # React providers
└── prisma/               # Prisma schema & migrations
```

## License

MIT
