/*
  Warnings:

  - The values [publish,draft] on the enum `Event_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Event` MODIFY `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL;
