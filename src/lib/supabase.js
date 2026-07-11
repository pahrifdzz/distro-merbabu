import { createClient } from "@supabase/supabase-js";

let client;

function getSupabase() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
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
