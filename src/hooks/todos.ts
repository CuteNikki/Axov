'use client';

// Libraries
import { useCallback, useEffect, useState } from 'react';
// Actions
import { createTodo, deleteTodo as deleteTodoAction, getTodos } from '@/actions/todos';
// Types
import { Todo } from '@/generated/client';
import { CreateTodoInput, TodoFilters } from '@/lib/todos';

export function useTodos() {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<TodoFilters>({
    search: '',
    statuses: [],
    priorities: [],
    sortField: 'orderIndex',
    sortDirection: 'asc',
  });

  useEffect(() => {
    // Initial fetch of todos
    getTodos(filters).then((fetchedTodos) => {
      setTodos(fetchedTodos);
      setLoading(false);
    });
  }, [filters]);

  const addTodo = useCallback(async (todo: CreateTodoInput) => {
    const result = await createTodo(todo);

    if (!result?.success || !result.todo) {
      return;
    }

    setTodos((prev) => [...prev, result.todo]);
  }, []);

  const updateTodo = useCallback((id: number, updates: Partial<Todo>) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo)));
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    const result = await deleteTodoAction(id);

    if (result?.success) {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }
  }, []);

  const toggleComplete = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completedAt: todo.completedAt ? null : new Date(),
              updatedAt: new Date(),
            }
          : todo,
      ),
    );
  }, []);

  const reorderTodos = useCallback((activeId: number, overId: number) => {
    setTodos((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === activeId);
      const newIndex = prev.findIndex((t) => t.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newTodos = [...prev];
      const [removed] = newTodos.splice(oldIndex, 1);
      newTodos.splice(newIndex, 0, removed);

      return newTodos.map((todo, index) => ({
        ...todo,
        orderIndex: index,
        updatedAt: new Date(),
      }));
    });
  }, []);

  return {
    loading,
    todos,
    filters,
    setFilters,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    reorderTodos,
  };
}
