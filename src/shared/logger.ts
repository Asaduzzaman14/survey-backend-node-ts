/* eslint-disable no-undef */
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, label, printf } = format;

//Customm Log Format

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toDateString()} ${hour}:${minutes}:${seconds} } [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'ASAD' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'successes',
        'note-%DATE%-success.log',
      ),
      datePattern: "YYYY-MM-DD", // প্রতিদিন নতুন ফাইল
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '3d',
    }),
  ],
});

const errorlogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'ASAD' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'errors',
        'note-%DATE%-error.log',
      ),
      datePattern: "YYYY-MM-DD", // প্রতিদিন নতুন ফাইল
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '3d',
    }),
  ],
});

export { errorlogger, logger };

