import { PrismaClient } from "../../src/generated/client";

export async function seedItemImages(prisma: PrismaClient, items: any[]) {
  const images = [];

  for (let i = 0; i < items.length; i++) {
    const image = await prisma.itemImage.create({
      data: {
        itemId: items[i].id,
        objectKey:
          "https://res.cloudinary.com/d5tnusci/image/upload/v1789664555/earphone_zxmi2w.png",
      },
    });

    images.push(image);

    if (i % 2 === 0) {
      const secondImage = await prisma.itemImage.create({
        data: {
          itemId: items[i].id,
          objectKey:
            "https://res.cloudinary.com/d5tnusci/image/upload/v1789664528/phone_siep1d.jpg",
        },
      });

      images.push(secondImage);
    }
  }

  console.log(`✅ Item images seeded: ${images.length}`);

  return images;
}
