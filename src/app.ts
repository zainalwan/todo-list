import { login, register } from './controllers/auth';
import cookieParser from 'cookie-parser';
import express from 'express';
import { router as logoutRouter } from './routes/logout';
import { router as toDoRouter } from './routes/toDo';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/register', register);
app.use('/login', login);
app.use('/logout', logoutRouter);

app.use('/todo', toDoRouter);
