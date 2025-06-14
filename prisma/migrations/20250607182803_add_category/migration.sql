-- CreateTable
CREATE TABLE "category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_franchise" (
    "id" UUID NOT NULL,
    "franchise_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "category_franchise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "category_franchise" ADD CONSTRAINT "category_franchise_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchise_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_franchise" ADD CONSTRAINT "category_franchise_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
