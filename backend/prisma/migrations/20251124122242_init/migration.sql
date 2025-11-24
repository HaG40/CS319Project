/*
  Warnings:

  - You are about to drop the column `age` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `line` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `tel` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "age",
DROP COLUMN "line",
DROP COLUMN "tel";
