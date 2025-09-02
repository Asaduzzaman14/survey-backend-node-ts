
import { User } from '@prisma/client';
import prisma from '../../../shared/prisma';

const getALl = async (
): Promise<User[] | null> => {
  const res = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    }
  })
  return res;
};

export const Services = {
  getALl,
};
