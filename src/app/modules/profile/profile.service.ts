import { Prisma, User } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IUserFilterRequest } from './profile.interface';

const getProfile = async (user: JwtPayload | null): Promise<any | null> => {
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  const result = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }


  const bdOffset = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  const now = new Date(Date.now() + bdOffset);

  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const [totalCount, todayCount] = await Promise.all([
    prisma.submition.count({
      where: {
        userId: user.id,
      },
    }),
    prisma.submition.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
  ]);

  return {
    ...result,
    total: totalCount,
    today: todayCount,
  };
};


const getMyRefferals = async (
  user: JwtPayload | null,
  filters: IUserFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<User[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { ...filterData } = filters;
  filterData.parentId = user!.id;

  const andCondations = [];
  if (Object.keys(filterData).length > 0) {
    andCondations.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andCondations.length > 0 ? { AND: andCondations } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
          createdAt: 'desc',
        },
  });
  const total = await prisma.user.count({
    where: {
      AND: [...(andCondations.length > 0 ? [{ AND: andCondations }] : [])],
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};



const getProfileById = async (user: JwtPayload | null) => {
  if (!user) {
    throw new ApiError(httpStatus.BAD_GATEWAY, 'user not found');
  }

  const findUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: user!.id,
    },
  });
  return findUser;
};
type UserTreeNode = {
  id: string;
  name: string | null;
  email: string | null;
  walletAddress: string;
  totalStakeAmount: number;
  wallet: {
    reward: number;
  };
};




const getSummary = async (user: JwtPayload | null) => {
  if (!user || !user.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  const bdOffset = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  const now = new Date(Date.now() + bdOffset);

  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const [totalCount, todayCount] = await Promise.all([
    prisma.submition.count({
      where: {
        userId: user.userId,
      },
    }),
    prisma.submition.count({
      where: {
        userId: user.userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
  ]);

  return {
    total: totalCount,
    today: todayCount,
  };
};

export const Services = {
  getProfile,
  getProfileById,
  getSummary
};
