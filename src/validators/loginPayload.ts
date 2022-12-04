import {
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { CorrectPassword } from './correctPassword';
import { RegisteredEmail } from './registeredEmail';

export class LoginPayload {
  @IsNotEmpty()
  @IsEmail()
  @RegisteredEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @CorrectPassword()
  password: string;
}
