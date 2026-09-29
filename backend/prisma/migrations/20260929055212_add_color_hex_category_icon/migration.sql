-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "icon" TEXT NOT NULL DEFAULT 'tag';

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "hexCode" TEXT NOT NULL DEFAULT '#000000';
