'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useGetMe } from '@/hooks/my-profile/useGetMe';

export const useProfileNavigation = () => {
  const router = useRouter();
  const { data: meData } = useGetMe();

  const handleProfileClick = useCallback(
    (username: string) => {
      if (!username) return;

      const myUsername = meData?.data.profile.username;
      if (myUsername === username) {
        router.push('/myProfile');
      } else {
        router.push(`/friendsProfile/${username}`);
      }
    },
    [meData, router]
  );

  return { handleProfileClick };
};
