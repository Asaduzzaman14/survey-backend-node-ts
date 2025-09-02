import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Services } from './qus.service';

const create = catchAsync(async (req: Request, res: Response) => {

  const result = await Services.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully Created',
    data: result,
  });
});

const getData = catchAsync(async (req: Request, res: Response) => {

  const result = await Services.getAll();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully retrive data',
    data: result,
  });
});

const getDatabyId = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await Services.getDataById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully get data by id',
    data: result,
  });
})

const createAnswer = catchAsync(async (req: Request, res: Response) => {

  const user = req.user;
  const answers = req.body;

  const result = await Services.createAnswer(user,
    answers);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully submited',
    data: result,
  });
});


const udpate = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await Services.update(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully udpated Question',
    data: result,
  });
});


export const Controller = {
  create,
  getData,
  createAnswer,
  getDatabyId,
  udpate
};
