import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createReview = async (user: JwtPayload | null, payload: any) => {
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');

  const review = await prisma.surveyData.create({
    data: {
      userId: user.id,
      description: payload.description,
      location: payload.location,
      rating: payload.rating,
    },
  });

  return review;
};

const getMyReviews = async (user: JwtPayload | null) => {
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');

  const reviews = await prisma.surveyData.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return reviews;
};

const updateReview = async (user: JwtPayload | null, id: string, payload: any) => {
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');

  const existing = await prisma.surveyData.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const updated = await prisma.surveyData.update({
    where: { id },
    data: payload,
  });

  return updated;
};

const deleteReview = async (user: JwtPayload | null, id: string) => {
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');

  const existing = await prisma.surveyData.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  await prisma.surveyData.delete({ where: { id } });
  return { id };
};


const getAllReviews = async (user: JwtPayload | null) => {
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');

  const reviews = await prisma.surveyData.findMany({
    include: {
      user: true
    },
    orderBy: { createdAt: 'desc' },
  });

  return reviews;
};

export const ReviewService = {
  createReview,
  getMyReviews,
  updateReview,
  deleteReview,
  getAllReviews
};
