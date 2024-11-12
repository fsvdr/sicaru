import { Slot } from '@radix-ui/react-slot';
import cn from '@utils/cn';
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
import { useFormStatus } from 'react-dom';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';
import Button, { ButtonProps } from './Button';

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

  return <p className={cn('', className)} id={formDescriptionId} {...props} />;
};

export const FormMessage = ({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) => {
  const { formMessageId, error } = useFormField();
  const body = error ? error.message : children;

  if (!body) return;

  return (
    <p className={cn('text-xs text-alizarin-crimson-500', className)} id={formMessageId} {...props}>
      {body}
    </p>
  );
};

export const TextField = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(({ className, ...props }, ref) => {
  const { invalid, error } = useFormField();

  return (
    <input
      className={cn(
        'border text-base h-8 font-medium tracking-tight border-slate-200 rounded shadow-sm w-full px-1 py-0.5 transition-all duration-150 hover:shadow focus:border-sc-brand-text',
        invalid && 'border-red-300',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

TextField.displayName = 'TextField';

export const SubmitButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'isLoading'>>((props, ref) => {
  const { pending } = useFormStatus();

  return <Button {...props} type="submit" isLoading={pending} ref={ref} />;
});

SubmitButton.displayName = 'SubmitButton';
