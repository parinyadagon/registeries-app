-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `limit_user` INTEGER NOT NULL,
    `preriod_start` DATETIME(3) NOT NULL,
    `preriod_end` DATETIME(3) NOT NULL,
    `status` ENUM('publish', 'draft') NOT NULL,
    `member_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
