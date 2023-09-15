-- CreateTable
CREATE TABLE "Payee" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "picture" VARCHAR(255),

    CONSTRAINT "Payee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payee_email_key" ON "Payee"("email");

-- AddForeignKey
ALTER TABLE "Payee" ADD CONSTRAINT "Payee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
