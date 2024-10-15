-- CreateTable
CREATE TABLE "Nullifier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nullifier" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Tree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tree" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Nullifier_nullifier_key" ON "Nullifier"("nullifier");
