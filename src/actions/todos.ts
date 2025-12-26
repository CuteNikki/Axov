'use server';

// Libraries
import { revalidatePath } from 'next/cache';
// Database
import prisma from '@/lib/prisma';
// Utils
import { CreateTodoInput, createTodoSchema, filterTodoSchema, TodoFilters, UpdateTodoInput } from '@/lib/todos';

/**
 * Fetch todos with optional filters
 * @param filters Optional filters to apply
 * @returns List of todos
 */
export async function getTodos(filters?: TodoFilters) {
  const parsed = filterTodoSchema.safeParse(filters);

  if (filters && !parsed.success) {
    console.error('Invalid todo filters:', parsed.error);
    return [];
  }

  const { search, statuses, priorities, sortField, sortDirection } = parsed.data || {};

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
              // Filter out nulls for the query
              in: priorities.filter((p) => p !== null),
            },
          }
        : {}),
    },

    // Sorting
    orderBy: {
      // Sort by orderIndex by default else use provided sortField
      [sortField || 'orderIndex']: sortDirection,
    },
  });
}

/**
 * Create a new todo
 * @param values Values for the new todo
 * @returns Result of the creation
 */
export async function createTodo(values: CreateTodoInput) {
  const parsed = createTodoSchema.safeParse(values);

  // Validation failed, provided values are invalid
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors, created: null };
  }

  const created = await prisma.todo.create({
    data: parsed.data,
  });

  revalidatePath('/');
  return { success: true, errors: null, todo: created };
}

/**
 * Delete a todo by ID
 * @param id ID of the todo to delete
 * @returns Deleted todo
 */
export async function deleteTodo(id: number) {
  const result = await prisma.todo.delete({
    where: { id },
  });

  if (!result) {
    return { success: false, todo: null };
  }

  revalidatePath('/todos');
  return { success: true, todo: result };
}

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
