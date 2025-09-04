
import { Question, SurveyResponse } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';

const create = async (
  data: any
): Promise<any> => {
  const { text, type, step, required, placeholder, options } = data;
  const question = await prisma.question.create({
    data: {
      text,
      type,
      step,
      required,
      placeholder,
      options: {
        create: options?.map((opt: { value: string; text: string }) => ({
          value: opt.value,
          text: opt.text,
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
  const { text, type, step, required, placeholder, options } = data;
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
      options: {
        deleteMany: {},
        create: options?.map((opt: { value: string; text: string }) => ({
          value: opt.value,
          text: opt.text,
        })),
      },
    },
    include: { options: true },
  });

  return question;
};



const getAll = async (): Promise<Question[]> => {
  const questions = await prisma.question.findMany({
    include: {
      options: true,
    },
    orderBy: {
      step: "asc"
    }
  })
  return questions;
}
const createAnswer = async (
  user: JwtPayload | null,
  answers: any[],
): Promise<SurveyResponse[]> => {

  return await prisma.$transaction(async (tx) => {
    // Step 1: Create a Submition
    const submition = await tx.submition.create({
      data: {
        name: answers[0].answer,
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


export const Services = {
  create,
  update,
  getAll,
  createAnswer,
  getDataById,
};
