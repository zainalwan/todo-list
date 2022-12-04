import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'first_name',
    length: 30,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    length: 30,
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'email',
    length: 30,
    nullable: false,
    unique: true,
  })
  email: string;

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
