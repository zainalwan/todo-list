import { ErrorMessage } from './interfaces/errorMessage';
import { ValidationError } from 'class-validator';

/**
 * Serialize validation error for response for client.
 * @param err error - The validation error object
 * @returns The serialized error message
 */
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
