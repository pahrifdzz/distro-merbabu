import { createClient } from "@supabase/supabase-js";

let client;

// Modul ini HANYA dipakai di sisi server (route handler) — upload foto tidak lagi
// dari browser. Env dibaca saat RUNTIME, bukan di-bake saat `next build`, supaya
// satu image bisa dipakai lintas environment TANPA build-arg.
//
// PENTING: baca lewat key VARIABEL (parameter `keys`), JANGAN `process.env.NEXT_PUBLIC_X`
// atau `process.env["NEXT_PUBLIC_X"]` (key literal). Next meng-inline akses key-literal
// ber-prefix NEXT_PUBLIC_ jadi nilai build-time yang beku; dengan key variabel Next
// tidak bisa meng-inline sehingga nilainya benar-benar dibaca runtime dari process.env
// Node (lihat docs Next env vars: "dynamic lookups will not be inlined"). Jangan ubah
// ke akses key-literal. Nama non-public `SUPABASE_URL` didahulukan; `NEXT_PUBLIC_*`
// lama tetap didukung sebagai fallback runtime.
function envRuntime(...keys) {
  for (const key of keys) {
    const val = process.env[key];
    if (val) return val;
  }
  return undefined;
}

function readSupabaseEnv() {
  return {
    url: envRuntime("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: envRuntime("SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

function getSupabase() {
  if (!client) {
    const { url, anonKey } = readSupabaseEnv();

    // Fail-fast dengan pesan jelas mengganti error minified bawaan supabase-js
    // ("supabaseUrl is required") yang menyesatkan saat debugging.
    if (!url || !anonKey) {
      throw new Error(
        "Konfigurasi Supabase tidak tersedia. Set SUPABASE_URL & SUPABASE_ANON_KEY " +
          "(atau NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) sebagai " +
          "Environment (runtime) variable di Dokploy lalu redeploy. Lihat DEPLOYMENT.md §6.",
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
