'use client';

import { MyProfileBio } from '@/components/pages/myProfilePage/MyProfileBio';
import { MyProfileHeader } from '@/components/pages/myProfilePage/MyProfileHeader';
import { MyProfileStats } from '@/components/pages/myProfilePage/MyProfileStats';
import { MyProfileTabs } from '@/components/pages/myProfilePage/MyProfileTabs';

import { useGetMe } from '@/hooks/my-profile/useGetMe';

const MyProfilePage = () => {
  const { data, isLoading, isError, error } = useGetMe();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error?.message ?? 'Gagal memuat profil'}</p>;
  if (!data) return null;

  const { profile, stats } = data.data;

  return (
    <div className='text-neutral-25 mx-auto w-full max-w-210 px-4 py-20 md:py-30'>
      <MyProfileHeader
        name={profile.name}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
      />
      <MyProfileBio bio={profile.bio} />
      <MyProfileStats stats={stats} />
      <MyProfileTabs username={profile.username} />
    </div>
  );
};

export default MyProfilePage;
