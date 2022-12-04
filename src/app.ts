import cookieParser from 'cookie-parser';
import express from 'express';
import { register } from './controllers/auth';
import { router as loginRouter } from './routes/login';
import { router as logoutRouter } from './routes/logout';
import { router as registerRouter } from './routes/register';
import { router as toDoRouter } from './routes/toDo';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/register', register);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

app.use('/todo', toDoRouter);
