/*
  Warnings:

  - Added the required column `total_weight` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carts` ADD COLUMN `total_weight` DOUBLE NOT NULL;
