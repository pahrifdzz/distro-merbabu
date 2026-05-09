const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

require("dotenv").config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.ongkirKota.createMany({
    data: [
      { kota: "Tangerang", biaya: 0, estimasi: "1 hari" },
      { kota: "Tangerang Selatan", biaya: 0, estimasi: "1 hari" },
      { kota: "Jakarta", biaya: 15000, estimasi: "1-2 hari" },
      { kota: "Bekasi", biaya: 20000, estimasi: "2-3 hari" },
      { kota: "Depok", biaya: 20000, estimasi: "2-3 hari" },
      { kota: "Bogor", biaya: 25000, estimasi: "2-3 hari" },
      { kota: "Bandung", biaya: 30000, estimasi: "3-4 hari" },
      { kota: "Surabaya", biaya: 45000, estimasi: "4-5 hari" },
      { kota: "Yogyakarta", biaya: 35000, estimasi: "3-4 hari" },
      { kota: "Semarang", biaya: 35000, estimasi: "3-4 hari" },
      { kota: "Medan", biaya: 55000, estimasi: "5-7 hari" },
      { kota: "Makassar", biaya: 55000, estimasi: "5-7 hari" },
      { kota: "Lainnya", biaya: 60000, estimasi: "5-7 hari" },
    ],
  });
  console.log("Data ongkir berhasil ditambahkan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
