'use server';

// Libraries
import { revalidatePath } from 'next/cache';
// Database
import prisma from '@/lib/prisma';
// Validation
import { CreateTodoInput, createTodoSchema, UpdateTodoInput, updateTodoSchema } from '@/lib/validation/todos';

export async function getTodos() {
  return prisma.todo.findMany({
    orderBy: { orderIndex: 'asc' },
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

export async function updateTodo(id: number, values: UpdateTodoInput): Promise<UpdateTodoResult> {
  const parsed = updateTodoSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.todo.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      orderIndex: parsed.data.orderIndex,
      priority: parsed.data.priority,
      dueAt: parsed.data.dueAt,
      completedAt: parsed.data.completed ? new Date() : null,
    },
  });
  revalidatePath('/todos');
  return { success: true };
}
