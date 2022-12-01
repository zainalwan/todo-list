import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({
    name: 'first_name',
    length: 30,
    nullable: false,
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    name: 'last_name',
    length: 30,
    nullable: false,
  })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Column({
    name: 'email',
    length: 30,
    nullable: false,
    unique: true,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(12)
  @Column({
    name: 'password',
    length: 100,
    nullable: false,
  })
  password: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
  })
  deletedAt: Date;
}
