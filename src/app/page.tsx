// Library
import Link from 'next/link';
// Components
import { ComponentExample } from '@/components/component-example';

export default async function Page() {
  return (
    <main>
      <Link href={'/todo'}>View Todos</Link>
      <ComponentExample />
    </main>
  );
}
