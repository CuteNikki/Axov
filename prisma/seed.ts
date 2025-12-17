// Environment
import 'dotenv/config';
// Library
import { PrismaPg } from '@prisma/adapter-pg';
// Generated
import { PrismaClient } from '@/generated/client';
import { TodoCreateInput } from '@/generated/models';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const todoData: TodoCreateInput[] = [
  {
    title: 'Pay electricity bill',
    priority: 1,
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    orderIndex: 1,
  },
  {
    title: 'Finish todo app schema',
    priority: 2,
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    orderIndex: 2,
  },
  {
    title: 'Reply to emails',
    priority: 3,
    orderIndex: 3,
  },
  {
    title: 'Buy groceries',
    priority: 3,
    dueAt: new Date(),
    orderIndex: 4,
  },
  {
    title: 'Book dentist appointment',
    priority: 2,
    orderIndex: 5,
  },
  {
    title: 'Clean desk',
    orderIndex: 6,
  },
  {
    title: 'Submit tax documents',
    priority: 1,
    dueAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    orderIndex: 7,
  },
  {
    title: 'Read Prisma docs',
    priority: 4,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    orderIndex: 8,
  },
];

export async function main() {
  // Seed todos
  for (const t of todoData) {
    const existing = await prisma.todo.findFirst({ where: { title: t.title } });
    if (existing) continue;
    await prisma.todo.create({ data: t });
  }
}

main();
