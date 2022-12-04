import {
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { CreateToDoPayload } from './createToDoPayload';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { dataSource } from '../dataSource';

export const AssigneeExists = () => {
  return (object: CreateToDoPayload, propertyName: string) => {
    registerDecorator({
      name: 'assigneeExists',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        async validate(value: number) {
          let userRepo: Repository<User> = dataSource.getRepository(User);
          return (await userRepo.findOneBy({ id: value }) != null);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} not found`;
        },
      },
    });
  };
};
