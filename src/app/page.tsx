// Libraries
import { Suspense } from 'react';
// Components
import { ComponentExample } from '@/components/component-example';
import { TodoUpdateSkeleton } from '@/components/todo/todo-update-skeleton';
import { TodoUpdateWrapper } from '@/components/todo/todo-update-wrapper';

export default async function Page() {
  return (
    <main>
      <Suspense fallback={<TodoUpdateSkeleton />}>
        <TodoUpdateWrapper />
      </Suspense>
      <ComponentExample />
    </main>
  );
}
