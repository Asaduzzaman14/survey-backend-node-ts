import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import config from '../../../config';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IUserFilterRequest } from '../auth/auth.interface';
import { dataSearchableFields } from './users.constants';



const getAllFromDB = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<User[]>> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const andCondations = [];

  if (searchTerm) {
    andCondations.push({
      OR: dataSearchableFields.map(field => ({
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
  const whereConditions: Prisma.UserWhereInput =
    andCondations.length > 0 ? { AND: andCondations } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,


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
  const total = await prisma.user.count({
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

const updateDataById = async (
  id: string,
  payload: Partial<User>,
): Promise<User> => {


  if (payload.password) {
    const salt = bcrypt.genSaltSync(Number(config.bycrypt_salt_rounds));
    payload.password = bcrypt.hashSync(payload.password, salt);
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};


const getUserById = async (
  id: string,
): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return result;
};

export const Services = {
  getAllFromDB,
  updateDataById,
  getUserById
};
