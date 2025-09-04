
import { Prisma, Submition, SurveyResponse } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { userSearchableFields } from '../users/users.constants';
import { IUserFilterRequest } from './ans.interface';



const getAll = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<SurveyResponse[]>> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const andCondations = [];

  if (searchTerm) {
    andCondations.push({
      OR: userSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // filter data
  if (Object.keys(filterData).length > 0) {
    andCondations.push({
      AND: Object.keys(filterData).map(key => {
        const value = (filterData as any)[key];
        return {
          [key]: {
            equals: value === 'true' ? true : value === 'false' ? false : value,
          },
        };
      }),
    });
  }
  const whereConditions: Prisma.SurveyResponseWhereInput =
    andCondations.length > 0 ? { AND: andCondations } : {};

  const result = await prisma.surveyResponse.findMany({
    where: whereConditions,
    include: {
      question: true
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
          [options.sortBy]: options.sortOrder,
        }
        : {
          createdAt: 'desc',
        },
  });

  // const total = await prisma.user.count();
  const total = await prisma.surveyResponse.count({
    where: {
      AND: [...(andCondations.length > 0 ? [{ AND: andCondations }] : [])],
    },
  });
  // console.log(result);
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};


const getSubmitions = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Submition[]>> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const andCondations = [];

  if (searchTerm) {
    andCondations.push({
      OR: userSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // filter data
  if (Object.keys(filterData).length > 0) {
    andCondations.push({
      AND: Object.keys(filterData).map(key => {
        const value = (filterData as any)[key];
        return {
          [key]: {
            equals: value === 'true' ? true : value === 'false' ? false : value,
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.SubmitionWhereInput =
    andCondations.length > 0 ? { AND: andCondations } : {};

  const result = await prisma.submition.findMany({
    where: whereConditions,
    include: {
      surveyResponse: {
        include: {
          question: true
        }
      }
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
          [options.sortBy]: options.sortOrder,
        }
        : {
          createdAt: 'desc',
        },
  });

  // const total = await prisma.user.count();
  const total = await prisma.submition.count({
    where: {
      AND: [...(andCondations.length > 0 ? [{ AND: andCondations }] : [])],
    },
  });
  // console.log(result);
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getUserSubmitions = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
  user: JwtPayload | null
): Promise<IGenericResponse<Submition[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);


  // if (user) {
  //   filterData.userId = user.id
  // }

  const andCondations = [];

  if (searchTerm) {
    andCondations.push({
      OR: userSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // filter data
  if (Object.keys(filterData).length > 0) {
    andCondations.push({
      AND: Object.keys(filterData).map(key => {
        const value = (filterData as any)[key];
        return {
          [key]: {
            equals: value === 'true' ? true : value === 'false' ? false : value,
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.SubmitionWhereInput =
    andCondations.length > 0 ? { AND: andCondations } : {};

  const result = await prisma.submition.findMany({
    where: whereConditions,
    include: {
      surveyResponse: {
        include: {
          question: true
        }
      }
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
          [options.sortBy]: options.sortOrder,
        }
        : {
          createdAt: 'desc',
        },
  });

  // const total = await prisma.user.count();
  const total = await prisma.submition.count({
    where: {
      AND: [...(andCondations.length > 0 ? [{ AND: andCondations }] : [])],
    },
  });
  // console.log(result);
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const Services = {
  getAll,
  getSubmitions,
  getUserSubmitions
};
