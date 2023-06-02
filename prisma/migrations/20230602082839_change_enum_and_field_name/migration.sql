/*
  Warnings:

  - You are about to drop the column `join_status` on the `Status` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Status` DROP COLUMN `join_status`,
    ADD COLUMN `status` ENUM('ATTEND', 'NOT_ATTEND') NOT NULL DEFAULT 'NOT_ATTEND';
