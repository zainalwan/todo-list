import { ErrorMessage } from './interfaces/errorMessage';
import { ValidationError } from 'class-validator';

export const serializeError = (err: ValidationError): ErrorMessage => {
  let messages: string[] = [];
  for (let key in err.constraints) {
    messages.push(err.constraints[key]);
  }
  return {
    field: err.property,
    messages: messages,
  };
};
