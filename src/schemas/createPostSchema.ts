import { z } from 'zod';

export const createPostSchema = z.object({
  image: z
    .instanceof(File, { message: 'Image must be uploaded' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Maximum size 5MB')
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(
          file.type
        ),
      'Format must be JPG, JPEG, PNG, or WEBP'
    ),
  caption: z
    .string()
    .min(1, 'Caption cannot be empty')
    .max(1000, 'Maximum caption 1000 characters'),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
