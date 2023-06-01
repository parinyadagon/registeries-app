/*
  Warnings:

  - You are about to drop the column `join` on the `Status` table. All the data in the column will be lost.
  - Added the required column `join_status` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Status` DROP COLUMN `join`,
    ADD COLUMN `join_status` ENUM('JOINED', 'NOT_JOINED') NOT NULL;
