import { PrismaClient } from "./../../src/generated/client";

export async function seedColors(prisma: PrismaClient, users: any[]) {
  const admin = users[0];

  const colorNames = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Gray",
    "Brown",
    "Pink",
    "Other",
  ];

  const colors = [];

  for (const name of colorNames) {
    const color = await prisma.color.upsert({
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

    colors.push(color);
  }

  console.log("✅ Colors seeded: 10");

  return colors;
}
