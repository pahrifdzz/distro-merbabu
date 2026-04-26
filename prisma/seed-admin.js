const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@distromerbabu.com" },
    update: {},
    create: {
      nama: "Admin Merbabu",
      email: "admin@distromerbabu.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Akun admin berhasil dibuat!");
  console.log("Email   :", admin.email);
  console.log("Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
