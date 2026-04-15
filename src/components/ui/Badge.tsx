import { cn } from '@/lib/cn';

interface BadgeProps {
  variant?: 'trust' | 'complete' | 'opportunity' | 'incomplete' | 'new';
  children: React.ReactNode;
}

export function Badge({ variant = 'trust', children }: BadgeProps) {
  const baseClass =
    'inline-flex items-center px-2 py-1 rounded text-xs font-medium whitespace-nowrap';

  const variants = {
    trust: 'bg-blue-100 text-blue-800',
    complete: 'bg-green-100 text-green-800',
    opportunity: 'bg-amber-100 text-amber-800',
    incomplete: 'bg-red-100 text-red-800',
    new: 'bg-purple-100 text-purple-800',
  };

  return <span className={cn(baseClass, variants[variant])}>{children}</span>;
}
