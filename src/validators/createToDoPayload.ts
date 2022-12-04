import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { AssigneeExists } from './assigneeExists';

export class CreateToDoPayload {
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
