import { PrismaClient } from "./../../src/generated/client";

export async function seedCategories(prisma: PrismaClient, users: any[]) {
  const admin = users[0];

  const categories = [
    {
      name: "Electronics",
      icon: "smartphone",
    },
    {
      name: "Documents",
      icon: "file-text",
    },
    {
      name: "Clothing",
      icon: "shirt",
    },
    {
      name: "Bags",
      icon: "shopping-bag",
    },
    {
      name: "Accessories",
      icon: "watch",
    },
    {
      name: "Keys",
      icon: "key",
    },
    {
      name: "Books",
      icon: "book",
    },
    {
      name: "Wallets",
      icon: "wallet",
    },
    {
      name: "Jewelry",
      icon: "gift",
    },
    {
      name: "Other",
      icon: "tag",
    },
  ];

  const seededCategories = [];

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: {
        name: categoryData.name,
      },

      update: {
        icon: categoryData.icon,
      },

      create: {
        name: categoryData.name,
        icon: categoryData.icon,
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    seededCategories.push(category);
  }

  console.log("✅ Categories seeded: 10");

  return seededCategories;
}
