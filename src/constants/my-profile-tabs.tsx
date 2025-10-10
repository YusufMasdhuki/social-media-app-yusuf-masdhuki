import Gallery from '@/components/container/gallery';
import SavedGallery from '@/components/container/saved-gallery';
import GalleryIcon from '@/components/icons/gallery-icon';
import SaveIcon from '@/components/icons/save-icon';

const PROFILE_TABS = [
  {
    key: 'gallery',
    label: 'Gallery',
    icon: () => <GalleryIcon className='size-5 md:size-6' />,
    content: (username: string) => <Gallery username={username} />,
  },
  {
    key: 'saved',
    label: 'Saved',
    icon: (isActive: boolean) => (
      <SaveIcon
        filled={isActive}
        strokeColor={isActive ? '#FDFDFD' : '#A4A7AE'}
        fillColor='#FDFDFD'
        className='size-5 md:size-6'
      />
    ),
    content: () => <SavedGallery />,
  },
];

export default PROFILE_TABS;
