'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AddPostForm } from '@/components/pages/addPostPage/AddPostForm';
import { Button } from '@/components/ui/button';

const AddPostPage = () => {
  const router = useRouter();

  return (
    <div className='text-neutral-25 mx-auto min-h-screen max-w-[460px] px-4 py-20 md:py-32'>
      <div className='mb-4 flex items-center gap-2 md:mb-6 md:gap-3'>
        <Button
          onClick={() => router.back()}
          variant='icon'
          size='icon'
          className='text-neutral-25 hover:text-primary-200 size-8'
        >
          <ArrowLeft className='size-6 md:size-8' />
        </Button>
        <h1 className='text-md md:text-display-xs font-bold'>Add Post</h1>
      </div>

      <AddPostForm />
    </div>
  );
};

export default AddPostPage;
