import { Pakasir } from "pakasir-sdk";

let client;

function getPakasir() {
  if (!client) {
    client = new Pakasir({
      slug: process.env.PAKASIR_SLUG,
      apikey: process.env.PAKASIR_API_KEY,
    });
  }
  return client;
}

// Instansiasi lazy: konstruktor Pakasir memvalidasi config dan akan throw bila
// env belum ada. Menundanya sampai pemakaian pertama mencegah `next build`
// gagal saat "Collecting page data", tanpa mengubah call site (`pakasir.xxx()`).
const pakasir = new Proxy(
  {},
  {
    get(_target, prop) {
      const c = getPakasir();
      const value = c[prop];
      return typeof value === "function" ? value.bind(c) : value;
    },
  },
);

export default pakasir;
