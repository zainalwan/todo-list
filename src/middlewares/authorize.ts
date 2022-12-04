import { NextFunction, Request, Response } from 'express';
import { IResponseBody } from '../dto/responseBody';
import { Repository } from 'typeorm';
import { ToDo } from '../entities/toDo';
import { dataSource } from '../dataSource';

/**
 * Determine is user authorized to the corresponding to do.
 * @param req request - The request object.
 * @param res response - The response object.
 * @param next next function - Go to the next middleware/controller.
 * @returns {undefined}
 */
export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let body: IResponseBody = {
    data: {
      success: false,
    },
  };

  if (isNaN(Number(req.params.id))) {
    body.data.message = 'to do not found';
    return res.status(404).send(body);
  }

  let toDoRepo: Repository<ToDo> = dataSource.getRepository(ToDo);
  let toDo: ToDo | null = await toDoRepo.findOneBy({
    id: Number(req.params.id),
  });
  if (toDo == null) {
    body.data.message = 'to do not found';
    return res.status(404).send(body);
  }

  if (toDo.creatorId.email != req.body.loginCookie.email) {
    body.data.message = 'only creator can manipulate to do';
    return res.status(403).send(body);
  }

  req.body.toDo = toDo;

  next();
};
