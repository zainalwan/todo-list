import { login, logout, register } from './controllers/auth';
import cookieParser from 'cookie-parser';
import express from 'express';
import { router as toDoRouter } from './routes/toDo';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/register', register);
app.post('/login', login);
app.post('/logout', logout);

app.use('/todo', toDoRouter);
