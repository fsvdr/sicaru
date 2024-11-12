export enum GenericAPIErrorCode {
  UNKNOWN_ERROR,
  UNABLE_TO_AUTHENTICATE,
  USER_NOT_FOUND,
}

export interface GenericError {
  code?: GenericAPIErrorCode;
  message?: string;
  data?: unknown;
}

export type GenericServerActionResponse<T> =
  | {
      state: 'PENDING';
      error?: never;
      data?: never;
    }
  | {
      state: 'ERROR';
      error: GenericError;
      data?: never;
    }
  | {
      state: 'SUCCESS';
      data: T;
      error?: never;
    };
