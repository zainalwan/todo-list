import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { dataSource } from '../dataSource';

const AssigneeExists = () => {
  return (object: ToDoDto, propertyName: string) => {
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

export class ToDoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  dueDate: string;

  @IsNotEmpty()
  @IsIn(['inbox', 'ongoing', 'done'])
  status: string;

  @IsNotEmpty()
  @IsInt()
  @AssigneeExists()
  assigneeId: number;
}
