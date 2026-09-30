import { PrismaClient } from "./../../src/generated/client";

export async function seedColors(prisma: PrismaClient, users: any[]) {
  const admin = users[0];

  const colors = [
    {
      name: "Black",
      hexCode: "#000000",
    },
    {
      name: "White",
      hexCode: "#FFFFFF",
    },
    {
      name: "Red",
      hexCode: "#EF4444",
    },
    {
      name: "Blue",
      hexCode: "#3B82F6",
    },
    {
      name: "Green",
      hexCode: "#22C55E",
    },
    {
      name: "Yellow",
      hexCode: "#EAB308",
    },
    {
      name: "Gray",
      hexCode: "#6B7280",
    },
    {
      name: "Brown",
      hexCode: "#92400E",
    },
    {
      name: "Pink",
      hexCode: "#EC4899",
    },
    {
      name: "Other",
      hexCode: "#9CA3AF",
    },
  ];

  const seededColors = [];

  for (const colorData of colors) {
    const color = await prisma.color.upsert({
      where: {
        name: colorData.name,
      },

      update: {
        hexCode: colorData.hexCode,
      },

      create: {
        name: colorData.name,
        hexCode: colorData.hexCode,
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    seededColors.push(color);
  }

  console.log("✅ Colors seeded: 10");

  return seededColors;
}
