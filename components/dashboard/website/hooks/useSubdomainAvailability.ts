import { GenericError } from '@types';
import { useEffect, useState } from 'react';
import { UseFormClearErrors, UseFormSetError, UseFormTrigger } from 'react-hook-form';
import { verifySubdomainAvailability } from '../actions';

interface UseSubdomainAvailabilityResult {
  isChecking: boolean;
  isAvailable: boolean | null;
  validationError: string | null;
}

interface SubdomainErrorData extends GenericError {
  data?: {
    errors?: string[];
  };
}

interface UseSubdomainAvailabilityOptions {
  originalValue?: string | null;
  setError?: UseFormSetError<any>;
  clearErrors?: UseFormClearErrors<any>;
  trigger?: UseFormTrigger<any>;
  fieldName?: string;
}

export const useSubdomainAvailability = (
  subdomain: string | null,
  options: UseSubdomainAvailabilityOptions = {}
): UseSubdomainAvailabilityResult => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { setError, clearErrors, trigger, fieldName = 'subdomain' } = options;

  // Set form as invalid immediately when subdomain changes
  useEffect(() => {
    if (!subdomain) {
      setIsAvailable(null);
      setValidationError(null);
      console.log('[SC] Clear #1');
      clearErrors?.(fieldName);
      return;
    }

    // Skip validation if subdomain matches original value
    if (options.originalValue && subdomain.toLowerCase() === options.originalValue.toLowerCase()) {
      setIsAvailable(null);
      setValidationError(null);
      setIsChecking(false);
      console.log('[SC] Clear #2');
      clearErrors?.(fieldName);
      return;
    }

    // Set form as invalid immediately
    setError?.(fieldName, { type: 'manual', message: `Verificando disponibilidad... ${subdomain}` });
  }, [subdomain, options.originalValue, setError, clearErrors, fieldName]);

  // Debounced availability check
  useEffect(() => {
    if (!subdomain) return;

    // Skip check if subdomain matches original value
    if (options.originalValue && subdomain.toLowerCase() === options.originalValue.toLowerCase()) return;

    setIsChecking(true);
    setIsAvailable(null);
    setValidationError(null);

    const checkAvailability = async () => {
      try {
        const response = await verifySubdomainAvailability(subdomain);

        if (response.state === 'ERROR') {
          const error = response.error as SubdomainErrorData;
          if (error.data?.errors?.length) {
            const errorMessage = error.data.errors[0];
            setValidationError(errorMessage);
            setError?.(fieldName, { type: 'manual', message: errorMessage });
          } else {
            console.error('Failed to check subdomain availability:', error);
          }
          return;
        }

        if (!response.data?.isAvailable) {
          const errorMessage = 'Este subdominio ya está en uso';
          setIsAvailable(false);
          setError?.(fieldName, { type: 'manual', message: errorMessage });
        } else {
          setIsAvailable(true);
          console.log('[SC] Clear #3');
          clearErrors?.(fieldName);
          trigger?.(fieldName);
        }
      } catch (error) {
        console.error('Failed to check subdomain availability:', error);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [subdomain, options.originalValue, setError, clearErrors, trigger, fieldName]);

  return {
    isChecking,
    isAvailable,
    validationError,
  };
};
