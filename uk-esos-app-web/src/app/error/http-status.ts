export type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;

export class HttpStatuses {
  static Ok = 200;
  static Created = 201;
  static BadRequest = 400;
  static Unauthorized = 401;
  static Forbidden = 403;
  static NotFound = 404;
  static InternalServerError = 500;
  static ServiceUnavailable = 503;
}
