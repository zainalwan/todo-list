import { LOGIN_COOKIE_KEY, SECRET_KEY } from '../settings';
import express, { Request, Response } from 'express';
import { ErrorMessage } from '../interfaces/errorMessage';
import { LoginPayload } from '../interfaces/loginPayload';
import { Repository } from 'typeorm';
import { ResponseBody } from '../interfaces/responseBody';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';
import { dataSource } from '../dataSource';
import jsonwebtoken from 'jsonwebtoken';

export const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  let payload: LoginPayload = req.body;
  let userRepo: Repository<User> = dataSource.getRepository(User);

  let errors: ErrorMessage[] = [];

  if (payload.email == undefined) {
    errors.push({
      field: 'email',
      messages: ['email is required'],
    });
  }

  if (payload.password == undefined) {
    errors.push({
      field: 'password',
      messages: ['password is required'],
    });
  }

  if (errors.length > 0) {
    let body: ResponseBody = {
      data: {
        success: false,
        errors: errors,
      },
    };
    return res.status(400).send(body);
  }

  let user: User | null = await userRepo.findOneBy({ email: payload.email });
  if (user == null) {
    let body: ResponseBody = {
      data: {
        success: false,
        errors: [
          {
            field: 'email',
            messages: ['email is not registered'],
          },
        ],
      },
    };
    return res.status(400).send(body);
  }

  if (!(await bcrypt.compare(payload.password, user.password))) {
    let body: ResponseBody = {
      data: {
        success: false,
        errors: [
          {
            field: 'password',
            messages: ['password is invalid'],
          },
        ],
      },
    };
    return res.status(400).send(body);
  }

  let body: ResponseBody = {
    data: {
      success: true,
    },
  };
  let token = await jsonwebtoken.sign({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  }, SECRET_KEY);
  return res.status(200).cookie(LOGIN_COOKIE_KEY, token).send(body);
});
