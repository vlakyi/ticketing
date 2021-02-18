import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  protected statusCode = 400;

  // shortcut to define private errors property
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors () {
    return this.errors.map(err => {
      return { message: err.msg, field: err.param };
    });
  }

  get getStatusCode () {
    return this.statusCode;
  }
}