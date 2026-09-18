import { PrismaClient } from "./../../src/generated/client";

export async function seedNotifications(
  prisma: PrismaClient,
  users: any[],
  claims: any[],
) {
  const notificationData = [
    {
      user: 2,
      claim: 0,
      title: "New Claim",
      message: "Someone submitted a claim for your found wallet.",
      isRead: false,
    },
    {
      user: 3,
      claim: 1,
      title: "New Claim",
      message: "Someone submitted a claim for your found smartphone.",
      isRead: false,
    },
    {
      user: 4,
      claim: 2,
      title: "Claim Accepted",
      message: "A claim for your backpack has been accepted.",
      isRead: true,
    },
    {
      user: 5,
      claim: 3,
      title: "New Claim",
      message: "Someone submitted a claim for your USB drive.",
      isRead: false,
    },
    {
      user: 6,
      claim: 4,
      title: "Claim Declined",
      message: "A claim related to your item has been declined.",
      isRead: true,
    },
    {
      user: 7,
      claim: 5,
      title: "New Claim",
      message: "Someone submitted a claim for your keys.",
      isRead: false,
    },
    {
      user: 8,
      claim: 6,
      title: "Claim Accepted",
      message: "Your claim has been accepted.",
      isRead: true,
    },
    {
      user: 9,
      claim: 7,
      title: "New Claim",
      message: "Someone submitted a claim for your bracelet.",
      isRead: false,
    },
    {
      user: 1,
      claim: 8,
      title: "Claim Declined",
      message: "Your claim has been declined.",
      isRead: true,
    },
    {
      user: 2,
      claim: 9,
      title: "Claim Accepted",
      message: "Your claim has been accepted.",
      isRead: false,
    },
  ];

  for (const data of notificationData) {
    await prisma.notification.create({
      data: {
        userId: users[data.user].id,
        type: "CLAIM",
        title: data.title,
        message: data.message,
        claimId: claims[data.claim].id,
        isRead: data.isRead,
      },
    });
  }

  console.log("✅ Notifications seeded: 10");
}
