-- AlterTable
ALTER TABLE `User` ADD COLUMN `type` ENUM('ORGANIZER', 'USER') NOT NULL DEFAULT 'ORGANIZER';
