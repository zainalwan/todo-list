import { LOGIN_COOKIE_KEY, SECRET_KEY } from '../settings';
import express, { NextFunction, Request, Response } from 'express';
import { CreateToDoPayload } from '../interfaces/createToDoPayload';
import { Repository } from 'typeorm';
import { ResponseBody } from '../interfaces/responseBody';
import { ToDo } from '../entities/toDo';
import { User } from '../entities/user';
import { dataSource } from '../dataSource';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { serializeError } from '../util';
import { validateOrReject } from 'class-validator';

export const router = express.Router();

router.use(async (req: Request, res: Response, next: NextFunction) => {
  let givenToken: string = req.cookies[LOGIN_COOKIE_KEY];
  let body: ResponseBody = {
    data: {
      success: false,
      message: 'you must login first'
    }
  }

  if (givenToken == undefined) {
    return res.status(401).send(body);
  }

  try {
    await jsonwebtoken.verify(givenToken, SECRET_KEY);
  } catch (err) {
    return res.status(401).send(body);
  }

  next();
});

router.post('/', async (req: Request, res: Response) => {
  let payload: CreateToDoPayload = req.body;
  let userRepo: Repository<User> = dataSource.getRepository(User);
  let toDoRepo: Repository<ToDo> = dataSource.getRepository(ToDo);

  let givenToken: string = req.cookies[LOGIN_COOKIE_KEY];
  let loginCookie = await jsonwebtoken.verify(givenToken, SECRET_KEY) as
    JwtPayload;
  let assignee: User | null = await userRepo.findOneBy({
    email: loginCookie.email,
  });

  let toDo = new ToDo();
  toDo.name = payload.name;
  toDo.description = payload.description || '';
  toDo.dueDate = payload.dueDate;
  toDo.assigneeId = assignee!;

  try {
    await validateOrReject(toDo);
  } catch (err) {
    let body: ResponseBody = {
      data: {
        success: false,
        errors: err.map(serializeError),
      },
    };
    return res.status(400).send(body);
  }

  await toDoRepo.save(toDo);

  let body: ResponseBody = {
    data: {
      success: true,
    },
  };
  return res.status(200).send(body);
});
