import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  private reason = 'Error connection to database';
  protected statusCode = 500;

  constructor() {
    super('Error connection to database');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors () {
    return [ {
      message: this.reason,
    } ];
  }

  get getStatusCode () {
    return this.statusCode;
  }
}