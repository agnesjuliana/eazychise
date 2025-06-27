import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const parseCSV = (path: string) => {
  const file = readFileSync(path);
  return parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
};

async function seedUsers() {
  const users = parseCSV("prisma/seed/users.csv");

  for (const user of users) {
    const exists = await prisma.users.findUnique({
      where: { email: user.email },
    });
    if (!exists) {
      const hashedPassword = await hash(user.password, 10);
      await prisma.users.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          status: user.status,
        },
      });
      console.log(`✅ Created user: ${user.email}`);
    } else {
      console.log(`ℹ️ Skipped existing user: ${user.email}`);
    }
  }
}

async function seedCategories() {
  const categories = parseCSV("prisma/seed/category.csv");
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });
  console.log("✅ Seeded categories");
}

async function seedFranchises() {
  const franchises = parseCSV("prisma/seed/franchise_listing.csv");
  await prisma.franchise_listings.createMany({
    data: franchises,
    skipDuplicates: true,
  });
  console.log("✅ Seeded franchise listings");
}

async function seedCategoryFranchise() {
  const links = parseCSV("prisma/seed/category_franchise.csv");
  await prisma.category_franchise.createMany({
    data: links,
    skipDuplicates: true,
  });
  console.log("✅ Seeded category-franchise relations");
}

async function seedListingsHighlights() {
  try {
    const highlights = parseCSV("prisma/seed/listings_highlights.csv").map(
      (row: any) => ({
        id: row.id,
        id_franchise: row.id_franchise,
        title: row.title,
        content: row.content,
      })
    );

    await prisma.listings_highlights.createMany({
      data: highlights,
      skipDuplicates: true,
    });

    console.log("✅ Seeded listings_highlights");
  } catch (error) {
    console.error("❌ Error seeding listings_highlights:", error);
  }
}

async function seedListingDocuments() {
  try {
    const documents = parseCSV("prisma/seed/listing_documents.csv").map(
      (row: any) => ({
        id: row.id,
        id_franchise: row.id_franchise,
        type: row.type, // must match DocumentType enum: PENDUKUNG or GUIDELINES
        name: row.name,
        path: row.path,
      })
    );

    await prisma.listing_documents.createMany({
      data: documents,
      skipDuplicates: true,
    });

    console.log("✅ Seeded listing_documents");
  } catch (error) {
    console.error("❌ Error seeding listing_documents:", error);
  }
}

async function main() {
  await seedUsers();
  await seedCategories();
  await seedFranchises();
  await seedCategoryFranchise();
  await seedListingsHighlights();
  // await seedListingDocuments();
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
