import { getDatabaseClient } from '@utils/db';

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

export type StoreSocialLink = {
  url: string;
  title?: string;
};

export type LocationPhone = {
  number: string;
  isWhatsapp: boolean;
};

export type LocationSchedule = {
  day: string;
  isOpen: boolean;
  ranges: {
    open: string;
    close: string;
  }[];
};

export type Database = Awaited<ReturnType<typeof getDatabaseClient>>;
