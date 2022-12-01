import cookieParser from 'cookie-parser';
import express from 'express';
import { router as loginRouter } from './routes/login';
import { router as logoutRouter } from './routes/logout';
import { router as registerRouter } from './routes/register';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
