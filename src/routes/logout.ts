import express, { Request, Response } from 'express';
import { IResponseBody } from '../dto/responseBody';
import { LOGIN_COOKIE_KEY } from '../settings';

export const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  let body: IResponseBody = {
    data: {
      success: true,
    },
  };
  return res.status(200).clearCookie(LOGIN_COOKIE_KEY).send(body);
});
