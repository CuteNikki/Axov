'use client';

// Libraries
import { format } from 'date-fns';
import { Calendar, Check, Clock, GripVertical, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
// Types
import { Todo } from '@/generated/client';
// Utils
import { cn, formatRelativeDate, getPriorityColor, getPriorityLabel, getTodoStatus } from '@/lib/utils';
// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function TodoItem({ todo, onToggleComplete, onUpdate, onEdit, onDelete, isDragging, dragHandleProps }: TodoItemProps) {
  const { completed: isCompleted, overdue: isOverdue } = getTodoStatus(todo);

  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isDateOpen, setIsDateOpen] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate(todo.id, { title: editTitle.trim() });
    } else {
      setEditTitle(todo.title);
    }
    if (titleInputRef.current) {
      titleInputRef.current.blur();
    }
  };

  const handleDescriptionSave = () => {
    const newDesc = editDescription.trim() || null;
    if (newDesc !== todo.description) {
      onUpdate(todo.id, { description: newDesc });
    }
    if (descriptionInputRef.current) {
      descriptionInputRef.current.blur();
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(todo.title);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !e.shiftKey) {
      setEditDescription(todo.description || '');
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      handleDescriptionSave();
    }
  };

  const handlePriorityChange = (value: string) => {
    const priority = value === 'none' ? null : Number.parseInt(value);
    onUpdate(todo.id, { priority });
  };

  const clearDueDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(todo.id, { dueAt: null });
  };

  return (
    <Card className={cn('group transition-all', isDragging && 'ring-primary opacity-50 shadow-lg ring-2', isCompleted && 'opacity-60')}>
      <CardContent className='flex flex-row items-center justify-between gap-2'>
        <div className='flex flex-1 flex-row items-center gap-4'>
          <Checkbox
            aria-label={`todo-complete-${todo.id}`}
            checked={isCompleted}
            onCheckedChange={() => onToggleComplete(todo.id)}
            className='size-6 shrink-0 rounded-full border-2'
          />
          <div className='flex flex-1 flex-col'>
            <div className='flex-1'>
              <div className='relative'>
                <input
                  aria-label={`todo-title-${todo.id}`}
                  ref={titleInputRef}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleTitleKeyDown}
                  className={cn(
                    'hover:bg-accent focus:bg-accent block w-full truncate rounded-sm bg-transparent p-1 text-base leading-tight font-medium outline-none',
                    isCompleted && 'text-muted-foreground line-through',
                  )}
                />
              </div>

              {todo.description && (
                <div className='pt-1 pb-1'>
                  <textarea
                    aria-label={`todo-description-${todo.id}`}
                    ref={descriptionInputRef}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    onBlur={handleDescriptionSave}
                    onKeyDown={handleDescriptionKeyDown}
                    rows={Math.max(1, (editDescription || '').split('\n').length)}
                    className={cn(
                      'text-muted-foreground hover:bg-accent focus:bg-accent block w-full resize-none truncate rounded-sm bg-transparent p-1 text-sm leading-tight outline-none',
                      !editDescription && 'italic opacity-50',
                    )}
                  />
                </div>
              )}
            </div>

            <div className='flex flex-wrap items-center gap-4 pt-3'>
              <Select value={todo.priority?.toString() ?? 'none'} onValueChange={handlePriorityChange}>
                <SelectTrigger
                  aria-label={`todo-priority-${todo.id}`}
                  className={cn('[&>svg]:text-foreground! h-auto w-auto gap-1 px-2 py-0 [&>svg]:opacity-100!', getPriorityColor(todo.priority))}
                >
                  <Badge variant='outline' className='border-none p-0'>
                    {getPriorityLabel(todo.priority)}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='0'>
                    <span className='flex items-center gap-2'>
                      <span className={cn('h-2 w-2 rounded-full', getPriorityColor(0))} />
                      {getPriorityLabel(0)}
                    </span>
                  </SelectItem>
                  <SelectItem value='1'>
                    <span className='flex items-center gap-2'>
                      <span className={cn('h-2 w-2 rounded-full', getPriorityColor(1))} />
                      {getPriorityLabel(1)}
                    </span>
                  </SelectItem>
                  <SelectItem value='2'>
                    <span className='flex items-center gap-2'>
                      <span className={cn('h-2 w-2 rounded-full', getPriorityColor(2))} />
                      {getPriorityLabel(2)}
                    </span>
                  </SelectItem>
                  <SelectItem value='3'>
                    <span className='flex items-center gap-2'>
                      <span className={cn('h-2 w-2 rounded-full', getPriorityColor(3))} />
                      {getPriorityLabel(3)}
                    </span>
                  </SelectItem>
                  <SelectItem value='none'>
                    <span className='flex items-center gap-2'>
                      <span className={cn('h-2 w-2 rounded-full', getPriorityColor(null))} />
                      {getPriorityLabel(null)}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  {(todo.dueAt || !isCompleted) && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className={cn(
                        'group/due-date inline-flex cursor-pointer items-center gap-1 text-xs transition-opacity hover:opacity-80',
                        isOverdue && 'text-destructive',
                        !isOverdue && todo.dueAt && 'text-muted-foreground',
                        !todo.dueAt && 'text-muted-foreground opacity-60',
                      )}
                    >
                      {isOverdue ? <Clock className='h-3 w-3' /> : <Calendar className='h-3 w-3' />}
                      <span>
                        {todo.dueAt
                          ? isOverdue && isCompleted
                            ? `was due ${format(todo.dueAt, 'MMM d HH:mm')}`
                            : formatRelativeDate(todo.dueAt)
                          : 'Set due date'}
                      </span>
                      {todo.dueAt && (
                        <X
                          className='hover:text-destructive ml-0.5 h-3 w-3 opacity-0 transition-opacity group-hover/due-date:opacity-60 hover:opacity-100!'
                          onClick={clearDueDate}
                        />
                      )}
                    </Button>
                  )}
                </PopoverTrigger>
                <PopoverContent className='w-auto' align='start'>
                  <span>@todo: add calendar here</span>
                </PopoverContent>
              </Popover>

              {isCompleted && (
                <div className='text-status-completed flex items-center gap-1 text-xs'>
                  <Check className='h-3 w-3' />
                  <span>Completed {todo.completedAt && format(todo.completedAt, 'MMM d HH:mm')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col-reverse items-center gap-2 sm:flex-row'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8 shrink-0 transition-opacity group-hover:opacity-100 lg:opacity-0'>
                <MoreHorizontal />
                <span className='sr-only'>Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onEdit(todo)}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(todo.id)} variant='destructive'>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Draggable area */}
          <div {...dragHandleProps} className='text-muted-foreground cursor-grab touch-none'>
            <GripVertical className='size-6 shrink-0' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
