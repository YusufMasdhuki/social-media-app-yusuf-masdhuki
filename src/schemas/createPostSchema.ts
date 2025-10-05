import { z } from 'zod';

export const createPostSchema = z.object({
  image: z
    .instanceof(File, { message: 'Gambar wajib diunggah' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Ukuran maksimal 5MB')
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(
          file.type
        ),
      'Format harus JPG, PNG, atau WEBP'
    ),
  caption: z
    .string()
    .min(1, 'Caption tidak boleh kosong')
    .max(1000, 'Caption maksimal 1000 karakter'),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
