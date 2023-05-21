/*
  Warnings:

  - You are about to drop the column `preriod_end` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `preriod_start` on the `Event` table. All the data in the column will be lost.
  - Added the required column `period_end` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period_start` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `preriod_end`,
    DROP COLUMN `preriod_start`,
    ADD COLUMN `period_end` DATETIME(3) NOT NULL,
    ADD COLUMN `period_start` DATETIME(3) NOT NULL;
