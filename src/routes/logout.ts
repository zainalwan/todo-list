import { LOGIN_COOKIE_KEY } from '../settings';
import express, { Request, Response } from 'express';
import { ResponseBody } from '../interfaces/responseBody';

export const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  let body: ResponseBody = {
    data: {
      success: true,
    },
  };
  return res.status(200).clearCookie(LOGIN_COOKIE_KEY).send(body);
});
