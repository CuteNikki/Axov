'use server';

// Libraries
import { revalidatePath } from 'next/cache';
// Database
import prisma from '@/lib/prisma';
// Types
import { TodoFilters, TodoPriorityValue } from '@/lib/types';
// Utils
import { CreateTodoInput, createTodoSchema, UpdateTodoInput } from '@/lib/validation/todos';

/**
 * Get statistics about todos
 * @returns An object containing total, completed, pending, and overdue todo counts
 */
export async function getTodoStats() {
  // Raw SQL implementation for performance:
  // const [row] = await prisma.$queryRaw<
  //   Array<{
  //     total: number;
  //     completed: number;
  //     pending: number;
  //     overdue: number;
  //   }>
  // >`
  //   SELECT
  //     COUNT(*) AS total,
  //     COUNT("completedAt") AS completed,
  //     SUM(CASE WHEN "completedAt" IS NULL THEN 1 ELSE 0 END) AS pending,
  //     SUM(CASE
  //       WHEN "completedAt" IS NULL AND "dueAt" < NOW()
  //       THEN 1 ELSE 0 END
  //     ) AS overdue
  //   FROM "Todo"
  // `;

  // return row;

  // Original implementation without raw SQL:
  const [total, completed, pending, overdue] = await Promise.all([
    prisma.todo.count(),
    prisma.todo.count({ where: { completedAt: { not: null } } }),
    prisma.todo.count({ where: { completedAt: null } }),
    prisma.todo.count({
      where: {
        completedAt: null,
        dueAt: { lt: new Date() },
      },
    }),
  ]);

  return { total, completed, pending, overdue };
}

export async function getTodos(filters?: TodoFilters) {
  const { search, statuses, priorities, sortField, sortDirection } = filters || {};

  return prisma.todo.findMany({
    where: {
      // Text search
      ...(search?.trim()
        ? {
            OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }],
          }
        : {}),

      // Status filter
      ...(statuses?.length
        ? {
            OR: statuses.map((status) => {
              switch (status) {
                case 'completed':
                  return { completedAt: { not: null } };

                case 'pending':
                  return {
                    completedAt: null,
                    OR: [{ dueAt: null }, { dueAt: { gte: new Date() } }],
                  };

                case 'overdue':
                  return {
                    completedAt: null,
                    dueAt: { lt: new Date() },
                  };
              }
            }),
          }
        : {}),

      // Priority filter
      ...(priorities?.length
        ? {
            priority: {
              in: priorities.filter((p): p is Exclude<TodoPriorityValue, null> => p !== null),
            },
          }
        : {}),
    },

    // Sorting
    orderBy: {
      [sortField || 'orderIndex']: sortDirection,
    },
  });
}

export async function createTodo(values: CreateTodoInput) {
  const parsed = createTodoSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.todo.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
    },
  });
  revalidatePath('/');
  return { success: true };
}

export type UpdateTodoResult = { success: true } | { success: false; errors: Record<string, string[]> };

export async function updateTodo(id: number, values: UpdateTodoInput) {
  // const parsed = updateTodoSchema.safeParse(values);

  // if (!parsed.success) {
  //   return { success: false, errors: parsed.error.flatten().fieldErrors };
  // }

  // await prisma.todo.update({
  //   where: { id },
  //   data: {
  //     title: parsed.data.title,
  //     description: parsed.data.description,
  //     orderIndex: parsed.data.orderIndex,
  //     priority: parsed.data.priority,
  //     dueAt: parsed.data.dueAt,
  //     completedAt: parsed.data.completed ? new Date() : null,
  //   },
  // });
  revalidatePath('/todos');
  return { success: true, id, values };
}
