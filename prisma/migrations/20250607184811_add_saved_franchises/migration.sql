-- CreateTable
CREATE TABLE "saved_franchises" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "franchise_id" UUID NOT NULL,

    CONSTRAINT "saved_franchises_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "saved_franchises" ADD CONSTRAINT "saved_franchises_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_franchises" ADD CONSTRAINT "saved_franchises_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchise_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
