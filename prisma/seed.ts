import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const topics = await prisma.topic.createMany({
    data: [
      { id: 1, name: "Books" },
      { id: 2, name: "Cars" },
      { id: 3, name: "Clocks" },
      { id: 4, name: "Coins" },
      { id: 5, name: "Dolls" },
      { id: 6, name: "Jewellery" },
      { id: 7, name: "Paintings" },
      { id: 8, name: "Silverware" },
      { id: 9, name: "Stamps" },
      { id: 10, name: "Toys" },
    ],
  });
  console.log({ topics });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
