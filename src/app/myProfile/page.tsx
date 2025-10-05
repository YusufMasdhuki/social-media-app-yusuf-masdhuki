'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Gallery from '@/components/container/gallery';
import SavedGallery from '@/components/container/saved-gallery';
import GalleryIcon from '@/components/icons/gallery-icon';
import SaveIcon from '@/components/icons/save-icon';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { PROFILE_STATS } from '@/constants/stats-list';
import { useGetMe } from '@/hooks/my-profile/useGetMe';

const MyProfile = () => {
  const { data, isLoading, isError, error } = useGetMe();
  const [activeTab, setActiveTab] = useState('gallery');
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!data) return null;

  const { profile, stats } = data.data;

  return (
    <div className='mx-auto w-full max-w-210 px-4 py-32'>
      {/* Profile Info */}
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-5'>
          <Image
            src={profile.avatarUrl || '/images/default-avatar.png'}
            alt={profile.username}
            width={64}
            height={64}
            className='aspect-square rounded-full object-cover'
          />
          <div>
            <h1 className='text-md font-bold'>{profile.name}</h1>
            <p className='text-md'>{profile.username}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            variant='secondary'
            onClick={() => router.push('/updateProfile')}
            className='px-5.5'
          >
            Edit Profile
          </Button>
          <Button className='size-12' variant='secondary'>
            <Image
              src='/icons/share-icon.svg'
              alt='share'
              width={24}
              height={24}
            />
          </Button>
        </div>
      </div>

      <p className='text-md mt-4'>{profile.bio}</p>

      {/* Stats */}
      <div className='mt-4 flex w-full divide-x divide-neutral-900'>
        {PROFILE_STATS.map((item) => (
          <div
            key={item.key}
            className='flex w-full flex-col items-center justify-center'
          >
            <span className='text-xl font-bold'>{stats[item.key]}</span>
            <span className='text-md text-neutral-400'>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='mt-8 w-full'
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger
            value='gallery'
            className='text-md h-12 border-b border-neutral-900 text-neutral-400 data-[state=active]:border-b-3 data-[state=active]:border-white data-[state=active]:font-bold data-[state=active]:text-white'
          >
            <GalleryIcon className='size-6' /> <span>Gallery</span>
          </TabsTrigger>
          <TabsTrigger
            value='saved'
            className='text-md flex h-12 items-center gap-2 border-b border-neutral-900 text-neutral-400 data-[state=active]:border-b-3 data-[state=active]:border-white data-[state=active]:font-bold data-[state=active]:text-white'
          >
            <SaveIcon
              filled={activeTab === 'saved'}
              strokeColor={activeTab === 'saved' ? '#FFFFFF' : '#A4A7Ae'} // neutral-400
              fillColor='#FFFFFF'
              className='size-6'
            />
            <span>Saved</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='gallery'>
          <Gallery username={profile.username} />
        </TabsContent>

        <TabsContent value='saved'>
          <SavedGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProfile;
