import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function users() {
  const adminEmail = "admin@eazychise.com";

  const existingAdmin = await prisma.users.findUnique({
    where: { email: adminEmail },
  });
  if (existingAdmin) {
    console.log("Admin already exists. Skipping...");
  } else {
    const hashedPassword = await hash("admin123", 10);

    await prisma.users.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        status: "ACCEPTED",
      },
    });

    console.log("✅ Admin created: admin@eazychise.com / admin123");
  }

  const franchiseeEmail = "franchisee@eazychise.com";
  const existingFranchisee = await prisma.users.findUnique({
    where: { email: franchiseeEmail },
  });
  if (existingFranchisee) {
    console.log("Franchisee already exists. Skipping...");
  } else {
    const hashedPassword = await hash("franchisee123", 10);

    await prisma.users.create({
      data: {
        name: "Franchisee",
        email: franchiseeEmail,
        password: hashedPassword,
        role: "FRANCHISEE",
        status: "ACCEPTED",
      },
    });

    console.log(
      "✅ Franchisee created: franchisee@eazychise.com / franchisee123"
    );
  }

  const franchisorEmail = "franchisor@eazychise.com";
  const existingFranchisor = await prisma.users.findUnique({
    where: { email: franchisorEmail },
  });
  if (existingFranchisor) {
    console.log("Franchisor already exists. Skipping...");
  } else {
    const hashedPassword = await hash("franchisor123", 10);

    await prisma.users.create({
      data: {
        name: "Franchisor",
        email: franchisorEmail,
        password: hashedPassword,
        role: "FRANCHISOR",
        status: "ACCEPTED",
      },
    });

    console.log(
      "✅ Franchisor created: franchisor@eazychise.com / franchisor123"
    );
  }
}

const main = async () => {
  await users();
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
