import express from 'express';
import { router as registerRouter } from './routes/register';

export const app = express();

app.use(express.json());

app.use('/register', registerRouter);
