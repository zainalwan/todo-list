import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UniqueEmail } from './uniqueEmail';

export class RegisterPayload {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @UniqueEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(12)
  password: string;
}
