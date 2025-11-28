-- AlterTable
ALTER TABLE "LibraryItem" ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isView" BOOLEAN NOT NULL DEFAULT false;
