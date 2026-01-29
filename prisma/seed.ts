import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create DONOR user with profile
  const donorUser = await prisma.user.create({
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

  // Create HOSPITAL admin user
  const hospitalAdmin = await prisma.user.create({
    data: {
      name: "City Hospital Admin",
      email: "hospital@test.com",
      password: hashedPassword,
      role: "HOSPITAL",
    },
  });

  // Create HOSPITAL
  const hospital = await prisma.hospital.create({
    data: {
      name: "City Hospital",
      city: "Delhi",
      userId: hospitalAdmin.id, // link hospital to admin user
    },
  });

  // Create Blood Inventory for hospital
  await prisma.bloodInventory.create({
    data: {
      bloodGroup: "O+",
      units: 10,
      hospitalId: hospital.id,
    },
  });

  // Optional: Create a Blood Request
  await prisma.bloodRequest.create({
    data: {
      bloodGroup: "O+",
      units: 5,
      status: "PENDING",
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
