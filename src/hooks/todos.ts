'use client';

// Libraries
import { useCallback, useEffect, useState } from 'react';
// Actions
import { getTodos } from '@/actions/todos';
// Types
import { Todo } from '@/generated/client';
import { TodoFilters } from '@/lib/types';

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

  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    setTodos((prev) => {
      const newTodo: Todo = {
        ...todo,
        id: Math.max(...prev.map((t) => t.id), 0) + 1,
        orderIndex: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Shift all existing todos' orderIndex by 1
      const shifted = prev.map((t) => ({
        ...t,
        orderIndex: (t.orderIndex ?? 0) + 1,
      }));
      return [newTodo, ...shifted];
    });
  }, []);

  const updateTodo = useCallback((id: number, updates: Partial<Todo>) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo)));
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
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
