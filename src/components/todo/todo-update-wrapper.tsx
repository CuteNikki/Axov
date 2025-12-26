// Actions
import { getTodos } from '@/actions/todos';
// Components
import { TodoUpdateForm } from '@/components/todo/update-form';

export async function TodoUpdateWrapper() {
  const todos = await getTodos();

  return (
    <div className='flex flex-wrap justify-center gap-4 p-4'>
      {todos.map((todo) => (
        <TodoUpdateForm
          key={todo.id}
          title={todo.title}
          description={todo.description}
          orderIndex={todo.orderIndex}
          priority={todo.priority}
          dueAt={todo.dueAt}
          completedAt={todo.completedAt}
          id={todo.id}
          createdAt={todo.createdAt}
          updatedAt={todo.updatedAt}
        />
      ))}
    </div>
  );
}
