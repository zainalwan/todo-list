import { LOGIN_COOKIE_KEY, SECRET_KEY } from '../settings';
import express, { Request, Response } from 'express';
import { IResponseBody } from '../dto/responseBody';
import { LoginDto } from '../dto/login';
import jsonwebtoken from 'jsonwebtoken';
import { serializeErrorMsg } from '../dto/responseBody';
import { validateOrReject } from 'class-validator';

export const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  let payload: LoginDto = new LoginDto();
  let token: string;
  let body: IResponseBody;

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

  body = {
    data: {
      success: true,
    },
  };
  token = await jsonwebtoken.sign({ email: payload.email }, SECRET_KEY);
  res.status(200)
    .cookie(LOGIN_COOKIE_KEY, token, { httpOnly: true })
    .send(body);
});
