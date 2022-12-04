import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT) || 0;

export const SECRET_KEY = process.env.SECRET_KEY || '';
export const LOGIN_COOKIE_KEY = process.env.LOGIN_COOKIE_KEY || '';

export const POSTGRES_HOST = process.env.POSTGRES_HOST || '';
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT) || 0;
export const POSTGRES_DB = process.env.POSTGRES_DB || '';
export const POSTGRES_USER = process.env.POSTGRES_USER || '';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
