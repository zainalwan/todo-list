import { Request, Response } from 'express';
import { RegisterPayload } from '../validators/registerPayload';
import { Repository } from 'typeorm';
import { ResponseBody } from '../interfaces/responseBody';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';
import { dataSource } from '../dataSource';
import { serializeError } from '../util';
import { validateOrReject } from 'class-validator';

/**
 * Validate user input when register and create a new user to database.
 * @param req request - The request object.
 * @param res response - The response object.
 * @returns {undefined}
 */
export const register = async (req: Request, res: Response) => {
  let payload: RegisterPayload = new RegisterPayload();
  payload.firstName = req.body.firstName;
  payload.lastName = req.body.lastName;
  payload.email = req.body.email;
  payload.password = req.body.password;

  try {
    await validateOrReject(payload);
  } catch (err) {
    let body: ResponseBody = {
      data: {
        success: false,
        errors: err.map(serializeError),
      },
    };
    res.status(400).send(body);
    return;
  }

  let user: User = new User();
  user.firstName = payload.firstName;
  user.lastName = payload.lastName;
  user.email = payload.email;
  user.password = payload.password;

  let salt: string = await bcrypt.genSalt(10);
  user.password= await bcrypt.hash(user.password, salt);

  let userRepo: Repository<User> = dataSource.getRepository(User);
  await userRepo.save(user);

  let body: ResponseBody = {
    data: {
      success: true,
    },
  };
  res.status(200).send(body);
};
