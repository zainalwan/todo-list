import express, { Request, Response } from 'express';
import { IResponseBody, serializeUser } from '../dto/responseBody';
import { RegisterDto } from '../dto/register';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';
import { dataSource } from '../dataSource';
import { serializeErrorMsg } from '../dto/responseBody';
import { validateOrReject } from 'class-validator';

export const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  let payload: RegisterDto = new RegisterDto();
  let salt: string;
  let user: User;
  let body: IResponseBody;

  payload.firstName = req.body.firstName;
  payload.lastName = req.body.lastName;
  payload.email = req.body.email;
  payload.password = req.body.password;

  try {
    await validateOrReject(payload);
  } catch (err) {
    body = {
      data: {
        success: false,
        errors: err.map(serializeErrorMsg),
      },
    };
    return res.status(400).send(body);
  }

  salt = await bcrypt.genSalt(10);
  user = new User();
  user.firstName = payload.firstName;
  user.lastName = payload.lastName;
  user.email = payload.email;
  user.password = await bcrypt.hash(payload.password, salt);
  await dataSource.getRepository(User).save(user);

  body = {
    data: {
      success: true,
      user: serializeUser(user),
    },
  };
  res.status(200).send(body);
});
