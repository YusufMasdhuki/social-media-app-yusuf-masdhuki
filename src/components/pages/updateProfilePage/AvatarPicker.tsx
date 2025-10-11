// components/container/AvatarPicker.tsx
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AvatarPickerProps {
  src: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const AvatarPicker = ({ src, onChange, error }: AvatarPickerProps) => (
  <div className='flex flex-col items-center gap-4'>
    <Image
      src={src}
      alt='avatar'
      width={130}
      height={130}
      className='aspect-square size-32.5 rounded-full object-cover'
    />
    <Label htmlFor='avatar' className='cursor-pointer'>
      <Button type='button' className='px-6' variant='secondary' asChild>
        <span>Change Photo</span>
      </Button>
      <Input
        id='avatar'
        type='file'
        accept='image/*'
        className='hidden'
        onChange={onChange}
      />
    </Label>
    {error && <p className='text-accent-red text-sm'>{error}</p>}
  </div>
);
