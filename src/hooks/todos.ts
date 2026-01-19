'use client';

// Libraries
import { useCallback, useEffect, useState } from 'react';
// Actions
import { createTodo, deleteTodo as deleteTodoAction, getTodos, updateTodo as updateTodoAction } from '@/actions/todos';
// Types
import { Todo } from '@/generated/client';
import { CreateTodoInput, TodoFilters, UpdateTodoInput } from '@/lib/todos';

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

  const updateTodo = useCallback(
    async (id: number, updates: Partial<UpdateTodoInput>) => {
      const previousTodos = todos;
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...updates, updatedAt: new Date(), completedAt: updates.completed ? new Date() : null } : todo)),
      );

      const { success } = await updateTodoAction(id, updates);

      if (!success) {
        setTodos(previousTodos);
        alert('Failed to update todo. Please try again.');
      }
    },
    [todos],
  );

  const deleteTodo = useCallback(
    async (id: number) => {
      const previousTodos = todos;
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      const { success } = await deleteTodoAction(id);

      if (!success) {
        setTodos(previousTodos);
        alert('Failed to delete todo. Please try again.');
      }
    },
    [todos],
  );

  const toggleComplete = useCallback(
    (id: number) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const completed = !todo.completedAt;

      updateTodo(id, { ...todo, completed });
    },
    [todos, updateTodo],
  );

  const reorderTodos = useCallback(
    async (activeId: number, overId: number) => {
      const previousTodos = todos;
      const newTodos: Todo[] = [];

      setTodos((prev) => {
        const oldIndex = prev.findIndex((t) => t.id === activeId);
        const newIndex = prev.findIndex((t) => t.id === overId);

        if (oldIndex === -1 || newIndex === -1) return prev;

        const reordered = [...prev];
        const [removed] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, removed);

        newTodos.push(...reordered);

        return reordered.map((todo, index) => ({
          ...todo,
          orderIndex: index,
          updatedAt: new Date(),
        }));
      });

      try {
        for (const [index, todo] of newTodos.entries()) {
          const { success } = await updateTodoAction(todo.id, { ...todo, orderIndex: index });
          if (!success) {
            throw new Error('Failed to reorder todos.');
          }
        }
      } catch (error) {
        console.error(error);
        setTodos(previousTodos);
        alert('Failed to reorder todos. Please try again.');
      }
    },
    [todos],
  );

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
