/*
  Warnings:

  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `shipment_fee` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullname` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `shipment_fee` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    ADD COLUMN `fullname` VARCHAR(191) NOT NULL;
