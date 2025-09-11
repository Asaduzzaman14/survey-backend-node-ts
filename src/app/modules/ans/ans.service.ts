
import { Prisma, Submition } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { dataSearchableFields, submitionSearchableFields } from './ans.constants';
import { IUserFilterRequest } from './ans.interface';



const getAll = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Submition[]>> => {
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

  const whereConditions: Prisma.SubmitionWhereInput =
    andCondations.length > 0 ? { AND: andCondations } : {};

  const result = await prisma.submition.findMany({
    where: whereConditions,
    include: {
      user: true,
      surveyResponse: {
        include: {
          question: true,
        },
      },
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
  const { searchTerm, fromDate, toDate, ...filterData } = filters;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const andCondations = [];

  if (searchTerm) {
    andCondations.push({
      OR: [
        ...submitionSearchableFields.map(field => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
        {
          answerData: {
            array_contains: [{ answer: searchTerm }], // ✅ Prisma JSON filter
          },
        },
      ],
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

  // Date filter
  if (fromDate && toDate) {
    andCondations.push({
      createdAt: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    });
  } else if (fromDate) {
    andCondations.push({
      createdAt: {
        gte: new Date(fromDate),
      },
    });
  } else if (toDate) {
    andCondations.push({
      createdAt: {
        lte: new Date(toDate),
      },
    });
  }
  const whereConditions: Prisma.SubmitionWhereInput =
    andCondations.length > 0 ? { AND: andCondations } : {};

  const result = await prisma.submition.findMany({
    where: whereConditions,
    include: {
      user: true,
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
  const { searchTerm, day, ...filterData } = filters;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);


  if (user) {
    filterData.userId = user.id
  }

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

  if (day === "true") {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    andCondations.push({
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
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





const deleteSubmission = async (
  id: string,
  user: JwtPayload | null,
): Promise<any> => {
  if (!user) {
    throw new Error("Unauthorized");
  }

  // ডেটাবেজ থেকে submission খুঁজে বের করো
  const submission = await prisma.submition.findUnique({
    where: { id },
  });
  if (!submission) {
    throw new Error("Submission not found");
  }

  await prisma.submition.delete({
    where: { id },
  });

  return {
    success: true,
    message: "Submission deleted successfully",
    id,
  };
};

export const Services = {
  getAll,
  getSubmitions,
  getUserSubmitions,
  deleteSubmission
};
