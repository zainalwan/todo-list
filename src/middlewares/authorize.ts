import { LOGIN_COOKIE_KEY, SECRET_KEY } from '../settings';
import { ResponseBody } from '../interfaces/responseBody';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

/**
 * Authorize user.
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
  let givenToken: string = req.cookies[LOGIN_COOKIE_KEY];
  let body: ResponseBody = {
    data: {
      success: false,
      message: 'you must login first'
    }
  }

  if (givenToken == undefined) {
    return res.status(401).send(body);
  }

  try {
    req.body.loginCookie = await jsonwebtoken.verify(
      givenToken,
      SECRET_KEY
    ) as JwtPayload;
  } catch (err) {
    return res.status(401).send(body);
  }

  next();
};
