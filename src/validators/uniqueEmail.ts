import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { dataSource } from '../dataSource';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const UniqueEmail = () => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'uniqueEmail',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        async validate(value: string) {
          let userRepo: Repository<User> = dataSource.getRepository(User);
          return (await userRepo.findOneBy({ email: value }) == null);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} has been already used`;
        },
      },
    });
  };
}
