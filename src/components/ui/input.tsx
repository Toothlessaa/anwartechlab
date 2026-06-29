import * as React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn('h-12 w-full rounded-2xl border border-white/10 bg-white/7 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#8b35ff]/70 focus:ring-2 focus:ring-[#8b35ff]/25', className)}
    {...props}
  />
));
Input.displayName = 'Input';
