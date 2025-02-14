'use client';

import { Slot } from '@radix-ui/react-slot';
import { FieldMeta, ReactFormExtendedApi } from '@tanstack/react-form';
import cn from '@utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { TriangleAlert } from 'lucide-react';
import { ComponentPropsWithRef, ElementRef, forwardRef, HTMLAttributes, HTMLProps, useCallback } from 'react';
import CurrencyFormat from 'react-currency-format';
import { useFormStatus } from 'react-dom';
import Button, { ButtonProps } from './Button';
import { useSidebar } from './Sidebar';

export const FormItem = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('flex flex-col gap-1', className)} {...props} />;
};

export const FormLabel = ({ htmlFor, className, children, ...props }: HTMLProps<HTMLLabelElement>) => {
  return (
    <label className={cn('text-xs font-medium cursor-pointer', className)} htmlFor={htmlFor} {...props}>
      {children}
    </label>
  );
};

export const FormDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => {
  return <p className={cn('text-xs text-muted-foreground', className)} {...props} />;
};

export const FormMessage = ({
  meta,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { meta?: FieldMeta }) => {
  const body = children ? children : meta?.errors.length ? meta.errors.join('. ') : null;

  if (!body) return;

  return (
    <p
      className={cn(
        'text-xs',
        {
          'text-alizarin-crimson-500': meta?.isTouched && meta?.errors.length > 0,
          'text-muted-foreground': !meta?.errors.length,
        },
        className
      )}
      {...props}
    >
      {body}
    </p>
  );
};

export const FieldSlot = forwardRef<ElementRef<typeof Slot>, ComponentPropsWithRef<typeof Slot>>(
  ({ className, ...props }, ref) => {
    return (
      <Slot
        className={cn(
          'border text-base h-8 font-medium tracking-tight border-slate-200 rounded shadow-sm w-full px-1 py-0.5 transition-all duration-150 hover:shadow focus:border-sc-brand-text',
          '[&[aria-invalid=true]]:border-red-300',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

FieldSlot.displayName = 'FieldSlot';

export const TextField = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement> & { meta?: FieldMeta }>(
  ({ className, meta, ...props }, ref) => {
    return (
      <FieldSlot className={className} ref={ref} {...props}>
        <input aria-invalid={meta?.isTouched && meta?.errors.length > 0} />
      </FieldSlot>
    );
  }
);

TextField.displayName = 'TextField';

export const MoneyField = forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement> & {
    value: string | number | (string & readonly string[]) | (number & readonly string[]) | undefined;
    onValueChange?: (values: CurrencyFormat.Values) => void;
  }
>(({ className, name, value, onValueChange, ...props }, ref) => {
  const numericValue = (Number(value) || 0) * 100;

  return (
    <>
      <input type="hidden" name={name} value={numericValue} />

      <FieldSlot className={className} ref={ref} {...props}>
        <CurrencyFormat
          thousandSeparator
          prefix="$"
          decimalScale={2}
          allowNegative={false}
          displayType="input"
          type="text"
          min={0}
          placeholder="$0.00"
          className=""
          value={value}
          onValueChange={onValueChange}
        />
      </FieldSlot>
    </>
  );
});

MoneyField.displayName = 'MoneyField';

export const TextArea = forwardRef<HTMLTextAreaElement, HTMLProps<HTMLTextAreaElement> & { meta?: FieldMeta }>(
  ({ className, meta, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border text-base h-24 resize-none font-medium tracking-tight border-slate-200 rounded shadow-sm w-full px-1 py-0.5 transition-all duration-150 hover:shadow focus:border-sc-brand-text white-space-pre-wrap',
          '[&[aria-invalid=true]]:border-red-300',
          className
        )}
        aria-invalid={meta?.isTouched && meta?.errors.length > 0}
        ref={ref}
        {...props}
      />
    );
  }
);

export const SubmitButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'isLoading'>>((props, ref) => {
  const { pending } = useFormStatus();

  return <Button {...props} type="submit" isLoading={pending} ref={ref} />;
});

SubmitButton.displayName = 'SubmitButton';

export const SaveBar = ({ form }: { form: ReactFormExtendedApi<any> }) => {
  const { state, isMobile } = useSidebar();

  const isDefaultValues = useCallback(
    (values: any) => {
      const defaultValues = JSON.stringify(form.options.defaultValues);
      const currentValues = JSON.stringify(values);

      return defaultValues === currentValues;
    },
    [form]
  );

  return (
    <form.Subscribe
      selector={({ isDirty, isValid, values, isFieldsValidating }) => ({
        isDirty,
        isValid,
        values,
        isFieldsValidating,
      })}
    >
      {({ isDirty, isValid, values, isFieldsValidating }) => (
        <AnimatePresence>
          {isDirty && !isDefaultValues(values) && (
            <motion.div
              initial={isMobile ? { y: 100 } : { y: -100 }}
              animate={{ y: 0 }}
              exit={isMobile ? { y: 100 } : { y: -100 }}
              transition={{ duration: 0.2, bounce: 0.2 }}
              className={cn(
                'fixed bottom-0 top-auto inset-x-0 text-white shadow-lg bg-melrose-500 md:top-0 md:bottom-auto z-savebar md:py-1',
                state === 'collapsed' ? 'md:pl-[--sidebar-width-icon]' : 'md:pl-[--sidebar-width]'
              )}
            >
              <div className="flex items-center justify-between px-4 py-2">
                <h2 className="flex items-center gap-1 text-sm font-medium md:gap-2 md:text-base">
                  <TriangleAlert className="size-4" />
                  Cambios sin guardar
                </h2>

                <div className="flex items-center justify-end gap-2">
                  <Button onClick={() => form.reset()} type="button" className="text-white h-7 bg-melrose-400">
                    Descartar
                  </Button>

                  <SubmitButton
                    type="submit"
                    className="font-semibold h-7 text-melrose-500"
                    disabled={!isValid || isFieldsValidating}
                  >
                    Guardar
                  </SubmitButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </form.Subscribe>
  );
};
