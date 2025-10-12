'use client';

interface Props {
  counts: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
}

export const ProfileStats = ({ counts }: Props) => (
  <div className='mt-4 flex w-full divide-x divide-neutral-900'>
    {[
      { label: 'Posts', value: counts.post },
      { label: 'Followers', value: counts.followers },
      { label: 'Following', value: counts.following },
      { label: 'Likes', value: counts.likes },
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
);
