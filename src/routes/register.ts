import express, { Request, Response } from 'express';
import { RegisterPayload } from '../interfaces/registerPayload';
import { Repository } from 'typeorm';
import { ResponseBody } from '../interfaces/responseBody';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';
import { dataSource } from '../dataSource';
import { serializeError } from '../util';
import { validateOrReject } from 'class-validator';

export const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  let payload: RegisterPayload = req.body;
  let userRepo: Repository<User> = dataSource.getRepository(User);

  let user: User = new User();
  user.firstName = payload.firstName;
  user.lastName = payload.lastName;
  user.email = payload.email;
  user.password = payload.password;

  try {
    await validateOrReject(user);
  } catch (err) {
    let body: ResponseBody = {
      data: {
        success: false,
        errors: err.map(serializeError),
      },
    };
    return res.status(400).send(body);
  }

  if ((await userRepo.findOneBy({ email: user.email })) != null) {
    let body: ResponseBody = {
      data: {
        success: false,
        errors: [
          {
            field: 'email',
            messages: ['email has been already used'],
          },
        ],
      },
    };
    return res.status(400).send(body);
  }

  let salt: string = await bcrypt.genSalt(10);
  user.password= await bcrypt.hash(user.password, salt);

  await userRepo.save(user);

  let body: ResponseBody = {
    data: {
      success: true,
    },
  };
  return res.status(200).send(body);
});
