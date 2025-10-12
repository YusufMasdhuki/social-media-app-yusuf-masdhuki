'use client';

import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FRIENDS_PROFILE_TABS } from '@/constants/friends-profile-tabs';

export const ProfileTabs = ({ username }: { username: string }) => {
  const [activeTab, setActiveTab] = useState('gallery');

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className='mt-4 w-full md:mt-8'
    >
      <TabsList className='grid w-full grid-cols-2'>
        {FRIENDS_PROFILE_TABS.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            className='md:text-md flex h-12 items-center gap-2 border-b border-neutral-900 text-sm text-neutral-400 data-[state=active]:border-b-3 data-[state=active]:border-white data-[state=active]:font-bold data-[state=active]:text-white'
          >
            {tab.icon(activeTab === tab.key)}
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {FRIENDS_PROFILE_TABS.map((tab) => (
        <TabsContent key={tab.key} value={tab.key}>
          {tab.content(username)}
        </TabsContent>
      ))}
    </Tabs>
  );
};
