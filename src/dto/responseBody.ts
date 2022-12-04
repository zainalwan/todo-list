import { ToDo } from '../entities/toDo';
import { User } from '../entities/user';
import { ValidationError } from 'class-validator';

export interface IErrorMessage {
  field: string,
  messages: string[],
}

export interface IUser {
  id: number,
  firstName: string,
  lastName: string,
}

export interface IToDo {
  id: number,
  name: string,
  description: string,
  dueDate: Date,
  status: string,
  assigneeId: IUser,
  creatorId: IUser,
}

export interface IResponseBody {
  data: {
    success: boolean,
    errors?: IErrorMessage[],
    message?: string,
    toDo?: IToDo,
    toDos?: IToDo[],
  },
}

/**
 * Serialize validation error for response to the client.
 * @param err error - The validation error object
 * @returns The serialized error message
 */
export const serializeErrorMsg = (err: ValidationError): IErrorMessage => {
  let messages: string[] = [];
  for (let key in err.constraints) {
    messages.push(err.constraints[key]);
  }
  return {
    field: err.property,
    messages: messages,
  };
};

/**
 * Serialize to do entity for response to the client.
 * @param user to do - The to do entity
 * @returns The serialized error message
 */
export const serializeUser = (user: User): IUser => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

/**
 * Serialize to do entity for response to the client.
 * @param toDo to do - The to do entity
 * @returns The serialized error message
 */
export const serializeToDo = (toDo: ToDo): IToDo => {
  return {
    id: toDo.id,
    name: toDo.name,
    description: toDo.description,
    status: toDo.status,
    dueDate: toDo.dueDate,
    assigneeId: serializeUser(toDo.assigneeId),
    creatorId: serializeUser(toDo.creatorId),
  };
};
