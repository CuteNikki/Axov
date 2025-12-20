'use client';

// Libraries
import { useState } from 'react';
// Icons
import { Plus } from 'lucide-react';
// Hooks
import { useTodos } from '@/hooks/todos';
// Types
import { Todo } from '@/generated/client';
// Components
import { TodoStatistics } from '@/components/todo/statistics';
import { Button } from '@/components/ui/button';
import { TodoList } from '@/components/todo/list';

export default function TodoPage() {
  const { loading, todos, filters, setFilters, addTodo, updateTodo, deleteTodo, toggleComplete, reorderTodos } = useTodos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleCreate = () => {
    setEditingTodo(null);
    setDialogOpen(true);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setDialogOpen(true);
  };

  return (
    <div>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <header className='mb-8'>
          <div className='flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
            <div className='flex flex-col gap-1'>
              <h1 className='text-3xl font-bold'>Todos</h1>
              <p className='text-muted-foreground'>Manage and organize your todos.</p>
            </div>
            <Button>
              <Plus />
              Create
            </Button>
          </div>
        </header>

        <div className='space-y-6'>
          <TodoStatistics todos={todos} />
          {/* <TodoFiltersBar filters={filters} onFiltersChange={setFilters} totalCount={todos.length} filteredCount={filteredTodos.length} /> */}
          <TodoList
            todos={todos}
            onToggleComplete={toggleComplete}
            onUpdate={updateTodo}
            onEdit={handleEdit}
            onDelete={deleteTodo}
            onReorder={reorderTodos}
          />
        </div>
        {/* <TodoDialog open={dialogOpen} onOpenChange={setDialogOpen} todo={editingTodo} onSave={addTodo} onUpdate={updateTodo} /> */}
      </div>
    </div>
  );
}
