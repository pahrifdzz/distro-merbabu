import { createClient } from "@supabase/supabase-js";

let client;

function getSupabase() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // NEXT_PUBLIC_* di-INLINE ke bundle saat `next build`, BUKAN dibaca runtime.
    // Kalau kosong di sini, build TIDAK menerima nilainya — di Dokploy keduanya
    // wajib di-set sebagai "Build-time variable" (bukan cuma runtime Environment)
    // lalu redeploy. Fail-fast dengan pesan jelas mengganti error minified bawaan
    // supabase-js ("supabaseUrl is required") yang menyesatkan saat debugging.
    if (!url || !anonKey) {
      throw new Error(
        "Konfigurasi Supabase tidak tersedia di bundle. " +
          "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY di-inline saat " +
          "`next build`, jadi set keduanya sebagai BUILD-TIME variable di Dokploy " +
          "lalu redeploy (set runtime Environment saja tidak cukup). Lihat DEPLOYMENT.md §6b.",
      );
    }

    client = createClient(url, anonKey);
  }
  return client;
}

// Client dibuat lazy (saat pertama diakses), BUKAN saat modul di-import.
// Ini mencegah `next build` gagal di tahap "Collecting page data" saat env
// Supabase belum tersedia, tanpa mengubah cara pemakaian (`supabase.storage...`).
const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      const c = getSupabase();
      const value = c[prop];
      return typeof value === "function" ? value.bind(c) : value;
    },
  },
);

export default supabase;
