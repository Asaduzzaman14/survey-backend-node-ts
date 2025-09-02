/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,

  secret: process.env.JWT_SECRET,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  secret_expires_in: process.env.JWT_SECRET_EXPIRES_IN,

  resetlink: process.env.RESET_PASS_UI_LINK,
  email: process.env.EMAIL,
  appPass: process.env.APP_PASS,

  baseUrl: process.env.BASE_URL,
  domain: process.env.DOMAIN,

  // refresh_secret: process.env.JWT_REFRESH_SECRET,
  // expires_in: process.env.JWT_EXPIRES_IN,
  // refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
};
