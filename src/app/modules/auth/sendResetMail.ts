import httpStatus from 'http-status';
import nodemailer from 'nodemailer';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

export async function sendEmail(to: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.email,
      pass: config.appPass,
    },
  });

  try {
    await transporter.sendMail({
      from: config.email, // sender address
      to, // list of receivers
      subject: 'Reset Password Link', // Subject line
      html, // html body
    });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Faield to  send Email');
  }
}
