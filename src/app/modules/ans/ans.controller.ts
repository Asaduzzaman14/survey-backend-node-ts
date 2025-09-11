import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { dataFilterAbleFields, } from '../users/users.constants';
import { submitionFilterableFields } from './ans.constants';
import { Services } from './ans.service';


const getData = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, dataFilterAbleFields);
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
  const filters = pick(req.query, submitionFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortOrder', 'sortBy']);

  const result = await Services.getSubmitions(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully retrive data',
    data: result,
  });
});



const getUserSubmitions = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const filters = pick(req.query, dataFilterAbleFields);
  const options = pick(req.query, ['limit', 'page', 'sortOrder', 'sortBy']);

  const result = await Services.getUserSubmitions(filters, options, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully retrive data',
    data: result,
  });
});

const deleteData = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const id = req.params.id;

  const result = await Services.deleteSubmission(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully deleted data',
    data: result,
  });
});

export const Controller = {
  getData,
  getSubmitions,
  getUserSubmitions,
  deleteData
};
