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

router.get('/', async (req: Request, res: Response) => {
  let assigneeId = req.query.assignee_id;
  let toDoRepo: Repository<ToDo> = dataSource.getRepository(ToDo);
  let userRepo: Repository<User> = dataSource.getRepository(User);
  let toDos: ToDo[];
  let body: IResponseBody;

  if (assigneeId == undefined) {
    body = {
      data: {
        success: true,
        toDos: (await toDoRepo.find()).map(serializeToDo),
      },
    };
    return res.status(200).send(body);
  }

  if (
    isNaN(Number(assigneeId)) ||
    (await userRepo.findOneBy({ id: Number(assigneeId) })) == null
  ) {
    body = {
      data: {
        success: false,
        message: 'assignee not found',
      },
    };
    return res.status(404).send(body);
  }

  toDos = await toDoRepo.find({
    relations: { assigneeId: true },
    where: {
      assigneeId: {
        id: Number(assigneeId),
      },
    },
  });
  body = {
    data: {
      success: true,
      toDos: toDos.map(serializeToDo),
    },
  };
  res.status(200).send(body);
});

router.put('/:id', authorize, async (req: Request, res: Response) => {
  let toDoDto: ToDoDto = new ToDoDto();

  toDoDto.name = req.body.name || req.body.toDo.name;
  if (req.body.description != undefined) {
    toDoDto.description = req.body.description;
  } else {
    toDoDto.description = req.body.toDo.description;
  }
  toDoDto.dueDate = req.body.dueDate || req.body.toDo.dueDate.toISOString();
  toDoDto.status = req.body.status || req.body.toDo.status;
  toDoDto.assigneeId = req.body.assigneeId || req.body.toDo.assigneeId.id;

  try {
    await validateOrReject(toDoDto);
  } catch (err) {
    let body: IResponseBody = {
      data: {
        success: false,
        errors: err.map(serializeErrorMsg),
      },
    };
    return res.status(400).send(body);
  }

  await dataSource.getRepository(ToDo).update(req.body.toDo.id, {
    name: toDoDto.name,
    description: toDoDto.description,
    dueDate: toDoDto.dueDate,
    status: toDoDto.status,
    assigneeId: await dataSource.getRepository(User).findOneByOrFail({
      id: toDoDto.assigneeId,
    }),
  });

  let body: IResponseBody = {
    data: {
      success: true,
      toDo: serializeToDo(
        await dataSource.getRepository(ToDo).findOneByOrFail({
          id: req.body.toDo.id,
        }),
      ),
    },
  };
  res.status(200).send(body);
});

router.delete('/:id', authorize, async (req: Request, res: Response) => {
  let body: IResponseBody = {
    data: {
      success: true,
      toDo: serializeToDo(req.body.toDo),
    },
  };
  await dataSource.getRepository(ToDo).softDelete(Number(req.params.id));
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

  let toDo = new ToDo();
  toDo.name = payload.name;
  toDo.description = payload.description;
  toDo.dueDate = new Date(payload.dueDate);
  toDo.status = payload.status;
  toDo.assigneeId = await dataSource.getRepository(User).findOneByOrFail({
    id: payload.assigneeId,
  });
  toDo.creatorId = await dataSource.getRepository(User).findOneByOrFail({
    email: req.body.loginCookie.email,
  });
  await dataSource.getRepository(ToDo).save(toDo);

  let body: IResponseBody = {
    data: {
      success: true,
      toDo: serializeToDo(toDo),
    },
  };
  res.status(200).send(body);
});
