import { PrismaClient } from "./../../src/generated/client";

export async function seedCategories(prisma: PrismaClient, users: any[]) {
  const admin = users[0];

  const categoryNames = [
    "Electronics",
    "Documents",
    "Clothing",
    "Bags",
    "Accessories",
    "Keys",
    "Books",
    "Wallets",
    "Jewelry",
    "Other",
  ];

  const categories = [];

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    categories.push(category);
  }

  console.log("✅ Categories seeded: 10");

  return categories;
}
