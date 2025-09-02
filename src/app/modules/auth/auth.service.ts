import { User } from '@prisma/client';
import bcrypt, { compare, hash } from 'bcryptjs';
import validator from 'validator';

import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import { createToken } from './auth.utils';
import { sendEmail } from './sendResetMail';



const create = async (data: User): Promise<{ token: string, user: User }> => {
  const isExist = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'email already used')
  }

  const salt = bcrypt.genSaltSync(Number(config.bycrypt_salt_rounds));
  data.password = bcrypt.hashSync(data.password, salt);

  // Create the user
  const user = await prisma.user.create({
    data,
  });

  // Issue a token for the new user
  const payloadData = {
    id: user.id,
    role: user.role,
  };

  const token = createToken(
    payloadData,
    config.secret as string,
    config.secret_expires_in as string,
  );
  return { token, user };
};

const login = async (data: User): Promise<{ token: string, user: User }> => {
  // console.log(data);

  //   * Find user with email
  const findUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!findUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
  }

  if (!bcrypt.compareSync(data.password, findUser.password)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Credentials');
  }

  // * Issue token to user
  const payloadData = {
    id: findUser.id,
    email: findUser.email,
    role: findUser.role,
  };

  const token = createToken(
    payloadData,
    config.secret as string,
    config.secret_expires_in as string,
  );

  return {
    token,
    user: findUser
  };
};



const changePassword = async (
  adminData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  if (!adminData.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'token is required.');
  }

  const admin = await prisma.user.findFirst({
    where: { id: adminData.id },
  });

  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This admin is not found!');
  }

  const isPasswordValid = await compare(payload.oldPassword, admin.password);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect!');
  }

  // Hash the new password
  const newHashedPassword = await hash(
    payload.newPassword,
    Number(config.bycrypt_salt_rounds),
  );
  const data = {
    password: newHashedPassword,
  };

  await prisma.user.update({
    where: { id: adminData.id },
    data,
  });

  return null;
};

const forgetPassword = async (adminEmail: { email: string }) => {
  if (!validator.isEmail(adminEmail.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email format');
  }

  // Checking if the user exists
  const user = await prisma.user.findFirst({
    where: {
      email: adminEmail.email,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This admin is not found!');
  }

  const jwtPayload = {
    id: user.id,
    role: user.role,
    email: user.email,
  };

  const passResetToken = await jwtHelpers.createResetToken(
    jwtPayload,
    config.secret as string,
    '3m',
  );
  const resetLink: string = `${config.resetlink}?token=${passResetToken}`;
  await sendEmail(
    adminEmail.email,
    `
        <div>
          <p>Hi, ${user.name}</p>
          <p>Your password reset link: <a href="${resetLink}">Click Here</a></p>
          <p>Thank you</p>
          <p>Tizara coin</p>
        </div> 
      `,
  );
  return {
    message: 'Check your email!',
  };
};

const getDataById = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: { id },
  });

  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<User>,
): Promise<User> => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteDataById = async (id: string): Promise<User> => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const isVarified = jwtHelpers.verifyToken(token, config.secret as Secret);

  const { newPassword } = payload;
  const admin = await prisma.user.findFirst({
    where: {
      email: isVarified.email,
    },
  });

  if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin not found!');
  }

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds),
  );

  await prisma.user.update({
    where: {
      email: isVarified.email,
    },
    data: {
      password,
    },
  });
};

export const Services = {
  create,
  login,
  changePassword,
  forgetPassword,
  resetPassword,

  getDataById,
  updateDataById,
  deleteDataById,
};
