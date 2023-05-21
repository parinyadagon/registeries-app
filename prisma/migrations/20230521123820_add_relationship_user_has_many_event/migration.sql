-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
