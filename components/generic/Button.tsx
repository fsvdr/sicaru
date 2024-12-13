import cn from '@utils/cn';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import Spinner from './Spinner';

export type ButtonProps = {
  variant?: 'default' | 'primary' | 'outline' | 'clear';
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', className, disabled, isLoading = false, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'flex justify-center h-8 items-center gap-2 font-medium text-sm px-2 py-1 rounded shadow-sm border transition-all duration-150 enabled:hover:shadow',
          'disabled:cursor-not-allowed disabled:text-opacity-50',
          {
            'bg-white border-slate-200 enabled:hover:border-slate-300': variant === 'default',
            'bg-melrose-200 border-melrose-300 text-melrose-600 enabled:hover:border-melrose-400':
              variant === 'primary',
            'bg-transparent border-slate-200 text-slate-600 enabled:hover:border-slate-300': variant === 'outline',
            'bg-transparent shadow-none border-transparent text-slate-600 enabled:hover:shadow-none':
              variant === 'clear',
          },
          className
        )}
        disabled={disabled || isLoading}
        {...props}
        ref={ref}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
