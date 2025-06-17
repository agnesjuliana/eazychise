import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function truncateAll() {
  await prisma.$transaction([
    prisma.category_franchise.deleteMany(),
    prisma.saved_franchises.deleteMany(),
    prisma.listings_highlights.deleteMany(),
    prisma.listing_documents.deleteMany(),
    prisma.franchise_purchases.deleteMany(),
    prisma.funding_request.deleteMany(),
    prisma.franchise_listings.deleteMany(),
    prisma.franchisor_profiles.deleteMany(),
    prisma.user_notifications.deleteMany(),
    prisma.category.deleteMany(),
    prisma.events.deleteMany(),
    prisma.users.deleteMany(),
  ]);

  console.log("✅ All tables truncated.");
}

truncateAll()
  .catch((e) => {
    console.error("❌ Error truncating:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
