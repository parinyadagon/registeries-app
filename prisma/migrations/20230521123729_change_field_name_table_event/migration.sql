/*
  Warnings:

  - You are about to drop the column `member_id` on the `Event` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `member_id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;
