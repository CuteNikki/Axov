// Icons
import { AlertCircleIcon, CheckCircle2Icon, Clock2Icon, ListTodoIcon } from 'lucide-react';
// Types
import { Todo } from '@/generated/client';
// Utils
import { getTodoStatus } from '@/lib/utils';
// Components
import { Card, CardContent } from '@/components/ui/card';

export function TodoStatistics({ todos }: { todos: Todo[] }) {
  const stats = {
    total: todos.length,
    completed: todos.filter((t) => getTodoStatus(t) === 'completed').length,
    pending: todos.filter((t) => getTodoStatus(t) === 'pending').length,
    overdue: todos.filter((t) => getTodoStatus(t) === 'overdue').length,
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
