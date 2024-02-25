/*
  Warnings:

  - You are about to drop the column `shipment_fee` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `shipment_fee` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_items` DROP COLUMN `shipment_fee`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `shipment_fee` DOUBLE NOT NULL;
