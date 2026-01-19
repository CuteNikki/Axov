// Library for validating
import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().trim().max(2055, 'Description is too long').nullable(),
  orderIndex: z.number().int().nonnegative('Order index must be non-negative').nullable(),
  priority: z.number().int().min(0, 'Priority must be at least 0').max(3, 'Priority must be at most 3').nullable(),
  dueAt: z.date('Invalid due date').nullable(),
});

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().trim().max(2055, 'Description is too long').nullable(),
  orderIndex: z.number().int().nonnegative('Order index must be non-negative').nullable(),
  priority: z.number().int().min(0, 'Priority must be at least 0').max(3, 'Priority must be at most 3').nullable(),
  dueAt: z.date('Invalid due date').nullable(),
  completed: z.boolean().optional(),
});

export const filterTodoSchema = z.object({
  search: z.string().trim(),
  statuses: z.array(z.enum(['pending', 'completed', 'overdue'])),
  priorities: z.array(z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.null()])),
  sortField: z.enum(['orderIndex', 'priority', 'dueAt', 'createdAt', 'title']),
  sortDirection: z.enum(['asc', 'desc']),
});

export type SortField = z.infer<typeof filterTodoSchema>['sortField'];
export type SortDirection = z.infer<typeof filterTodoSchema>['sortDirection'];
export type StatusFilter = z.infer<typeof filterTodoSchema>['statuses'];
export type PriorityFilter = z.infer<typeof filterTodoSchema>['priorities'];

export type TodoFilters = z.infer<typeof filterTodoSchema>;

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
