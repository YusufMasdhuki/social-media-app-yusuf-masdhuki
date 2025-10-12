'use client';

import { ConfirmUnfollowDialog } from '@/components/container/ConfirmUnfollowDialog';
import { ProfileHeader } from '@/components/pages/friendsProfilePage/ProfileHeader';
import { ProfileStats } from '@/components/pages/friendsProfilePage/ProfileStats';
import { ProfileTabs } from '@/components/pages/friendsProfilePage/ProfileTabs';
import { useFriendsProfile } from '@/components/pages/friendsProfilePage/useFriendsProfile';

const FriendsProfilePage = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    confirmOpen,
    setConfirmOpen,
    toggleFollow,
    handleFollowClick,
    handleConfirmUnfollow,
  } = useFriendsProfile();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error?.message}</p>;
  if (!data) return null;

  const user = data.data;

  return (
    <div className='text-neutral-25 mx-auto w-full max-w-210 px-4 py-20 md:py-30'>
      <ProfileHeader
        user={user}
        isPending={toggleFollow.isPending}
        onFollowClick={handleFollowClick}
      />

      <ConfirmUnfollowDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmUnfollow}
        username={user.username}
      />

      {user.bio && <p className='md:text-md mt-4 text-sm'>{user.bio}</p>}

      <ProfileStats counts={user.counts} />

      <ProfileTabs username={user.username} />
    </div>
  );
};

export default FriendsProfilePage;
