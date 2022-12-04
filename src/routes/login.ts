import { LOGIN_COOKIE_KEY, SECRET_KEY } from '../settings';
import express, { Request, Response } from 'express';
import { Login } from '../dto/login';
import { ResponseBody } from '../interfaces/responseBody';
import jsonwebtoken from 'jsonwebtoken';
import { serializeError } from '../util';
import { validateOrReject } from 'class-validator';

export const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  let payload: Login = new Login;
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
    return res.status(400).send(body);
  }

  let body: ResponseBody = {
    data: {
      success: true,
    },
  };
  let token = await jsonwebtoken.sign({
    email: payload.email,
  }, SECRET_KEY);
  res.status(200)
    .cookie(LOGIN_COOKIE_KEY, token, { httpOnly: true })
    .send(body);
});
