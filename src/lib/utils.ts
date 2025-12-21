// Libraries
import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
// Types
import { Todo } from '@/generated/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PRIORITIES = [
  { value: null, label: 'No Priority', backgroundColor: 'bg-muted!' },
  { value: 0, label: 'Urgent', backgroundColor: 'bg-red-600!' },
  { value: 1, label: 'High', backgroundColor: 'bg-orange-600!' },
  { value: 2, label: 'Medium', backgroundColor: 'bg-yellow-600!' },
  { value: 3, label: 'Low', backgroundColor: 'bg-green-600!' },
] as const;

export function formatDatetimeLocal(date?: Date | string) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function getTodoStatus(todo: Todo) {
  return {
    completed: todo.completedAt !== null,
    // dueAt in the past and not completed and completed after dueAt
    overdue: todo.dueAt !== null && new Date(todo.dueAt) < new Date() && (!todo.completedAt || new Date(todo.completedAt) > new Date(todo.dueAt)),
  };
}

export function getPriorityColor(priority: number | null): string {
  return PRIORITIES.find((p) => p.value === priority)?.backgroundColor || 'bg-muted!';
}

export function getPriorityLabel(priority: number | null): string {
  return PRIORITIES.find((p) => p.value === priority)?.label || 'No Priority';
}

export function formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeDate(date: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Check if time is set (not end of day)
  const hasTime = d.getHours() !== 23 || d.getMinutes() !== 59;
  const timeStr = hasTime ? ` at ${format(d, 'HH:mm')}` : '';

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return `Today${timeStr}`;
  if (diffDays === 1) return `Tomorrow${timeStr}`;
  if (diffDays < 7) return `In ${diffDays} days${timeStr}`;
  return format(d, hasTime ? "MMM d 'at' HH:mm" : 'MMM d, yyyy');
}
