import { Request, Response } from 'express';
import fs from 'fs';
import httpStatus from 'http-status';
import path from 'path';
import PDFDocument from 'pdfkit';
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
  const filters = pick(req.query, submitionFilterableFields);
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




const pdf = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id = 11 } = req.params;
    console.log(user);


    // এখান থেকে database query করে data আনতে পারো
    // উদাহরণস্বরূপ:
    const result = {
      id,
      name: 'বাংলা নাম',
      details: 'এই ডাটা PDF আকারে দেখানো হবে',
    };

    // PDF বানানোর কাজ শুরু
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // response এ pdf পাঠানোর জন্য header সেট
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="data-${id}.pdf"`);

    // ফন্ট path (যদি কাস্টম বাংলা ফন্ট ব্যবহার করতে চাও)
    const fontPath = path.join(__dirname, '../../fonts/SolaimanLipi.ttf');
    if (fs.existsSync(fontPath)) {
      doc.registerFont('Bangla', fontPath);
      doc.font('Bangla');
    }

    // PDF এ লেখা যোগ
    doc.fontSize(18).text('বাংলা PDF ডাউনলোড', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`ID: ${result.id}`);
    doc.text(`Name: ${result.name}`);
    doc.text(`Details: ${result.details}`);

    // শেষ করে stream রেসপন্সে পাঠানো
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'PDF generate failed',
    });
  }
};

export const Controller = {
  getData,
  getSubmitions,
  getUserSubmitions,
  deleteData,
  pdf
};
