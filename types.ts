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

export type AcceptedPaymentMethods = 'CASH' | 'DEBIT' | 'CREDIT';

export type StoreFeatures = {
  delivery?: boolean;
  acceptedPaymentMethods?: AcceptedPaymentMethods[];
  veganOptions?: boolean;
  vegetarianOptions?: boolean;
  petFriendly?: boolean;
  wifi?: boolean;
  reservationsAvailable?: boolean;
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

export interface WebsiteTemplateCommonThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

export type WebsiteTemplate =
  | {
      type: 'SC01:NUTRITION_LABEL';
      settings: WebsiteTemplateCommonThemeSettings;
      components: {
        type: 'product-listing';
        settings: { autoplay: boolean; loop: boolean };
        blocks: {
          type: 'collection';
          settings: {
            heading?: string;
            description?: string;
            products: {
              id: string;
            }[];
          };
        }[];
      }[];
    }
  | {
      type: 'SC01:STORIES';
      settings: WebsiteTemplateCommonThemeSettings;
      components: {
        type: 'product-listing';
        settings: {
          backgroundColor: string;
        };
        blocks: {
          type: 'collection';
          settings: {
            heading?: string;
            description?: string;
            products: {
              id: string;
            }[];
          };
        }[];
      }[];
    };
