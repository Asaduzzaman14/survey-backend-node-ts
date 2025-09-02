import { z } from 'zod';

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

export const ProfileValidation = {
  update,
};
