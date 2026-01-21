import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Amit",
      email: "amit@test.com",
      role: "DONOR",
      donor: {
        create: {
          bloodGroup: "O+",
          city: "Delhi",
        },
      },
    },
  });

  const hospital = await prisma.hospital.create({
    data: {
      name: "City Hospital",
      city: "Delhi",
      user: {
        create: {
          name: "City Hospital Admin",
          email: "hospital@test.com",
          role: "HOSPITAL",
        },
      },
    },
  });

  // This part of code create Blood Inventory
  await prisma.bloodInventory.create({
    data: {
      bloodGroup: "O+",
      units: 10,
      hospitalId: hospital.id,
    },
  });

  console.log("Dummy data inserted successfully");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
