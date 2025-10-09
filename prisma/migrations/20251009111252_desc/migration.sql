-- CreateTable
CREATE TABLE "surveyData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT,
    "rating" INTEGER,
    "location" TEXT,
    "reviewDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surveyData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "surveyData_userId_idx" ON "surveyData"("userId");

-- CreateIndex
CREATE INDEX "surveyData_createdAt_idx" ON "surveyData"("createdAt");

-- AddForeignKey
ALTER TABLE "surveyData" ADD CONSTRAINT "surveyData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
