/*
  Warnings:

  - You are about to drop the column `answerData` on the `surveyResponses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "submitions" ADD COLUMN     "answerData" JSONB;

-- AlterTable
ALTER TABLE "surveyResponses" DROP COLUMN "answerData";
