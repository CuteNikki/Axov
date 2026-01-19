'use client';

// Hooks
import { useTodos } from '@/hooks/todos';
// Components
import { TodoCreateDialog, TodoCreateDialogSkeleton } from '@/components/todo/create-dialog';
import { TodoFiltersBar } from '@/components/todo/filters-bar';
import { TodoList, TodoListSkeleton } from '@/components/todo/list';
import { TodoStatistics, TodoStatisticsSkeleton } from '@/components/todo/statistics';

export default function TodoPage() {
  const { loading, todos, filters, setFilters, addTodo, updateTodo, deleteTodo, toggleComplete, reorderTodos } = useTodos();

  if (loading) {
    return (
      <main>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <header className='mb-8'>
            <div className='flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
              <div className='flex flex-col gap-1'>
                <h1 className='text-3xl font-bold'>Todos</h1>
                <p className='text-muted-foreground'>Manage and organize your todos.</p>
              </div>
              <TodoCreateDialogSkeleton />
            </div>
          </header>

          <div className='space-y-6'>
            <TodoStatisticsSkeleton />
            <TodoListSkeleton />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <header className='mb-8'>
          <div className='flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
            <div className='flex flex-col gap-1'>
              <h1 className='text-3xl font-bold'>Todos</h1>
              <p className='text-muted-foreground'>Manage and organize your todos.</p>
            </div>
            <TodoCreateDialog addTodo={addTodo} />
          </div>
        </header>

        <div className='space-y-6'>
          <TodoStatistics todos={todos} />
          <TodoFiltersBar filters={filters} onFiltersChange={setFilters} />
          <TodoList todos={todos} onToggleComplete={toggleComplete} onUpdate={updateTodo} onDelete={deleteTodo} onReorder={reorderTodos} />
        </div>
      </div>
    </main>
  );
}
