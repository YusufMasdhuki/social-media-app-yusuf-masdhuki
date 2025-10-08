'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useInfiniteUserSearch } from '@/hooks/users/useInfiniteUserSearch';

import { UserSearchResultItem } from './UserSearchResultItem';

export const NavbarSearch = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteUserSearch(debouncedQuery, 10);

  const { ref, inView } = useInView({ threshold: 0.8 });
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const users = data?.pages.flatMap((p) => p.data.users) ?? [];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* 🔍 Search input (selalu tampil di navbar) */}
      <div className='relative w-full max-w-80 lg:max-w-125'>
        <Search className='absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-500' />
        <Input
          placeholder='Search users...'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(e.target.value.length > 0);
          }}
          onFocus={() => isMobile && setOpen(true)}
          className='md:text-md h-11 w-full rounded-full border border-neutral-900 bg-neutral-950 pl-10.5 text-sm md:h-12'
        />
      </div>

      {/* 🧭 Dropdown / Fullscreen Search */}
      {open && (
        <div className='absolute top-16 left-0 mx-auto h-screen w-full border border-neutral-800 bg-neutral-950 shadow-xl md:top-20 md:left-1/2 md:max-h-[320px] md:max-w-120 md:-translate-x-1/2 md:rounded-xl'>
          {isLoading ? (
            <p className='p-4 text-sm text-neutral-400'>Searching...</p>
          ) : users.length === 0 ? (
            <p className='p-4 text-sm text-neutral-400'>No users found</p>
          ) : (
            <ScrollArea className='h-screen overflow-y-auto md:max-h-[320px]'>
              <div className='flex flex-col divide-y divide-neutral-800'>
                {users.map((user) => (
                  <UserSearchResultItem
                    key={user.id}
                    user={user}
                    onClick={() => setOpen(false)}
                  />
                ))}
                {isFetchingNextPage && (
                  <p className='p-4 text-sm text-neutral-400'>
                    Loading more...
                  </p>
                )}
                {hasNextPage && <div ref={ref} className='h-6' />}
              </div>
            </ScrollArea>
          )}
        </div>
      )}
    </>
  );
};
