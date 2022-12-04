import {
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { LoginPayload } from './loginPayload';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';
import { dataSource } from '../dataSource';

export const CorrectPassword = () => {
  return (object: LoginPayload, propertyName: string) => {
    registerDecorator({
      name: 'correctPassword',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          let email = (args.object as LoginPayload).email;

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
