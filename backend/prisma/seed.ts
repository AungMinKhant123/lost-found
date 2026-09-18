import "dotenv/config";

import { seedUsers } from "./seeds/user.seed.js";
import { seedCategories } from "./seeds/category.seed.js";
import { seedColors } from "./seeds/color.seed.js";
import { seedItems } from "./seeds/item.seed.js";
import { seedItemImages } from "./seeds/itemImage.seed.js";
import { seedClaims } from "./seeds/claim.seed.js";
import { seedNotifications } from "./seeds/notification.seed.js";
import { PrismaClient } from "../src/generated/client.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  const users = await seedUsers(prisma);
  const categories = await seedCategories(prisma, users);
  const colors = await seedColors(prisma, users);
  const items = await seedItems(prisma, users, categories, colors);
  const itemImages = await seedItemImages(prisma, items);
  const claims = await seedClaims(prisma, users, items);

  await seedNotifications(prisma, users, claims);

  console.log("\n🌱 Database seed completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
