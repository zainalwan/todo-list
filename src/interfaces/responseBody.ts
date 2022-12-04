import { ErrorMessage } from './errorMessage';
import { ToDo } from './toDo';

export interface ResponseBody {
  data: {
    success: boolean,
    errors?: ErrorMessage[],
    message?: string,
    toDo?: ToDo,
    toDos?: ToDo[],
  },
}
