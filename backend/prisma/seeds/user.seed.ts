import bcrypt from "bcrypt";
import { PrismaClient } from "./../../src/generated/client";

export async function seedUsers(prisma: PrismaClient) {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const usersData = [
    {
      firstName: "System",
      lastName: "Admin",
      email: "admin@lostfound.com",
      phone: "0900000001",
      profession: "WORKER" as const,
      role: "ADMIN" as const,
    },
    {
      firstName: "John",
      lastName: "Smith",
      email: "john@lostfound.com",
      phone: "0900000002",
      profession: "STUDENT" as const,
      role: "USER" as const,
      className: "SE-01",
    },
    {
      firstName: "Emma",
      lastName: "Johnson",
      email: "emma@lostfound.com",
      phone: "0900000003",
      profession: "STUDENT" as const,
      role: "USER" as const,
      className: "SE-02",
    },
    {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael@lostfound.com",
      phone: "0900000004",
      profession: "TEACHER" as const,
      role: "USER" as const,
    },
    {
      firstName: "Sophia",
      lastName: "Davis",
      email: "sophia@lostfound.com",
      phone: "0900000005",
      profession: "TEACHER" as const,
      role: "USER" as const,
    },
    {
      firstName: "Daniel",
      lastName: "Wilson",
      email: "daniel@lostfound.com",
      phone: "0900000006",
      profession: "WORKER" as const,
      role: "USER" as const,
    },
    {
      firstName: "Olivia",
      lastName: "Miller",
      email: "olivia@lostfound.com",
      phone: "0900000007",
      profession: "STUDENT" as const,
      role: "USER" as const,
      className: "SE-03",
    },
    {
      firstName: "James",
      lastName: "Taylor",
      email: "james@lostfound.com",
      phone: "0900000008",
      profession: "WORKER" as const,
      role: "USER" as const,
    },
    {
      firstName: "Ava",
      lastName: "Anderson",
      email: "ava@lostfound.com",
      phone: "0900000009",
      profession: "STUDENT" as const,
      role: "USER" as const,
      className: "SE-04",
    },
    {
      firstName: "William",
      lastName: "Thomas",
      email: "william@lostfound.com",
      phone: "0900000010",
      profession: "TEACHER" as const,
      role: "USER" as const,
    },
  ];

  const users = [];

  for (const data of usersData) {
    const user = await prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {},
      create: {
        ...data,
        passwordHash,
        isActive: true,
      },
    });

    users.push(user);
  }

  console.log("✅ Users seeded: 10");

  return users;
}
