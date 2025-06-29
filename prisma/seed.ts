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

function encodeImage(path: string) {
  const imageBuffer = readFileSync(path);
  return imageBuffer.toString("base64");
}

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

async function seedProfiles() {
  try {
    const profiles = parseCSV("prisma/seed/franchisor_profiles.csv");
    const ktp = encodeImage("prisma/seed/images/ktp.png");
    const fotoDiri = encodeImage("prisma/seed/images/foto_diri.png");

    for (const profile of profiles) {
      const exists = await prisma.franchisor_profiles.findUnique({
        where: { user_id: profile.user_id },
      });
      if (!exists) {
        await prisma.franchisor_profiles.create({
          data: {
            id: profile.id,
            user_id: profile.user_id,
            ktp: ktp,
            foto_diri: fotoDiri,
          },
        });
      }
    }

    console.log("✅ Seeded franchisor profiles");
  } catch (error) {
    console.error("❌ Error seeding profiles:", error);
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
    type HighlightRow = {
      id: string;
      id_franchise: string;
      title: string;
      content: string;
    };

    const highlights = parseCSV("prisma/seed/listings_highlights.csv").map(
      (row: HighlightRow) => ({
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
    type DocumentRow = {
      id: string;
      id_franchise: string;
      type: string; // should match DocumentType enum
      name: string;
      path: string;
    };

    const documents = parseCSV("prisma/seed/listing_documents.csv").map(
      (row: DocumentRow) => ({
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

async function seedFranchisePurchases() {
  const purchases = parseCSV("prisma/seed/franchise_purchases.csv");

  for (const purchase of purchases) {
    const exists = await prisma.franchise_purchases.findUnique({
      where: { id: purchase.id },
    });

    if (!exists) {
      await prisma.franchise_purchases.create({
        data: {
          id: purchase.id,
          user_id: purchase.user_id,
          franchise_id: purchase.franchise_id,
          purchase_type: purchase.purchase_type,
          confirmation_status: purchase.confirmation_status,
          payment_status: purchase.payment_status,
          paid_at: purchase.paid_at ? new Date(purchase.paid_at) : null,
        },
      });
      console.log(`✅ Created purchase: ${purchase.id}`);
    } else {
      console.log(`ℹ️ Skipped existing purchase: ${purchase.id}`);
    }
  }
}

async function seedFundingRequests() {
  const requests = parseCSV("prisma/seed/funding_request.csv");

  for (const request of requests) {
    const exists = await prisma.funding_request.findUnique({
      where: { purchase_id: request.purchase_id },
    });

    if (!exists) {
      await prisma.funding_request.create({
        data: {
          id: request.id,
          purchase_id: request.purchase_id,
          confirmation_status: request.confirmation_status,
          address: request.address,
          phone_number: request.phone_number,
          npwp: request.npwp,
          franchise_address: request.franchise_address,
          ktp: request.ktp,
          foto_diri: request.foto_diri,
          foto_lokasi: request.foto_lokasi,
          mou_franchisor: request.mou_franchisor,
          mou_modal: request.mou_modal,
        },
      });
      console.log(`✅ Created funding request: ${request.purchase_id}`);
    } else {
      console.log(
        `ℹ️ Skipped existing funding request: ${request.purchase_id}`
      );
    }
  }
}

async function main() {
  await seedUsers();
  await seedProfiles();
  await seedCategories();
  await seedFranchises();
  await seedCategoryFranchise();
  await seedListingsHighlights();
  await seedListingDocuments();
  await seedFranchisePurchases();
  await seedFundingRequests();
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
