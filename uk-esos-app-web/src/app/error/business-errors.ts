import { HttpErrorResponse } from '@angular/common/http';

import { catchError, Observable, pipe, throwError, UnaryFunction } from 'rxjs';

import { HttpStatus } from '@error/http-status';

export function catchElseRethrow<T, R, E = HttpErrorResponse>(
  predicate: UnaryFunction<E, boolean>,
  handler: UnaryFunction<E, Observable<R>>,
) {
  return pipe(
    catchError<T, Observable<R | never>>((res: E) => (predicate(res) ? handler(res) : throwError(() => res))),
  );
}

export function catchBadRequest(
  code: ErrorCodes | ErrorCodes[] | string,
  handler: (res: HttpErrorResponse) => Observable<any>,
) {
  return pipe(
    catchElseRethrow((res) => {
      return isBadRequest(res, code);
    }, handler),
  );
}

export function catchTaskReassignedBadRequest(handler: (res: HttpErrorResponse) => Observable<any>) {
  return catchBadRequest('REQUEST_TASK_ACTION1001', handler);
}

export function isBadRequest(res: unknown, codes?: ErrorCodes | ErrorCodes[] | string): res is BadRequest {
  return (
    res instanceof HttpErrorResponse &&
    res.status === 400 &&
    (codes === undefined ||
      (typeof codes === 'string' && codes === res.error.code) ||
      (Array.isArray(codes) && codes.includes(res.error.code)))
  );
}

export type ErrorCode =
  | 'ACCOUNT1004'
  | 'ACCOUNT1005'
  | 'ACCOUNT1006'
  | 'ACCOUNT1007'
  | 'ACCOUNT1010'
  | 'ACCOUNT_CONTACT1001'
  | 'ACCOUNT_CONTACT1002'
  | 'ACCOUNT_CONTACT1003'
  | 'AUTHORITY1000'
  | 'AUTHORITY1001'
  | 'AUTHORITY1003'
  | 'AUTHORITY1004'
  | 'AUTHORITY1005'
  | 'AUTHORITY1006'
  | 'AUTHORITY1007'
  | 'EMAIL1001'
  | 'EXTCONTACT1000'
  | 'EXTCONTACT1001'
  | 'EXTCONTACT1002'
  | 'EXTCONTACT1003'
  | 'OTP1001'
  | 'REQUEST_TASK_ACTION1001'
  | 'TOKEN1001'
  | 'TOKEN1002'
  | 'USER1001'
  | 'USER1004'
  | 'USER1005'
  | 'VERBODY1001'
  | 'VERBODY1002'
  | 'NOTIF1000'
  | 'NOTIF1001'
  | 'NOTIF1002'
  | 'NOTIF1003'
  | 'REPORT1001'
  | 'FORM1001'
  | 'BATCHREISSUE0001'
  | 'BATCHREISSUE0002'
  | 'AER1008'
  | 'NOTFOUND1001'
  | 'ACCOUNT1001';

export class ErrorCodes {
  static ACCOUNT1004 = 'ACCOUNT1004';
  static ACCOUNT1005 = 'ACCOUNT1005';
  static ACCOUNT1006 = 'ACCOUNT1006';
  static ACCOUNT1007 = 'ACCOUNT1007';
  static ACCOUNT1010 = 'ACCOUNT1010';
  static ACCOUNT_CONTACT1001 = 'ACCOUNT_CONTACT1001';
  static ACCOUNT_CONTACT1002 = 'ACCOUNT_CONTACT1002';
  static ACCOUNT_CONTACT1003 = 'ACCOUNT_CONTACT1003';
  static AUTHORITY1000 = 'AUTHORITY1000';
  static AUTHORITY1001 = 'AUTHORITY1001';
  static AUTHORITY1003 = 'AUTHORITY1003';
  static AUTHORITY1004 = 'AUTHORITY1004';
  static AUTHORITY1005 = 'AUTHORITY1005';
  static AUTHORITY1006 = 'AUTHORITY1006';
  static AUTHORITY1007 = 'AUTHORITY1007';
  static EMAIL1001 = 'EMAIL1001';
  static EXTCONTACT1000 = 'EXTCONTACT1000';
  static EXTCONTACT1001 = 'EXTCONTACT1001';
  static EXTCONTACT1002 = 'EXTCONTACT1002';
  static EXTCONTACT1003 = 'EXTCONTACT1003';
  static OTP1001 = 'OTP1001';
  static REQUEST_TASK_ACTION1001 = 'REQUEST_TASK_ACTION1001';
  static TOKEN1001 = 'TOKEN1001';
  static TOKEN1002 = 'TOKEN1002';
  static USER1001 = 'USER1001';
  static USER1004 = 'USER1004';
  static USER1005 = 'USER1005';
  static VERBODY1001 = 'VERBODY1001';
  static VERBODY1002 = 'VERBODY1002';
  static NOTIF1000 = 'NOTIF1000';
  static NOTIF1001 = 'NOTIF1001';
  static NOTIF1002 = 'NOTIF1002';
  static NOTIF1003 = 'NOTIF1003';
  static REPORT1001 = 'REPORT1001';
  static FORM1001 = 'FORM1001';
  static BATCHREISSUE0001 = 'BATCHREISSUE0001';
  static BATCHREISSUE0002 = 'BATCHREISSUE0002';
  static AER1008 = 'AER1008';
  static NOTFOUND1001 = 'NOTFOUND1001';
  static ACCOUNT1001 = 'ACCOUNT1001';
}

export interface BadRequest extends HttpErrorResponse {
  status: HttpStatus;
  error: {
    code: string;
    data: unknown;
  };
}
