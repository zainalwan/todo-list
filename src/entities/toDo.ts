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
import { User } from './user';

@Entity('todos')
export class ToDo {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'name',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'description',
    length: 200,
    nullable: false,
    default: '',
  })
  description: string;

  @Column({
    name: 'due_date',
    nullable: false,
    type: 'timestamp with time zone',
  })
  dueDate: Date;

  @Column({
    name: 'status',
    length: 10,
    nullable: false,
  })
  status: string;

  @ManyToOne(() => User, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'assignee_id' })
  assigneeId: User;

  @ManyToOne(() => User, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'creator_id' })
  creatorId: User;

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
