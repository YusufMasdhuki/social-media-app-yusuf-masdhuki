import Gallery from '@/components/container/gallery';
import LikedGallery from '@/components/container/liked-gallery';
import GalleryIcon from '@/components/icons/gallery-icon';
import HeartIcon from '@/components/icons/love';

export const FRIENDS_PROFILE_TABS = [
  {
    key: 'gallery',
    label: 'Gallery',
    icon: () => <GalleryIcon className='size-5 md:size-6' />,
    content: (username: string) => <Gallery username={username} />,
  },
  {
    key: 'liked',
    label: 'Liked',
    icon: (isActive: boolean) => (
      <HeartIcon
        filled={isActive}
        className='size-5 md:size-6'
        strokeColor={isActive ? '#FDFDFD' : '#A4A7AE'}
        fillColor='#FDFDFD'
      />
    ),
    content: (username: string) => <LikedGallery username={username} />,
  },
] as const;
