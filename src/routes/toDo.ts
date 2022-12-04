import { CreateToDoPayload } from '../validators/createToDoPayload';
import express, { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { ResponseBody } from '../interfaces/responseBody';
import { ToDo } from '../entities/toDo';
import { User } from '../entities/user';
import { dataSource } from '../dataSource';
import { serializeError } from '../util';
import { validateOrReject } from 'class-validator';
import { authorize } from '../middlewares/authorize';

export const router = express.Router();

router.use(authorize);

router.post('/', async (req: Request, res: Response) => {
  let payload: CreateToDoPayload = new CreateToDoPayload();
  payload.name = req.body.name;
  payload.description = req.body.description || '';
  payload.dueDate = req.body.dueDate;
  payload.status = req.body.status;
  payload.assigneeId = req.body.assigneeId;

  try {
    await validateOrReject(payload);
  } catch (err) {
    let body: ResponseBody = {
      data: {
        success: false,
        errors: err.map(serializeError),
      },
    };
    return res.status(400).send(body);
  }

  let userRepo: Repository<User> = dataSource.getRepository(User);
  let toDoRepo: Repository<ToDo> = dataSource.getRepository(ToDo);

  let assignee: User | null = await userRepo.findOneBy({
    id: payload.assigneeId,
  });
  let creator: User | null = await userRepo.findOneBy({
    email: req.body.loginCookie.email,
  });

  let toDo = new ToDo();
  toDo.name = payload.name;
  toDo.description = payload.description;
  toDo.dueDate = new Date(payload.dueDate);
  toDo.status = payload.status;
  toDo.assigneeId = assignee!;
  toDo.creatorId = creator!;
  await toDoRepo.save(toDo);

  let body: ResponseBody = {
    data: {
      success: true,
    },
  };
  res.status(200).send(body);
});
