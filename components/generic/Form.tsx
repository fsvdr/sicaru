'use client';

import { Slot } from '@radix-ui/react-slot';
import cn from '@utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { TriangleAlert } from 'lucide-react';
import {
  ComponentPropsWithRef,
  createContext,
  ElementRef,
  forwardRef,
  HTMLAttributes,
  HTMLProps,
  useContext,
  useId,
} from 'react';
import CurrencyFormat from 'react-currency-format';
import { useFormStatus } from 'react-dom';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';
import Button, { ButtonProps } from './Button';
import { useSidebar } from './Sidebar';

export const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
  id: string;
};

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);
export const useFormField = () => {
  const { getFieldState, formState } = useFormContext();

  const fieldContext = useContext(FormFieldContext);
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) throw new Error('useFormField must be used within FormField');

  const { id } = fieldContext;

  return {
    name: fieldContext.name,
    formFieldId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  const id = useId();

  return (
    <FormFieldContext.Provider value={{ name: props.name, id }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

export const FormItem = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('flex flex-col gap-1', className)} {...props} />;
};

export const FormLabel = ({ className, children, ...props }: HTMLProps<HTMLLabelElement>) => {
  const { formFieldId, error } = useFormField();

  return (
    <label className={cn('text-xs font-medium cursor-pointer', className)} htmlFor={formFieldId} {...props}>
      {children}
    </label>
  );
};

export const FormControl = forwardRef<ElementRef<typeof Slot>, ComponentPropsWithRef<typeof Slot>>((props, ref) => {
  const { formFieldId, error, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      id={formFieldId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      aria-invalid={!!error}
      ref={ref}
      {...props}
    />
  );
});

FormControl.displayName = 'FormControl';

export const FormDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => {
  const { formDescriptionId } = useFormField();

  return <p className={cn('text-xs text-muted-foreground', className)} id={formDescriptionId} {...props} />;
};

export const FormMessage = ({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) => {
  const { formMessageId, error } = useFormField();
  const body = error ? error.message : children;

  if (!body) return;

  return (
    <p
      className={cn(
        'text-xs',
        {
          'text-alizarin-crimson-500': error,
          'text-muted-foreground': !error,
        },
        className
      )}
      id={formMessageId}
      {...props}
    >
      {body}
    </p>
  );
};

export const FieldSlot = forwardRef<ElementRef<typeof Slot>, ComponentPropsWithRef<typeof Slot>>(
  ({ className, ...props }, ref) => {
    const { invalid, error } = useFormField();

    return (
      <Slot
        className={cn(
          'border text-base h-8 font-medium tracking-tight border-slate-200 rounded shadow-sm w-full px-1 py-0.5 transition-all duration-150 hover:shadow focus:border-sc-brand-text',
          invalid && 'border-red-300',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

FieldSlot.displayName = 'FieldSlot';

export const TextField = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <FieldSlot className={className} ref={ref} {...props}>
      <input />
    </FieldSlot>
  );
});

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

export const TextArea = forwardRef<HTMLTextAreaElement, HTMLProps<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    const { invalid, error } = useFormField();

    return (
      <textarea
        className={cn(
          'border text-base h-24 resize-none font-medium tracking-tight border-slate-200 rounded shadow-sm w-full px-1 py-0.5 transition-all duration-150 hover:shadow focus:border-sc-brand-text white-space-pre-wrap',
          invalid && 'border-red-300',
          className
        )}
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

export const SaveBar = () => {
  const { state, isMobile } = useSidebar();
  const {
    formState: { isDirty, isValid },
    reset,
  } = useFormContext();

  return (
    <AnimatePresence>
      {isDirty && (
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
              <Button onClick={() => reset()} type="button" className="text-white h-7 bg-melrose-400">
                Descartar
              </Button>

              <SubmitButton type="submit" className="font-semibold h-7 text-melrose-500" disabled={!isValid}>
                Guardar
              </SubmitButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
