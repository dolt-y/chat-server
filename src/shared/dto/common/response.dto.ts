export class ResponseDto<T, U = object> {
  success: boolean;
  message: string;
  result?: T;
  additionalFields?: U;

  constructor(
    success: boolean,
    message: string,
    result?: T,
    additionalFields?: U,
  ) {
    this.success = success;
    this.message = message;
    this.result = result;
    this.additionalFields = additionalFields;
  }
}
