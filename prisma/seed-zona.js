const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

require("dotenv").config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.zonaOngkir.createMany({
    data: [
      {
        namaZona: "Zona 1 — Gratis Ongkir",
        wilayah: "Tangerang, Tangerang Selatan",
        biaya: 0,
        estimasi: "1 hari",
      },
      {
        namaZona: "Zona 2 — Jabodetabek",
        wilayah: "Jakarta, Bogor, Depok, Bekasi",
        biaya: 15000,
        estimasi: "1-2 hari",
      },
      {
        namaZona: "Zona 3 — Jawa & Bali",
        wilayah:
          "Bandung, Surabaya, Semarang, Yogyakarta, Bali, dan sekitarnya",
        biaya: 25000,
        estimasi: "2-3 hari",
      },
      {
        namaZona: "Zona 4 — Luar Jawa",
        wilayah: "Sumatera, Kalimantan, Sulawesi, Papua, dan pulau lainnya",
        biaya: 45000,
        estimasi: "3-5 hari",
      },
    ],
  });
  console.log("Data zona ongkir berhasil ditambahkan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
