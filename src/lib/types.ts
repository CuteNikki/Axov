export type TodoStatus = 'pending' | 'completed' | 'overdue';
export type TodoPriorityValue = 0 | 1 | 2 | 3 | null;
export type SortField = 'orderIndex' | 'priority' | 'dueAt' | 'createdAt' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface TodoFilters {
  search: string;
  statuses: TodoStatus[];
  priorities: TodoPriorityValue[];
  sortField: SortField;
  sortDirection: SortDirection;
}
