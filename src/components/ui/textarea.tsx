import * as React from 'react';
import { cn } from '../../lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn('min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#8b35ff]/70 focus:ring-2 focus:ring-[#8b35ff]/25', className)}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
