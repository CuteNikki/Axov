'use client';

// Icons
import { ArrowUpDown, Search, SlidersHorizontal, X } from 'lucide-react';
// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { PriorityFilter, SortDirection, SortField, StatusFilter, TodoFilters } from '@/lib/todos';
import { getPriorityLabel } from '@/lib/utils';

interface TodoFiltersProps {
  filters: TodoFilters;
  onFiltersChange: (filters: TodoFilters) => void;
  totalCount: number;
  filteredCount: number;
}

export function TodoFiltersBar({ filters, onFiltersChange, totalCount, filteredCount }: TodoFiltersProps) {
  const hasActiveFilters = filters.statuses.length > 0 || filters.priorities.length > 0 || filters.search !== '';

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      search: '',
      statuses: [],
      priorities: [],
    });
  };

  const toggleStatus = (status: StatusFilter[number]) => {
    const newStatuses = filters.statuses.includes(status) ? filters.statuses.filter((s) => s !== status) : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const togglePriority = (priority: PriorityFilter[number]) => {
    const newPriorities = filters.priorities.includes(priority) ? filters.priorities.filter((p) => p !== priority) : [...filters.priorities, priority];
    onFiltersChange({ ...filters, priorities: newPriorities });
  };

  const removeStatus = (status: StatusFilter[number]) => {
    onFiltersChange({ ...filters, statuses: filters.statuses.filter((s) => s !== status) });
  };

  const removePriority = (priority: PriorityFilter[number]) => {
    onFiltersChange({ ...filters, priorities: filters.priorities.filter((p) => p !== priority) });
  };

  const clearSearch = () => {
    onFiltersChange({ ...filters, search: '' });
  };

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-1 items-center gap-2'>
        <div className='relative max-w-sm flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder='Search todos...'
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className='bg-secondary border-border pl-9'
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' className='shrink-0 bg-transparent'>
              <SlidersHorizontal className='h-4 w-4' />
              <span className='sr-only'>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={filters.statuses.includes('pending')} onCheckedChange={() => toggleStatus('pending')}>
              Pending
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={filters.statuses.includes('overdue')} onCheckedChange={() => toggleStatus('overdue')}>
              Overdue
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={filters.statuses.includes('completed')} onCheckedChange={() => toggleStatus('completed')}>
              Completed
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={filters.priorities.includes(0)} onCheckedChange={() => togglePriority(0)}>
              Urgent
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={filters.priorities.includes(1)} onCheckedChange={() => togglePriority(1)}>
              High
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={filters.priorities.includes(2)} onCheckedChange={() => togglePriority(2)}>
              Medium
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={filters.priorities.includes(3)} onCheckedChange={() => togglePriority(3)}>
              Low
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={filters.priorities.includes(null)} onCheckedChange={() => togglePriority(null)}>
              No Priority
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' className='shrink-0 bg-transparent'>
              <ArrowUpDown className='h-4 w-4' />
              <span className='sr-only'>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={filters.sortField} onValueChange={(value) => onFiltersChange({ ...filters, sortField: value as SortField })}>
              <DropdownMenuRadioItem value='orderIndex'>Manual Order</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='priority'>Priority</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='dueAt'>Due Date</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='createdAt'>Created Date</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='title'>Title</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Direction</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={filters.sortDirection}
              onValueChange={(value) => onFiltersChange({ ...filters, sortDirection: value as SortDirection })}
            >
              <DropdownMenuRadioItem value='asc'>Ascending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='desc'>Descending</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        {filters.search && (
          <Badge variant='secondary' className='gap-1 pr-1'>
            Search: {filters.search.length > 10 ? `${filters.search.slice(0, 10)}...` : filters.search}
            <button onClick={clearSearch} className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5' aria-label='Remove search filter'>
              <X className='h-3 w-3' />
            </button>
          </Badge>
        )}
        {filters.statuses.map((status) => (
          <Badge key={status} variant='secondary' className='gap-1 pr-1 capitalize'>
            {status}
            <button
              onClick={() => removeStatus(status)}
              className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5'
              aria-label={`Remove ${status} filter`}
            >
              <X className='h-3 w-3' />
            </button>
          </Badge>
        ))}
        {filters.priorities.map((priority) => (
          <Badge key={String(priority)} variant='secondary' className='gap-1 pr-1'>
            {getPriorityLabel(priority)}
            <button
              onClick={() => removePriority(priority)}
              className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5'
              aria-label={`Remove ${getPriorityLabel(priority)} filter`}
            >
              <X className='h-3 w-3' />
            </button>
          </Badge>
        ))}
        {hasActiveFilters && (
          <Button variant='ghost' size='sm' onClick={clearFilters} className='text-muted-foreground h-7 px-2 text-xs'>
            Clear all
          </Button>
        )}
        <span className='text-muted-foreground text-sm'>
          {filteredCount} of {totalCount} tasks
        </span>
      </div>
    </div>
  );
}
