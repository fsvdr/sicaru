'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import cn from '@utils/cn';
import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from 'react';

interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  sendUnchecked?: boolean;
  label?: ReactNode;
  labelPosition?: 'left' | 'right';
}

const Switch = forwardRef<ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, name, checked, sendUnchecked, label, labelPosition = 'right', id, ...props }, ref) => {
    return (
      <div className={cn('flex items-center gap-2', labelPosition === 'left' && 'flex-row-reverse')}>
        {sendUnchecked && name && <input type="hidden" name={name} value={checked ? 'true' : 'false'} />}

        <SwitchPrimitives.Root
          className={cn(
            'peer inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-melrose-500 data-[state=unchecked]:bg-input',
            className
          )}
          name={sendUnchecked ? undefined : name}
          checked={checked}
          {...props}
          id={id}
          ref={ref}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              'pointer-events-none block size-3 rounded-full bg-background shadow-lg shadow-melrose-500/20 ring-0 transition-transform data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0'
            )}
          />
        </SwitchPrimitives.Root>

        {label && (
          <label htmlFor={id} className="text-xs text-gray-500 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
