import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  protected statusCode = 401;

  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors () {
    return [ { message: 'Not authorized' } ];
  }

  get getStatusCode () {
    return this.statusCode;
  }
}