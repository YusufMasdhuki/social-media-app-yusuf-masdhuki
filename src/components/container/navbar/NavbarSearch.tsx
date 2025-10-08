'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/components/ui/button';
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
      <div className='relative w-full md:max-w-80 lg:max-w-125'>
        <Search className='absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-500' />

        {/* Input + tombol X */}
        <Input
          placeholder='Search users...'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(e.target.value.length > 0);
          }}
          onFocus={() => isMobile && setOpen(true)}
          className='md:text-md h-11 w-full rounded-full border border-neutral-900 bg-neutral-950 pr-10 pl-10.5 text-sm md:h-12'
        />

        {/* ❌ Tombol X */}
        {query.length > 0 && (
          <Button
            variant='icon'
            size='icon'
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            className='absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-600 text-white transition-colors hover:bg-neutral-500'
          >
            <X size={10} />
          </Button>
        )}
      </div>

      {/* 🧭 Dropdown / Fullscreen Search */}
      {open && (
        <div className='absolute top-16 left-0 mx-auto w-full border border-neutral-900 bg-black shadow-xl md:top-20 md:left-1/2 md:max-w-120 md:-translate-x-1/2 md:rounded-xl md:bg-neutral-950'>
          {isLoading ? (
            <div className='flex h-full w-full items-center justify-center text-sm text-neutral-400'>
              Searching...
            </div>
          ) : users.length === 0 ? (
            <div className='flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-1 text-sm md:h-[195px]'>
              <p className='text-md text-neutral-25 font-bold'>
                No results found
              </p>
              <p className='text-sm text-neutral-400'>Change your keyword</p>
            </div>
          ) : (
            <ScrollArea className='h-[calc(100vh-64px)] overflow-y-auto md:max-h-[320px]'>
              <div className='flex flex-col gap-4 p-4 md:p-5'>
                {users.map((user) => (
                  <UserSearchResultItem
                    key={user.id}
                    user={user}
                    onClick={() => setOpen(false)}
                  />
                ))}
                {isFetchingNextPage && (
                  <p className='p-4 text-center text-sm text-neutral-400'>
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
