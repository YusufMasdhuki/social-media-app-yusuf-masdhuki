import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input md:text-md h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // focus state pakai primary-300
        'focus-visible:border-primary-300 focus-visible:ring-primary-300 focus-visible:ring-1',
        // error state via aria-invalid
        'aria-invalid:border-red-500 aria-invalid:ring-1 aria-invalid:ring-red-500',
        className
      )}
      {...props}
    />
  );
}

export { Input };
