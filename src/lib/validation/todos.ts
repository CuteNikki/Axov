// Library for validating
import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().trim().max(2055, 'Description is too long').nullable(),
});

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().trim().max(2055, 'Description is too long').nullable(),
  orderIndex: z.number().int().nonnegative('Order index must be non-negative').nullable(),
  priority: z.number().int().min(0, 'Priority must be at least 0').max(3, 'Priority must be at most 3').nullable(),
  dueAt: z.date('Invalid date').nullable(),
  completed: z.boolean().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
