'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useInfiniteUserSearch } from '@/hooks/users/useInfiniteUserSearch';
import type { UserSearchResult } from '@/types/user-search-type';

import { UserSearchResultItem } from './UserSearchResultItem';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
}

export const SearchDialog = ({
  open,
  onOpenChange,
  query,
}: SearchDialogProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteUserSearch(query, 10);

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const users = data?.pages.flatMap((page) => page.data.users) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='w-full max-w-125 border border-neutral-900 bg-neutral-950 p-0 text-white'
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        <DialogHeader className='px-4 pt-4 pb-2'>
          <DialogTitle className='text-sm text-neutral-400'>
            Search results
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className='max-h-[360px]'>
          {isLoading ? (
            <p className='p-4 text-sm text-neutral-400'>Searching...</p>
          ) : users.length === 0 ? (
            <p className='p-4 text-sm text-neutral-400'>No users found</p>
          ) : (
            <div className='flex flex-col divide-y divide-neutral-800'>
              {users.map((user: UserSearchResult) => (
                <UserSearchResultItem
                  key={user.id}
                  user={user}
                  onClick={() => onOpenChange(false)}
                />
              ))}
              {isFetchingNextPage && (
                <p className='p-4 text-sm text-neutral-400'>Loading more...</p>
              )}
              {hasNextPage && <div ref={ref} className='h-6' />}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
