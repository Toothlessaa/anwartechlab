import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'studio-chip inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold',
        className,
      )}
      {...props}
    />
  );
}
