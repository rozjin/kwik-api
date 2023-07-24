-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "blocked" BOOLEAN,
    "paused" BOOLEAN,
    "email" VARCHAR(255) NOT NULL,
    "email_verified" BOOLEAN NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "phone_verified" BOOLEAN NOT NULL,
    "picture" VARCHAR(255),
    "address" TEXT NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "country" VARCHAR(3) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "mfa_methods" TEXT[],
    "backup_mfa_methods" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QRCode" (
    "id" SERIAL NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "desc" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "friendly_id" VARCHAR(12) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "desc" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_friendly_id_key" ON "Transfer"("friendly_id");

-- AddForeignKey
ALTER TABLE "QRCode" ADD CONSTRAINT "QRCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

