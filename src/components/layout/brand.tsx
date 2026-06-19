import Link from 'next/link';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandProps {
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: {
    wrap: 'gap-2',
    icon: 'h-7 w-7 rounded-lg',
    iconInner: 'h-3.5 w-3.5',
    title: 'text-sm',
    pro: 'text-[10px]',
  },
  md: {
    wrap: 'gap-2.5',
    icon: 'h-8 w-8 rounded-[10px]',
    iconInner: 'h-4 w-4',
    title: 'text-[15px] sm:text-base',
    pro: 'text-xs',
  },
  lg: {
    wrap: 'gap-3',
    icon: 'h-10 w-10 rounded-xl',
    iconInner: 'h-5 w-5',
    title: 'text-xl sm:text-2xl',
    pro: 'text-sm',
  },
};

export function Brand({ href = '/', className, size = 'md' }: BrandProps) {
  const s = sizes[size];

  const content = (
    <span className={cn('inline-flex items-center group', s.wrap, className)}>
      <span
        className={cn(
          s.icon,
          'flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg shadow-teal-500/25 ring-1 ring-teal-400/20 transition-shadow group-hover:shadow-teal-500/40'
        )}
      >
        <Layers className={cn(s.iconInner, 'text-zinc-950')} strokeWidth={2.25} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn(s.title, 'font-semibold tracking-tight text-foreground')}>
          TaskFlow
          <span className="text-teal-400 font-bold"> Pro</span>
        </span>
        {size === 'lg' && (
          <span className="mt-1 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Kanban · Team
          </span>
        )}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0" aria-label="TaskFlow Pro home">
        {content}
      </Link>
    );
  }

  return content;
}
