const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

require("dotenv").config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.produk.createMany({
    data: [
      {
        nama: "Kaos Classic Merbabu",
        harga: 120000,
        kategori: "Kaos",
        deskripsi: "Kaos berkualitas tinggi dengan desain khas Merbabu.",
      },
      {
        nama: "Hoodie Merbabu Summit",
        harga: 250000,
        kategori: "Hoodie",
        deskripsi: "Hoodie nyaman untuk aktivitas outdoor dan sehari-hari.",
      },
      {
        nama: "Topi Outdoor Merbabu",
        harga: 85000,
        kategori: "Aksesoris",
        deskripsi: "Topi outdoor dengan bahan premium anti UV.",
      },
      {
        nama: "Jaket Merbabu Trail",
        harga: 350000,
        kategori: "Jaket",
        deskripsi: "Jaket trail ringan dan tahan angin untuk pendakian.",
      },
      {
        nama: "Celana Cargo Merbabu",
        harga: 175000,
        kategori: "Celana",
        deskripsi:
          "Celana cargo dengan banyak kantong untuk aktivitas outdoor.",
      },
      {
        nama: "Kaos Merbabu Edition",
        harga: 135000,
        kategori: "Kaos",
        deskripsi: "Edisi spesial kaos Merbabu dengan desain eksklusif.",
      },
    ],
  });

  console.log("Data produk berhasil ditambahkan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
