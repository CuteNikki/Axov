-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "orderIndex" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER,
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Todo_orderIndex_idx" ON "Todo"("orderIndex");

-- CreateIndex
CREATE INDEX "Todo_dueAt_idx" ON "Todo"("dueAt");

-- CreateIndex
CREATE INDEX "Todo_completedAt_idx" ON "Todo"("completedAt");
