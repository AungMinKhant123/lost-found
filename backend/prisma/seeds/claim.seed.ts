import { PrismaClient } from "./../../src/generated/client";

export async function seedClaims(
  prisma: PrismaClient,
  users: any[],
  items: any[],
) {
  const claimData = [
    {
      item: 10,
      claimant: 1,
      message: "I believe this is my wallet.",
      status: "PENDING" as const,
    },
    {
      item: 11,
      claimant: 2,
      message: "This smartphone looks like mine.",
      status: "PENDING" as const,
    },
    {
      item: 12,
      claimant: 3,
      message: "I lost a red backpack matching this description.",
      status: "ACCEPTED" as const,
    },
    {
      item: 13,
      claimant: 4,
      message: "This USB drive belongs to me.",
      status: "PENDING" as const,
    },
    {
      item: 14,
      claimant: 5,
      message: "I believe this is my notebook.",
      status: "DECLINED" as const,
    },
    {
      item: 15,
      claimant: 6,
      message: "These keys look like mine.",
      status: "PENDING" as const,
    },
    {
      item: 16,
      claimant: 7,
      message: "I lost a bag matching this description.",
      status: "ACCEPTED" as const,
    },
    {
      item: 17,
      claimant: 8,
      message: "The bracelet has a unique mark.",
      status: "PENDING" as const,
    },
    {
      item: 18,
      claimant: 9,
      message: "This hoodie belongs to me.",
      status: "DECLINED" as const,
    },
    {
      item: 19,
      claimant: 1,
      message: "I can provide additional information.",
      status: "ACCEPTED" as const,
    },
  ];

  const claims = [];

  for (const data of claimData) {
    const claim = await prisma.claim.create({
      data: {
        itemId: items[data.item].id,
        claimantId: users[data.claimant].id,
        message: data.message,
        status: data.status,
      },
    });

    claims.push(claim);
  }

  console.log("✅ Claims seeded: 10");

  return claims;
}
