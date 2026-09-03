import { prisma } from "./lib/prisma.js";

async function main() {
  const items = await prisma.item.findMany();

  console.log(items);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
