/*
  Warnings:

  - A unique constraint covering the columns `[code_verify]` on the table `Status` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Status_code_verify_key` ON `Status`(`code_verify`);
