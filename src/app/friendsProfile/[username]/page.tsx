'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { ConfirmUnfollowDialog } from '@/components/container/ConfirmUnfollowDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FRIENDS_PROFILE_TABS } from '@/constants/friends-profile-tabs';
import { useToggleFollowUser } from '@/hooks/follow/useToggleFollowUser';
import { useUserDetail } from '@/hooks/users/useUserDetail';

const FriendsProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError, error } = useUserDetail(username);
  const [activeTab, setActiveTab] = useState('gallery');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleFollow = useToggleFollowUser(username);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!data) return null;

  const user = data.data;

  const handleFollowClick = () => {
    if (user.isFollowing) {
      // kalau sudah following, tampilkan dialog konfirmasi
      setConfirmOpen(true);
    } else {
      // langsung follow tanpa konfirmasi
      toggleFollow.mutate({ follow: true });
    }
  };

  const handleConfirmUnfollow = () => {
    toggleFollow.mutate({ follow: false });
    setConfirmOpen(false);
  };

  return (
    <div className='text-neutral-25 mx-auto w-full max-w-210 px-4 py-20 md:py-30'>
      {/* Profile Header */}
      <div className='flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-3 md:gap-5'>
          <Image
            src={user.avatarUrl || '/images/default-avatar.png'}
            alt={user.username}
            width={64}
            height={64}
            className='aspect-square rounded-full object-cover'
          />
          <div>
            <h1 className='md:text-md text-sm font-bold'>{user.name}</h1>
            <p className='md:text-md text-sm'>{user.username}</p>
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-3'>
          <Button
            variant={user.isFollowing ? 'secondary' : 'default'}
            className='h-10 gap-2 px-5.5 max-md:w-full md:h-12'
            disabled={toggleFollow.isPending}
            onClick={handleFollowClick}
          >
            {toggleFollow.isPending ? (
              'Processing...'
            ) : user.isFollowing ? (
              <>
                <Image
                  src='/icons/checkbox-icon.svg'
                  alt='Following'
                  width={20}
                  height={20}
                  className='opacity-80'
                />
                <span>Following</span>
              </>
            ) : (
              'Follow'
            )}
          </Button>

          {/* Share button */}
          <Button
            size='icon'
            className='size-10 md:size-12'
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

      {/* Confirm Unfollow Dialog */}
      <ConfirmUnfollowDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmUnfollow}
        username={user.username}
      />

      {/* Bio */}
      {user.bio && <p className='md:text-md mt-4 text-sm'>{user.bio}</p>}

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
            <span className='text-lg font-bold md:text-xl'>{item.value}</span>
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
          {FRIENDS_PROFILE_TABS.map((tab) => (
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

        {FRIENDS_PROFILE_TABS.map((tab) => (
          <TabsContent key={tab.key} value={tab.key}>
            {tab.content(user.username)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FriendsProfilePage;
