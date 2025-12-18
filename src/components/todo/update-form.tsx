'use client';

// Libraries
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
// Actions
import { updateTodo } from '@/actions/todos';
// Utils & Validation
import { formatDatetimeLocal } from '@/lib/utils';
import { updateTodoSchema, type UpdateTodoInput } from '@/lib/validation/todos';
// Components
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface TodoUpdateFormProps {
  title: string;
  description: string | null;
  orderIndex: number | null;
  priority: number | null;
  dueAt: Date | null;
  completedAt: Date | null;
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export function TodoUpdateForm({ title, description, orderIndex, priority, dueAt, completedAt, id }: TodoUpdateFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateTodoInput>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      title: title,
      description: description,
      orderIndex: orderIndex,
      priority: priority,
      dueAt: dueAt,
      completed: completedAt ? true : false,
    },
  });

  const onSubmit = (values: UpdateTodoInput) => {
    startTransition(async () => {
      await updateTodo(id, values);
      form.reset(values);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-lg'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle>Edit Task</CardTitle>
            <CardDescription>Change the details below to update this todo.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Description' {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col gap-4 md:flex-row'>
              {/* Priority */}
              <div className='flex-1'>
                <FormField
                  control={form.control}
                  name='priority'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : 'none'}
                        onValueChange={(value) => field.onChange(value === 'none' ? null : Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-secondary'>
                            <SelectValue placeholder='Select priority' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='0'>Urgent</SelectItem>
                          <SelectItem value='1'>High</SelectItem>
                          <SelectItem value='2'>Medium</SelectItem>
                          <SelectItem value='3'>Low</SelectItem>
                          <SelectItem value='none'>No Priority</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Due date */}
              <div className='flex-1'>
                <FormField
                  control={form.control}
                  name='dueAt'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due date</FormLabel>
                      <FormControl>
                        <Input
                          type='datetime-local'
                          value={field.value ? formatDatetimeLocal(field.value) : ''}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Completed */}
            <FormField
              control={form.control}
              name='completed'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completed</FormLabel>
                  <div className='flex flex-row items-center gap-2'>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <span className='cursor-pointer select-none' onClick={() => field.onChange(!field.value)}>
                      {completedAt ? `Completed (at ${completedAt?.toLocaleString()})` : 'Not completed'}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          {/* Submit */}
          <CardFooter className='justify-end'>
            <CardAction>
              <Button type='submit' disabled={isPending || !form.formState.isDirty}>
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
