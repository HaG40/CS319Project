/*
  Warnings:

  - Added the required column `age` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `line` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tel` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "line" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "tel" TEXT NOT NULL;
