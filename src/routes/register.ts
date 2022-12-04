import express, { Request, Response } from 'express';
import { IResponseBody } from '../dto/responseBody';
import { RegisterDto } from '../dto/register';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';
import { dataSource } from '../dataSource';
import { serializeErrorMsg } from '../dto/responseBody';
import { validateOrReject } from 'class-validator';

export const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  let payload: RegisterDto = new RegisterDto();
  payload.firstName = req.body.firstName;
  payload.lastName = req.body.lastName;
  payload.email = req.body.email;
  payload.password = req.body.password;

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

  let user: User = new User();
  user.firstName = payload.firstName;
  user.lastName = payload.lastName;
  user.email = payload.email;
  user.password = payload.password;

  let salt: string = await bcrypt.genSalt(10);
  user.password= await bcrypt.hash(user.password, salt);

  let userRepo: Repository<User> = dataSource.getRepository(User);
  await userRepo.save(user);

  let body: IResponseBody = {
    data: {
      success: true,
    },
  };
  res.status(200).send(body);
});
