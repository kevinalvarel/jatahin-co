# 💰 Daily Budget Tracker

Aplikasi penghitung jatah pengeluaran harian agar keuangan tetap terkontrol. Dibangun dengan stack modern yang cepat dan type-safe.

## Tech Stack

| Layer         | Teknologi                    |
| ------------- | ---------------------------- |
| Framework     | Next.js (App Router)         |
| Database      | Neon Serverless (PostgreSQL) |
| ORM           | Drizzle ORM                  |
| Auth          | Better Auth                  |
| Validation    | Zod                          |
| UI Components | shadcn/ui                    |
| Styling       | Tailwind CSS                 |

---

## Fitur

- Multi-user dengan autentikasi (login, register, session)
- Set jatah pengeluaran harian per user
- Catat transaksi pengeluaran dan pemasukan
- Ringkasan harian otomatis (total spent vs. limit)
- Laporan mingguan dan bulanan per kategori

---

## Struktur Database

### Tabel Auth (dikelola Better Auth)

```
users           — data akun pengguna
sessions        — sesi login aktif
accounts        — OAuth provider (jika dipakai)
verifications   — verifikasi email
```

### Tabel Aplikasi

```
budgets         — jatah harian per user (bisa diubah dari waktu ke waktu)
transactions    — setiap transaksi pengeluaran / pemasukan
daily_summaries — ringkasan harian (total spent, apakah over limit)
```

### Relasi

```
users
  ├── budgets         (1 user → many budgets, 1 aktif per waktu)
  ├── transactions    (1 user → many transactions)
  └── daily_summaries (1 user → 1 row per hari)
```

---

## Struktur Folder

```
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── page.tsx          # Ringkasan hari ini
│   │   ├── transactions/     # Riwayat transaksi
│   │   └── reports/          # Laporan mingguan & bulanan
│   └── api/
│       └── auth/             # Better Auth handler
├── components/
│   └── ui/                   # shadcn/ui components
├── db/
│   ├── schema/
│   │   ├── auth.ts           # Schema Better Auth
│   │   ├── budgets.ts
│   │   ├── transactions.ts
│   │   └── daily-summaries.ts
│   └── index.ts              # Drizzle client
├── lib/
│   ├── auth.ts               # Better Auth config
│   ├── validations/
│   │   ├── budget.ts         # Zod schema untuk budget
│   │   └── transaction.ts    # Zod schema untuk transaksi
│   └── utils.ts
└── drizzle.config.ts
```

---

## Skema Drizzle ORM

### `db/schema/budgets.ts`

```ts
import {
  pgTable,
  uuid,
  text,
  numeric,
  varchar,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const budgets = pgTable("budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  dailyLimit: numeric("daily_limit", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("IDR"),
  startDate: date("start_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

### `db/schema/transactions.ts`

```ts
import {
  pgTable,
  uuid,
  text,
  numeric,
  varchar,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  type: varchar("type", { length: 10 }).notNull(), // "expense" | "income"
  category: varchar("category", { length: 50 }),
  note: text("note"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### `db/schema/daily-summaries.ts`

```ts
import {
  pgTable,
  uuid,
  text,
  numeric,
  date,
  timestamp,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const dailySummaries = pgTable(
  "daily_summaries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    totalSpent: numeric("total_spent", { precision: 12, scale: 2 }).default(
      "0",
    ),
    totalIncome: numeric("total_income", { precision: 12, scale: 2 }).default(
      "0",
    ),
    dailyLimit: numeric("daily_limit", { precision: 12, scale: 2 }).notNull(),
    isOver: boolean("is_over").default(false),
  },
  (t) => ({
    unq: unique().on(t.userId, t.date),
  }),
);
```

---

## Zod Validations

### `lib/validations/budget.ts`

```ts
import { z } from "zod";

export const createBudgetSchema = z.object({
  dailyLimit: z
    .number({ required_error: "Jatah harian wajib diisi" })
    .positive("Jatah harian harus lebih dari 0")
    .max(100_000_000, "Maksimal 100 juta per hari"),
  currency: z.string().length(3).default("IDR"),
  startDate: z.coerce.date(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
```

### `lib/validations/transaction.ts`

```ts
import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z
    .number({ required_error: "Nominal wajib diisi" })
    .positive("Nominal harus lebih dari 0"),
  type: z.enum(["expense", "income"], {
    required_error: "Tipe transaksi wajib dipilih",
  }),
  category: z.string().min(1, "Kategori wajib dipilih").max(50),
  note: z.string().max(255).optional(),
  date: z.coerce.date(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
```

---

## Instalasi & Setup

### 1. Clone dan install dependencies

```bash
git clone <repo-url>
cd daily-budget-tracker
npm install
```

### 2. Konfigurasi environment

Buat file `.env.local`:

```env
# Neon Database
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Jalankan migrasi database

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Jalankan migrasi ke Neon
npm run db:studio    # Buka Drizzle Studio (GUI database)
npm run db:push      # Push schema langsung (untuk development)
```

---

## Tips Pengembangan

**Update `daily_summaries` otomatis** — setiap kali transaksi baru masuk, hitung ulang total hari itu dan update baris di `daily_summaries`. Lakukan di server action atau API route yang sama dengan insert transaksi.

**Index database** — tambahkan index pada kolom `(user_id, date)` di tabel `transactions` dan `daily_summaries` agar query laporan tetap cepat meski data bertambah banyak.

**Budget history** — simpan riwayat perubahan jatah harian dengan menambah row baru di `budgets` (bukan update), sehingga laporan historis tetap akurat sesuai limit yang berlaku saat itu.

**Kategori kustom** — saat ini kategori berupa string bebas. Jika ingin user bisa custom kategori, buat tabel `categories` terpisah yang berelasi ke `userId`.
