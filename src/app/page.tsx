// Database
import prisma from '@/lib/prisma';
// Components
import { ComponentExample } from '@/components/component-example';

export default async function Page() {
  const users = await prisma.user.findMany();

  return (
    <>
      <ol className='flex flex-wrap gap-4 p-4'>
        {users.map((user) => (
          <li key={user.id} className='mb-2 rounded-lg border p-4'>
            <div className='mb-2 flex items-center'>
              <span className='text-lg font-semibold'>{user.name}</span>
              <span className='ml-3 text-sm'>({user.email})</span>
            </div>
            <Posts authorId={user.id} />
          </li>
        ))}
      </ol>
      <ComponentExample />;
    </>
  );
}

async function Posts({ authorId }: { authorId: number }) {
  const posts = await prisma.post.findMany({
    where: { authorId, published: true },
  });

  return (
    <ul className='flex flex-col gap-2'>
      {posts.map((post) => (
        <li key={post.id} className='rounded border p-2'>
          <span className='font-medium'>{post.title}</span>
          <p className='mt-1 text-sm'>{post.content}</p>
        </li>
      ))}
    </ul>
  );
}
