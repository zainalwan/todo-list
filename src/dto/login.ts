import {
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';
import { dataSource } from '../dataSource';

const RegisteredEmail = () => {
  return (object: Login, propertyName: string) => {
    registerDecorator({
      name: 'registeredEmail',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        async validate(value: string) {
          let userRepo: Repository<User> = dataSource.getRepository(User);
          return (await userRepo.findOneBy({ email: value }) != null);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is not registered`;
        },
      },
    });
  };
};

const CorrectPassword = () => {
  return (object: Login, propertyName: string) => {
    registerDecorator({
      name: 'correctPassword',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          let email = (args.object as Login).email;

          if (!email) return true;

          let userRepo: Repository<User> = dataSource.getRepository(User);
          let user: User | null = await userRepo.findOneBy({
            email: email,
          });

          if (user == null) return true;
          if (!(await bcrypt.compare(value, user.password))) return false;
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `wrong ${args.property}`;
        },
      },
    });
  };
};

export class Login {
  @IsNotEmpty()
  @IsEmail()
  @RegisteredEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @CorrectPassword()
  password: string;
}
