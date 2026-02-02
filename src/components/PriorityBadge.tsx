import { HiFlag, HiOutlineFlag } from 'react-icons/hi2';
import type { TodoPriority } from '../types/todo';

const config: Record<
  TodoPriority,
  { label: string; className: string; icon: typeof HiFlag }
> = {
  high: {
    label: 'High',
    className: 'bg-red-50 text-red-700 border-red-200',
    icon: HiFlag,
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: HiOutlineFlag,
  },
  low: {
    label: 'Low',
    className: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: HiOutlineFlag,
  },
};

interface PriorityBadgeProps {
  priority: TodoPriority;
  size?: 'xs' | 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const { label, className, icon: Icon } = config[priority];
  const sizeClass = size === 'xs' ? 'p-0.5' : size === 'sm' ? 'p-1' : 'p-1.5';

  return (
    <span
      className={`inline-flex items-center justify-center rounded border ${sizeClass} ${className}`}
      title={`Priority: ${label}`}
    >
      <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
    </span>
  );
}
