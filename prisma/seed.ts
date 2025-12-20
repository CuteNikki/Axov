// Environment
import 'dotenv/config';
// Library
import { PrismaPg } from '@prisma/adapter-pg';
// Generated
import { PrismaClient } from '@/generated/client';
import { TodoCreateInput } from '@/generated/models';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const todoData: (TodoCreateInput & { id: number })[] = [
  {
    id: 1,
    title: 'Pay electricity bill',
    description: 'You gotta pay the bills man',
    priority: 1,
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    orderIndex: 1,
  },
  {
    id: 2,
    title: 'Finish todo app schema',
    priority: 2,
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    orderIndex: 2,
  },
  {
    id: 3,
    title: 'Reply to emails',
    description: 'Mom, boss, and ignore that one spammer',
    priority: 3,
    orderIndex: 3,
  },
  {
    id: 4,
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and fruits',
    priority: 3,
    dueAt: new Date(),
    orderIndex: 4,
  },
  {
    id: 5,
    title: 'Book dentist appointment',
    priority: 2,
    orderIndex: 5,
  },
  {
    id: 6,
    title: 'Clean desk',
    orderIndex: 6,
  },
  {
    id: 7,
    title: 'Submit tax documents',
    priority: 1,
    dueAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    orderIndex: 7,
  },
  {
    id: 8,
    title: 'Read Prisma docs',
    description: 'https://www.prisma.io/docs',
    priority: 0,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    orderIndex: 8,
  },
];
export async function main() {
  for (const t of todoData) {
    await prisma.todo.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
}

main();
