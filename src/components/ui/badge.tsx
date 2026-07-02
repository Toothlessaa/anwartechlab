import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/7 px-3 py-1 text-[11px] font-bold text-zinc-200 backdrop-blur-md',
        className,
      )}
      {...props}
    />
  );
}
