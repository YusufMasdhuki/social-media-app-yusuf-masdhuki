'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import Gallery from '@/components/container/gallery';
import LikedGallery from '@/components/container/liked-gallery'; // 👈 buat baru mirip SavedGallery
import GalleryIcon from '@/components/icons/gallery-icon';
import HeartIcon from '@/components/icons/love'; // 👈 kamu bisa buat icon heart baru
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useUserDetail } from '@/hooks/users/useUserDetail';

const FriendsProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError, error } = useUserDetail(username);
  const [activeTab, setActiveTab] = useState('gallery');

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!data) return null;

  const user = data.data;

  return (
    <div className='mx-auto w-full max-w-210 px-4 py-32'>
      {/* Profile Header */}
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-5'>
          <Image
            src={user.avatarUrl || '/images/default-avatar.png'}
            alt={user.username}
            width={64}
            height={64}
            className='aspect-square rounded-full object-cover'
          />
          <div>
            <h1 className='text-md font-bold'>{user.name}</h1>
            <p className='text-md text-neutral-400'>@{user.username}</p>
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-3'>
          {!user.isMe ? (
            <Button
              variant={user.isFollowing ? 'secondary' : 'default'}
              className='px-5.5'
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </Button>
          ) : (
            <Button variant='secondary' className='px-5.5'>
              Edit Profile
            </Button>
          )}

          {/* Share button */}
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

      {/* Bio */}
      {user.bio && <p className='text-md mt-4'>{user.bio}</p>}

      {/* Stats */}
      <div className='mt-4 flex w-full divide-x divide-neutral-900'>
        {[
          { label: 'Posts', value: user.counts.post },
          { label: 'Followers', value: user.counts.followers },
          { label: 'Following', value: user.counts.following },
          { label: 'Likes', value: user.counts.likes },
        ].map((item) => (
          <div
            key={item.label}
            className='flex w-full flex-col items-center justify-center'
          >
            <span className='text-xl font-bold'>{item.value}</span>
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
            value='liked'
            className='text-md flex h-12 items-center gap-2 border-b border-neutral-900 text-neutral-400 data-[state=active]:border-b-3 data-[state=active]:border-white data-[state=active]:font-bold data-[state=active]:text-white'
          >
            <HeartIcon
              filled={activeTab === 'liked'}
              className='size-6'
              strokeColor={activeTab === 'liked' ? '#FFFFFF' : '#A4A7AE'}
              fillColor='#FFFFFF'
            />
            <span>Liked</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab content */}
        <TabsContent value='gallery'>
          <Gallery username={user.username} />
        </TabsContent>

        <TabsContent value='liked'>
          <LikedGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendsProfilePage;
