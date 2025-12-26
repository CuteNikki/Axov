'use client';

// Libraries
import { ClipboardList } from 'lucide-react';
import { useCallback } from 'react';
// DnD Kit
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// Types
import { Todo } from '@/generated/client';
// Components
import { TodoItem } from '@/components/todo/item';

interface SortableTodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

function SortableTodoItem({ todo, onToggleComplete, onUpdate, onEdit, onDelete }: SortableTodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TodoItem
        todo={todo}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
        dragHandleProps={listeners}
      />
    </div>
  );
}

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onReorder: (activeId: number, overId: number) => void;
}

export function TodoList({ todos, onToggleComplete, onUpdate, onEdit, onDelete, onReorder }: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        onReorder(active.id as number, over.id as number);
      }
    },
    [onReorder],
  );

  if (todos.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <div className='bg-secondary mb-4 rounded-full p-4'>
          <ClipboardList className='text-muted-foreground h-8 w-8' />
        </div>
        <h3 className='mb-1 text-lg font-medium'>No tasks found</h3>
        <p className='text-muted-foreground text-sm'>Create a new task or adjust your filters</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className='space-y-2'>
          {todos.map((todo) => (
            <SortableTodoItem key={todo.id} todo={todo} onToggleComplete={onToggleComplete} onUpdate={onUpdate} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function TodoListSkeleton() {
  return (
    <div className='space-y-2'>
      {[...Array(8)].map((_, index) => (
        <div key={index} className={`bg-card ring-foreground/10 animate-pulse rounded-xl ring-1 ${index % 2 === 1 ? 'h-32' : 'h-25'}`} />
      ))}
    </div>
  );
}
