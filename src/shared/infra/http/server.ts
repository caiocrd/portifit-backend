/* eslint-disable no-console */
import express, { json, NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import { errors } from 'celebrate';
import '../typeorm';
import '../../container';
import cors from 'cors';
import routes from './routes';
import uploadConfig from '../../../configurations/upload.config';
import AppError from '../../errors/AppError';

const app = express();
app.use(cors());
app.use(json());
app.use(routes);
app.use(errors());
app.use('/files', express.static(uploadConfig.upload));

app.use((err: Error, reques: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    console.log(err);

    return response.status(err.code).json({ status: 'Error', message: err.message });
  }
  console.log(err);

  return response.status(500).json({ status: 'Error', message: 'Internal Server Error' });
});

app.listen(process.env.PORT || 3333, () => {
  console.log(`... Iniciando o servidor na porta ${process.env.PORT || 3333}`);
});
