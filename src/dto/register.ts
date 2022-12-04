import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { dataSource } from '../dataSource';

const UniqueEmail = () => {
  return (object: RegisterDto, propertyName: string) => {
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
};

export class RegisterDto {
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
