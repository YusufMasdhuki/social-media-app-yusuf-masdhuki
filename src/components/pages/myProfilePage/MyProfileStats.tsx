import { PROFILE_STATS } from '@/constants/stats-list';
import type { MeStats } from '@/types/me-type';

interface MyProfileStatsProps {
  stats: MeStats;
}

export const MyProfileStats = ({ stats }: MyProfileStatsProps) => (
  <div className='mt-4 flex w-full divide-x divide-neutral-900'>
    {PROFILE_STATS.map((item) => (
      <div
        key={item.key}
        className='flex w-full flex-col items-center justify-center'
      >
        <span className='text-lg font-bold md:text-xl'>
          {stats[item.key as keyof MeStats]}
        </span>
        <span className='md:text-md text-xs text-neutral-400'>
          {item.label}
        </span>
      </div>
    ))}
  </div>
);
