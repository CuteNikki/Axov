'use client';

// Utils
import { TodoFilters } from '@/lib/todos';
// Components
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function TodoFiltersBar({ filters, onFiltersChange }: TodoFiltersBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (status: string) => {
    const statuses = status === 'all' ? [] : [status as 'pending' | 'completed' | 'overdue'];
    onFiltersChange({ ...filters, statuses });
  };

  const handlePriorityChange = (priority: string) => {
    const priorities = priority === 'all' ? [] : [parseInt(priority, 10) as 0 | 1 | 2 | 3];
    onFiltersChange({ ...filters, priorities });
  };

  return (
    <div className='flex items-center space-x-4'>
      <Input placeholder='Search...' value={filters.search} onChange={handleSearchChange} className='max-w-xs' />
      <Select onValueChange={handleStatusChange} defaultValue='all'>
        <SelectTrigger className='w-45'>
          <SelectValue placeholder='Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Statuses</SelectItem>
          <SelectItem value='pending'>Pending</SelectItem>
          <SelectItem value='completed'>Completed</SelectItem>
          <SelectItem value='overdue'>Overdue</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={handlePriorityChange} defaultValue='all'>
        <SelectTrigger className='w-45'>
          <SelectValue placeholder='Priority' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Priorities</SelectItem>
          <SelectItem value='null'>None</SelectItem>
          <SelectItem value='0'>Urgent</SelectItem>
          <SelectItem value='1'>High</SelectItem>
          <SelectItem value='2'>Medium</SelectItem>
          <SelectItem value='3'>Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

type TodoFiltersBarProps = {
  filters: TodoFilters;
  onFiltersChange: (filters: TodoFilters) => void;
};
