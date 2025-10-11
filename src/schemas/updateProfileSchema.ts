import z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]+$/.test(val), 'Phone must be numeric'),
  bio: z.string().optional(),
  avatarUrl: z
    .any()
    .optional()
    .refine(
      (file) => !file || !(file instanceof File) || file.size <= MAX_FILE_SIZE,
      { message: 'Image size must be less than 5MB' }
    )
    .refine(
      (file) =>
        !file ||
        !(file instanceof File) ||
        ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(
          file.type
        ),
      { message: 'Only .jpg, .jpeg, .png, or .webp files are allowed' }
    ),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
