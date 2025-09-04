
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


const getDetails = async () => {
  try {
    // 1. Total submissions
    const totalSubmissions = await prisma.submition.count();

    // 2. Total users
    const totalUsers = await prisma.user.count();


    const submissionCounts = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: { submition: true }, // assuming 'submition' relation is defined in User model
        },
      },
      orderBy: {
        submition: {
          _count: "desc",
        },
      },
    });

    return {
      totalUsers,
      totalSubmissions,
      submissionCounts
    };
  } catch (err) {
    console.error("Error fetching admin summary:", err);
    throw err;
  }
};

export const Services = {
  getALl,
  getDetails
};
