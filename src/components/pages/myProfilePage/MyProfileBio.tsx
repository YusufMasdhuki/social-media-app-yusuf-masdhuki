interface MyProfileBioProps {
  bio: string | null;
}

export const MyProfileBio = ({ bio }: MyProfileBioProps) => {
  if (!bio) return null;
  return <p className='md:text-md mt-4 text-sm'>{bio}</p>;
};
