// app/post/[id]/page.tsx
'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

import PostCard from '@/components/container/postCard';
import { Button } from '@/components/ui/button';

import { useGetPostById } from '@/hooks/posts/useGetPostById';

function PostDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data, isLoading, isError, error } = useGetPostById(id);

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin text-neutral-400' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-neutral-400'>Error: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-neutral-400'>Post not found</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full overflow-x-hidden px-4 py-20'>
      {/* Tombol Back */}
      <div className='flex items-center'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => router.back()}
          className='text-neutral-25 flex items-center gap-2 hover:text-white'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>Back</span>
        </Button>
      </div>

      {/* Konten Post */}
      <PostCard item={data.data} />
    </div>
  );
}

export default PostDetailPage;
