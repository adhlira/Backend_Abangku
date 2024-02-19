/*
  Warnings:

  - Added the required column `rating` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `rating` DOUBLE NOT NULL;
