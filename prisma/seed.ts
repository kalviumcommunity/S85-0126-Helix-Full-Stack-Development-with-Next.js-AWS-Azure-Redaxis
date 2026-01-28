import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create DONOR user
  const user = await prisma.user.create({
    data: {
      name: "Amit",
      email: "amit@test.com",
      password: hashedPassword,
      role: "DONOR",
      donor: {
        create: {
          bloodGroup: "O+",
          city: "Delhi",
        },
      },
    },
  });

  // Create HOSPITAL + its admin user
  const hospital = await prisma.hospital.create({
    data: {
      name: "City Hospital",
      city: "Delhi",
      user: {
        create: {
          name: "City Hospital Admin",
          email: "hospital@test.com",
          password: hashedPassword,
          role: "HOSPITAL",
        },
      },
    },
  });

  // Create Blood Inventory
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
