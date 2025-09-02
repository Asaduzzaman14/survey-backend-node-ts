import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Services } from './admins.service';

const getData = catchAsync(async (req: Request, res: Response) => {

  const result = await Services.getALl();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully retruve all users',
    data: result,
  });
});

export const Controller = {
  getData,
};
