import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { dataFilterAbleFields } from './users.constants';
import { Services } from './users.service';


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, dataFilterAbleFields);
  const options = pick(req.query, ['limit', 'page', 'sortOrder', 'sortBy']);

  const result = await Services.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users get successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {

  const id = req.params.id

  const result = await Services.getUserById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully get data by id',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Services.updateDataById(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User update successfully',
    data: result,
  });
});

export const Controller = {
  getAllFromDB,
  updateOneInDB,
  getUserById
};
