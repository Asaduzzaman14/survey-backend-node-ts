import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { userFilterAbleFields } from '../users/users.constants';
import { Services } from './ans.service';


const getData = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterAbleFields);
  const options = pick(req.query, ['limit', 'page', 'sortOrder', 'sortBy']);

  const result = await Services.getAll(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully retrive data',
    data: result,
  });
});


const getSubmitions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterAbleFields);
  const options = pick(req.query, ['limit', 'page', 'sortOrder', 'sortBy']);

  const result = await Services.getSubmitions(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully retrive data',
    data: result,
  });
});

export const Controller = {
  getData,
  getSubmitions,
};
