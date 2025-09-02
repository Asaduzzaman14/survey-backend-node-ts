import { z } from 'zod';

const createDepositMethodZodSchema = z.object({
  body: z.object({
    paymentMethod: z.string({
      required_error: 'Payment Method is required',
    }),
    network: z.string({
      required_error: 'Network is required',
    }),
    walletNo: z.string({
      required_error: 'Wallet No is required',
    }),
    minimum: z.number().min(1, { message: 'minimum is required' }),
    maximum: z.number({
      required_error: 'Maximum is required',
    }),
    status: z.string({}).optional(),
  }),
});

export const DepositMethodValidation = {
  createDepositMethodZodSchema,
};
