import z from 'zod';

// ✅ 1. Schema validasi pakai Zod
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]+$/.test(val), 'Phone must be numeric'),
  bio: z.string().optional(),
  avatarUrl: z.any().optional(), // bisa file atau null
});

// ✅ 2. Tipe turunan dari schema
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
