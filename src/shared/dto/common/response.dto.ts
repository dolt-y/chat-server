export class ResponseDto<T, U = object> {
  success: boolean;
  message: string;
  data?: T;
  additionalFields?: U;

  constructor(
    success: boolean,
    message: string,
    data?: T,
    additionalFields?: U,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.additionalFields = additionalFields;
  }
}
