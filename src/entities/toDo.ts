import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { User } from './user';

@Entity('todos')
export class ToDo {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({
    name: 'name',
    length: 50,
    nullable: false,
  })
  name: string;

  @IsString()
  @Column({
    name: 'description',
    length: 200,
    nullable: false,
    default: '',
  })
  description: string;

  @IsNotEmpty()
  @Column({
    name: 'due_date',
    nullable: false,
    type: 'timestamp with time zone',
  })
  dueDate: Date;

  @IsNotEmpty()
  @ManyToOne(() => User, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'assignee_id' })
  assigneeId: User;

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
