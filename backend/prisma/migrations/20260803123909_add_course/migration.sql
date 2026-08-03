-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('FALL', 'SPRING', 'SUMMER');

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "localCredit" INTEGER NOT NULL,
    "ects" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" "Semester" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
