import cn from '@utils/cn';
import Link, { LinkProps } from 'next/link';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import Spinner from './Spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

// Base styles that will be shared between Button and Link
const baseStyles = {
  default:
    'flex justify-center h-8 items-center gap-2 font-medium text-sm px-2 py-1 rounded shadow-sm border transition-all duration-150 enabled:hover:shadow disabled:cursor-not-allowed disabled:text-opacity-50',
  variants: {
    default: 'bg-white border-slate-200 enabled:hover:border-slate-300',
    primary: 'bg-melrose-200 border-melrose-300 text-melrose-600 enabled:hover:border-melrose-400',
    outline: 'bg-transparent border-slate-200 text-slate-600 enabled:hover:border-slate-300',
    clear: 'bg-transparent shadow-none border-transparent text-slate-600 enabled:hover:shadow-none',
  },
} as const;

// Shared props interface
interface SharedProps {
  variant?: keyof typeof baseStyles.variants;
  isLoading?: boolean;
  tooltip?: ReactNode;
  className?: string;
  children?: ReactNode;
}

// Button specific props
export type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;

// Link specific props
export type ButtonLinkProps = SharedProps &
  Omit<LinkProps, keyof SharedProps> & {
    href: string;
  };

// Wrapper component for tooltip functionality
const WithTooltip = ({ tooltip, children }: { tooltip?: ReactNode; children: ReactNode }) => {
  if (!tooltip) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

// Button component
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', tooltip, className, disabled, isLoading = false, children, ...props }, ref) => {
    return (
      <WithTooltip tooltip={tooltip}>
        <button
          className={cn(baseStyles.default, baseStyles.variants[variant], className)}
          disabled={disabled || isLoading}
          {...props}
          ref={ref}
        >
          {isLoading ? <Spinner /> : children}
        </button>
      </WithTooltip>
    );
  }
);

// ButtonLink component
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ variant = 'default', tooltip, className, isLoading = false, children, href, ...props }, ref) => {
    return (
      <WithTooltip tooltip={tooltip}>
        <Link
          href={href}
          className={cn(baseStyles.default, baseStyles.variants[variant], className)}
          ref={ref}
          {...props}
        >
          {isLoading ? <Spinner /> : children}
        </Link>
      </WithTooltip>
    );
  }
);

Button.displayName = 'Button';
ButtonLink.displayName = 'ButtonLink';

export default Button;
