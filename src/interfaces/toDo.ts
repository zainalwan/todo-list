import { User } from './user';

export interface ToDo {
  id: number,
  name: string,
  description: string,
  dueDate: Date,
  status: string,
  assigneeId: User,
  creatorId: User,
}
