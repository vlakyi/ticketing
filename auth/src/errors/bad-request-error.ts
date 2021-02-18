import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  protected statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors () {
    return [ { message: this.message } ];
  }

  get getStatusCode () {
    return this.statusCode;
  }
}