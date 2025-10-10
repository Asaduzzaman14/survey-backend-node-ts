
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

  // 🔹 Bangladesh time offset (+6 hours)
  const bdOffset = 6 * 60 * 60 * 1000;

  // 🔹 Current BD time
  const now = new Date(Date.now() + bdOffset);

  // 🔹 Start & end of Bangladesh day
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // 🔹 Run all queries in parallel
  const [totalSubmissions, totalUsers, todaysSubmissions, submissionCounts] =
    await Promise.all([
      // 1️⃣ Total submissions
      prisma.submition.count(),

      // 2️⃣ Total users
      prisma.user.count(),

      // 3️⃣ Today's submissions (BD timezone)
      prisma.submition.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // 4️⃣ Each user's submission count (sorted by submission count desc)
      prisma.user.findMany({
        where: {
          role: "USER",
        },
        select: {
          id: true,
          name: true,
          email: true,
          _count: {
            select: { submition: true },
          },
        },
        orderBy: {
          submition: {
            _count: "desc",
          },
        },
      }),
    ]);

  // ✅ Return all data
  return {
    totalUsers,
    totalSubmissions,
    todaysSubmissions,
    submissionCounts,
  };

};

export const Services = {
  getALl,
  getDetails
};
