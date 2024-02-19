/*
  Warnings:

  - You are about to drop the column `gender_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `gender_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `genders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_gender_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_gender_id_fkey`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `gender_id`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `gender_id`,
    ADD COLUMN `gender` ENUM('male', 'female') NULL;

-- DropTable
DROP TABLE `genders`;
