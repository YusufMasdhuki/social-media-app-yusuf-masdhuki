'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { useToggleFollowUser } from '@/hooks/follow/useToggleFollowUser';
import { useUserDetail } from '@/hooks/users/useUserDetail';

export const useFriendsProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError, error } = useUserDetail(username);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleFollow = useToggleFollowUser(username);

  const handleFollowClick = () => {
    if (!data?.data) return;
    const user = data.data;
    if (user.isFollowing) setConfirmOpen(true);
    else toggleFollow.mutate({ follow: true });
  };

  const handleConfirmUnfollow = () => {
    toggleFollow.mutate({ follow: false });
    setConfirmOpen(false);
  };

  return {
    username,
    data,
    isLoading,
    isError,
    error,
    confirmOpen,
    setConfirmOpen,
    toggleFollow,
    handleFollowClick,
    handleConfirmUnfollow,
  };
};
