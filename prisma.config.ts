import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    // Prisma CLI (migrate deploy, studio) memakai koneksi DIRECT (port 5432),
    // bukan transaction pooler 6543/pgbouncer. Query runtime aplikasi memakai
    // adapter PrismaPg (DATABASE_URL) di src/lib/prisma.js.
    url: env("DIRECT_URL"),
  },
});
