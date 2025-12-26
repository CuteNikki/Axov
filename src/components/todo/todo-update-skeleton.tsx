export function TodoUpdateSkeleton() {
  return (
    <div className='flex flex-wrap justify-center gap-4 p-4'>
      {[...Array(3)].map((_, index) => (
        <div key={index} className='h-64 w-80 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700' />
      ))}
    </div>
  );
}
