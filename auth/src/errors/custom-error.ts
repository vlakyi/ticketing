import { RequestValidationError } from './request-validation-error';

export abstract class CustomError extends Error {
  protected abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors (): { message: string; field?: string; }[];
  abstract get getStatusCode (): number;
}