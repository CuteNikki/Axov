// Libraries
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
// Icons
import { Plus } from 'lucide-react';
// Utils
import { CreateTodoInput, createTodoSchema } from '@/lib/todos';
import { formatDatetimeLocal } from '@/lib/utils';
// Components
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function TodoCreateDialog({ addTodo }: { addTodo: (todo: CreateTodoInput) => void }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      description: null,
      orderIndex: null,
      priority: null,
      dueAt: null,
    },
  });

  const onSubmit = (values: CreateTodoInput) => {
    startTransition(async () => {
      addTodo(values);
      form.reset();
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Fill out the details below to create a new todo.</DialogDescription>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4 py-4'>
              {/* Title */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input required placeholder='Todo title' {...field} />
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
                      <Textarea placeholder='Todo description' {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
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

              {/* Due Date */}
              <FormField
                control={form.control}
                name='dueAt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        {...field}
                        value={field.value ? formatDatetimeLocal(field.value) : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button type='submit' disabled={isPending || !form.formState.isDirty || !form.formState.isValid}>
                {isPending ? 'Creating...' : 'Create Todo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function TodoCreateDialogSkeleton() {
  return (
    <Button disabled>
      <Plus />
      Create
    </Button>
  );
}
