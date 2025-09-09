
import { Question, SurveyResponse } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

// const CACHE_KEY = "questions";

const create = async (
  data: any
): Promise<any> => {
  const { text, type, step, required, placeholder, options, dependsOnQuestionId,
    dependsOnValue, } = data;
  const question = await prisma.question.create({
    data: {
      text,
      type,
      step,
      required,
      placeholder,
      serial: 100,
      dependsOnQuestionId: dependsOnQuestionId || null,
      dependsOnValue: dependsOnValue || null,
      options: {
        create: options?.map((opt: { value: string; text: string; parent: string | null }) => ({
          value: opt.value,
          text: opt.text,
          parent: opt.parent || null,
        })),
      },
    },
    include: { options: true },
  });

  return question;
};


const update = async (
  id: string,
  data: any
): Promise<any> => {
  const { text, type, step, serial, required, placeholder, options } = data;
  const question = await prisma.question.update({
    where: {
      id
    },
    data: {
      text,
      type,
      step,
      required,
      placeholder,
      serial,
      options: {
        deleteMany: {},
        create: options?.map((opt: { value: string; text: string, parent: string }) => ({
          value: opt.value,
          text: opt.text,
          parent: opt.parent || null,
        })),
      },
    },
    include: { options: true },
  });
  // await redis.del(CACHE_KEY);

  return question;
};



const getAll = async (): Promise<Question[]> => {
  // const cached = await redis.get(CACHE_KEY);
  // if (cached) {
  //   // console.log("⚡ Serving from Redis cache");
  //   return JSON.parse(cached);
  // }
  const questions = await prisma.question.findMany({
    include: {
      options: true,
    },
    orderBy: {
      step: "asc"
    }
  })
  // await redis.set(CACHE_KEY, JSON.stringify(questions), "EX", 60 * 5);

  return questions;
}

const createAnswer = async (
  user: JwtPayload | null,
  answers: any[],
): Promise<SurveyResponse[]> => {
  console.log(user,
    answers);

  return await prisma.$transaction(async (tx) => {
    // Step 1: Create a Submition
    const submition = await tx.submition.create({
      data: {
        name: answers[1].answer,
        userId: user?.id,
      },
    });


    // Step 2: Save all survey responses under this submition
    const responses = await Promise.all(
      answers.map((a: any) =>
        tx.surveyResponse.create({
          data: {
            userId: user?.id,
            submitionId: submition.id, // 🔥 link with submition
            questionId: a.questionId,
            answerText: Array.isArray(a.answer)
              ? a.answer.join(",")
              : a.answer,
            optionId: a.optionId || null,
          },
        })
      )
    );
    // await redis.del(CACHE_KEY);

    return responses;
  });
};


const getDataById = async (id: string): Promise<Question | null> => {
  const questions = await prisma.question.findFirst({
    where: {
      id
    },
    include: {
      options: true,
    },
    orderBy: {
      step: "asc"
    }
  })
  return questions;
}


const deleteData = async (id: string): Promise<Question | null> => {

  const hasSub = await prisma.question.findFirst({
    where: {
      dependsOnQuestionId: id
    }
  })

  if (hasSub) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'has sub qus under this qus')
  }

  const questions = await prisma.question.delete({
    where: {
      id
    },
  })
  return questions;
}


export const Services = {
  create,
  update,
  getAll,
  createAnswer,
  getDataById,
  deleteData
};
