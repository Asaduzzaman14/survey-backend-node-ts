import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import rateLimit from "express-rate-limit";
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';

import path from 'path';

const app: Application = express();

// app.disable("x-powered-by");

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://front-end-coral-phi.vercel.app',
  'http://infolife.edulife.agency'
];

app.use(cors({
  origin: allowedOrigins
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 মিনিট
  max: 100, // প্রতি IP থেকে 100 রিকোয়েস্ট
});

// app.use(limiter);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.use(globalErrorHandler);

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigins);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, '../uploads')));


// 

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found !!!',
      },
    ],
  });
  next();
});

export default app;
