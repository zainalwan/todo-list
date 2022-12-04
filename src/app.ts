import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { router as loginRouter } from './routes/login';
import { router as logoutRouter } from './routes/logout';
import { router as registerRouter } from './routes/register';
import { router as toDoRouter } from './routes/toDo';

export const app = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

app.use('/todo', toDoRouter);
