import { PrismaClient } from "./../../src/generated/client";

export async function seedItemImages(prisma: PrismaClient, items: any[]) {
  const images = [];

  for (let i = 0; i < items.length; i++) {
    const image = await prisma.itemImage.create({
      data: {
        itemId: items[i].id,
        imageUrl: `items/item-${i + 1}-image-1.jpg`,
      },
    });

    images.push(image);

    if (i % 2 === 0) {
      await prisma.itemImage.create({
        data: {
          itemId: items[i].id,
          imageUrl: `items/item-${i + 1}-image-2.jpg`,
        },
      });
    }
  }

  console.log(`✅ Item images seeded: ${images.length}+`);

  return images;
}
