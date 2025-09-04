import { Request, Response } from 'express';
import fs from 'fs';
import httpStatus from 'http-status';
import path from 'path';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Services } from './profile.service';


const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await Services.getProfile(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile get Successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const updatedData = req.body;
  const findData = await Services.getProfileById(user);
  if (req.file) {
    updatedData.img = `${config.baseUrl}/uploads/images/${req?.file?.filename}`;
  }
  if (findData?.img && updatedData?.img) {

    const oldImageFileName = path.basename(findData.img);
    const oldImagePath = path.join(process.cwd(), 'uploads', 'images', oldImageFileName);

    try {
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Old image deleted successfully');
      } else {
        console.log('Old image not deleted');
      }
    } catch (error) {
      console.error('Error deleting old image:', error);
    }
  }


  // const result = await Services.updateDataById(user!.id, updatedData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profle updated successfully',
    data: "result",
  });
});

export const ProfileController = {
  getProfile,
  updateOneInDB,
};
