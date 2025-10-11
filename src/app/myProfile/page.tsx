'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PROFILE_TABS from '@/constants/my-profile-tabs';
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
    <div className='text-neutral-25 mx-auto w-full max-w-210 px-4 py-20 md:py-30'>
      {/* Profile Info */}
      <div className='flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-3 md:gap-5'>
          <Image
            src={profile.avatarUrl || '/images/default-avatar.png'}
            alt={profile.username}
            width={64}
            height={64}
            className='aspect-square rounded-full object-cover'
          />
          <div>
            <h1 className='md:text-md text-sm font-bold'>{profile.name}</h1>
            <p className='md:text-md text-sm'>{profile.username}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            variant='secondary'
            onClick={() => router.push('/updateProfile')}
            className='h-10 px-5.5 max-md:w-full md:h-12'
          >
            Edit Profile
          </Button>
          <Button
            className='size-10 md:size-12'
            size='icon'
            variant='secondary'
          >
            <Image
              src='/icons/share-icon.svg'
              alt='share'
              width={24}
              height={24}
              className='size-5 md:size-6'
            />
          </Button>
        </div>
      </div>

      {profile.bio && <p className='md:text-md mt-4 text-sm'>{profile.bio}</p>}

      {/* Stats */}
      <div className='mt-4 flex w-full divide-x divide-neutral-900'>
        {PROFILE_STATS.map((item) => (
          <div
            key={item.key}
            className='flex w-full flex-col items-center justify-center'
          >
            <span className='text-lg font-bold md:text-xl'>
              {stats[item.key]}
            </span>
            <span className='md:text-md text-xs text-neutral-400'>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='mt-4 w-full md:mt-8'
      >
        <TabsList className='grid w-full grid-cols-2'>
          {PROFILE_TABS.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className='md:text-md flex h-12 items-center gap-2 border-b border-neutral-900 text-sm text-neutral-400 data-[state=active]:border-b-3 data-[state=active]:border-white data-[state=active]:font-bold data-[state=active]:text-white'
            >
              {tab.icon(activeTab === tab.key)}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {PROFILE_TABS.map((tab) => (
          <TabsContent key={tab.key} value={tab.key}>
            {tab.content(profile.username)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MyProfile;
