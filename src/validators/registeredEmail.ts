import {
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { LoginPayload } from './loginPayload';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { dataSource } from '../dataSource';

export const RegisteredEmail = () => {
  return (object: LoginPayload, propertyName: string) => {
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
