// Icons
import { AlertCircleIcon, CheckCircle2Icon, Clock2Icon, ListTodoIcon } from 'lucide-react';
// Utils
import { getTodoStatus } from '@/lib/utils';
// Types
import { Todo } from '@/generated/client';
// Components
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TodoStatistics({ todos }: { todos: Todo[] }) {
  const stats = {
    total: todos.length,
    completed: todos.filter((t) => getTodoStatus(t).completed).length,
    pending: todos.filter((t) => !getTodoStatus(t).completed).length,
    // dueAt in the past and not completed, in this case we dont want todos that were completed after dueAt to count as overdue
    overdue: todos.filter((t) => t.dueAt && new Date(t.dueAt) < new Date() && !t.completedAt).length,
  };

  const items = [
    { icon: ListTodoIcon, label: 'Total', value: stats.total },
    { icon: CheckCircle2Icon, label: 'Completed', value: stats.completed },
    { icon: Clock2Icon, label: 'Pending', value: stats.pending },
    { icon: AlertCircleIcon, label: 'Overdue', value: stats.overdue },
  ];

  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className='flex flex-row items-center gap-4'>
            <item.icon className='size-6 shrink-0' />
            <div>
              <p className='text-muted-foreground'>{item.label}</p>
              <p className='text-2xl font-semibold tabular-nums'>{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TodoStatisticsSkeleton() {
  const items = [
    { icon: ListTodoIcon, label: 'Total' },
    { icon: CheckCircle2Icon, label: 'Completed' },
    { icon: Clock2Icon, label: 'Pending' },
    { icon: AlertCircleIcon, label: 'Overdue' },
  ];

  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className='flex flex-row items-center gap-4'>
            <item.icon className='size-6 shrink-0' />
            <div>
              <p className='text-muted-foreground'>{item.label}</p>
              <Skeleton className='h-8 w-16' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
