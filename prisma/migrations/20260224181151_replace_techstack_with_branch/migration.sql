/*
  Warnings:

  - You are about to drop the column `tech_stack` on the `teams` table. All the data in the column will be lost.
  - Added the required column `branch` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('CE', 'IT', 'EXTC', 'AI&DS', 'AI&ML', 'MECH');

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "tech_stack",
ADD COLUMN     "branch" "Branch" NOT NULL;

-- DropEnum
DROP TYPE "TechStack";
