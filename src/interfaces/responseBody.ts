import { ErrorMessage } from './errorMessage';

export interface ResponseBody {
  data: {
    success: boolean,
    errors?: ErrorMessage[],
    message?: string,
  },
}
