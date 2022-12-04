import express, { Request, Response } from 'express';
import { serializeErrorMsg, serializeToDo } from '../dto/responseBody';
import { IResponseBody } from '../dto/responseBody';
import { Repository } from 'typeorm';
import { ToDo } from '../entities/toDo';
import { ToDoDto } from '../dto/toDo';
import { User } from '../entities/user';
import { authenticated } from '../middlewares/authenticated';
import { authorize } from '../middlewares/authorize';
import { dataSource } from '../dataSource';
import { validateOrReject } from 'class-validator';

export const router = express.Router();

router.use(authenticated);

router.delete('/:id', authorize, async (req: Request, res: Response) => {
  let body: IResponseBody = {
    data: {
      success: true,
      toDo: serializeToDo(req.body.toDo),
    },
  };
  let toDoRepo: Repository<ToDo> = dataSource.getRepository(ToDo);
  toDoRepo.softDelete(Number(req.params.id));
  res.status(200).send(body);
});

router.post('/', async (req: Request, res: Response) => {
  let payload: ToDoDto = new ToDoDto();
  payload.name = req.body.name;
  payload.description = req.body.description || '';
  payload.dueDate = req.body.dueDate;
  payload.status = req.body.status;
  payload.assigneeId = req.body.assigneeId;

  try {
    await validateOrReject(payload);
  } catch (err) {
    let body: IResponseBody = {
      data: {
        success: false,
        errors: err.map(serializeErrorMsg),
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
  if (assignee instanceof User) toDo.assigneeId = assignee;
  if (creator instanceof User) toDo.creatorId = creator;
  await toDoRepo.save(toDo);

  let body: IResponseBody = {
    data: {
      success: true,
      toDo: serializeToDo(toDo),
    },
  };
  res.status(200).send(body);
});
