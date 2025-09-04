/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { Secret } from 'jsonwebtoken';

// code generate
export function generateUniqueCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 7; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

type jwtpaylode = {
  id: string;
  role: string;
};

export const createToken = (
  payloadData: jwtpaylode,
  secret: Secret,
  expiresIn: string,
) => {
  const token = jwt.sign(payloadData, secret, {
    expiresIn,
  });
  return token;
};


