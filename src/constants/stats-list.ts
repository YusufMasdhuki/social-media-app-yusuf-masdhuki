// ✅ bikin constant stats

import { MeStats } from '@/types/me-type';

export interface ProfileStatItem {
  label: string;
  key: keyof MeStats;
}
export const PROFILE_STATS: ProfileStatItem[] = [
  { label: 'Post', key: 'posts' },
  { label: 'Followers', key: 'followers' },
  { label: 'Following', key: 'following' },
  { label: 'Likes', key: 'likes' },
];
