import {
  HiOutlineSquares2X2,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';

export type FilterType = 'all' | 'active' | 'completed';

const tabs: {
  value: FilterType;
  label: string;
  icon: typeof HiOutlineSquares2X2;
}[] = [
  { value: 'all', label: 'All', icon: HiOutlineSquares2X2 },
  { value: 'active', label: 'Active', icon: HiOutlineClock },
  { value: 'completed', label: 'Completed', icon: HiOutlineCheckCircle },
];

interface FilterTabsProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
  counts: { all: number; active: number; completed: number };
}

export function FilterTabs({ value, onChange, counts }: FilterTabsProps) {
  return (
    <div className="flex gap-2 rounded-2xl bg-surface-200/60 p-1.5">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const count =
          tab.value === 'all'
            ? counts.all
            : tab.value === 'active'
              ? counts.active
              : counts.completed;
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition sm:flex-initial ${
              isActive
                ? 'bg-white text-brand shadow-soft'
                : 'text-stone-600 hover:text-stone-800'
            }`}
            aria-pressed={isActive}
            aria-label={`${tab.label} (${count} items)`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isActive ? 'bg-brand-tint text-brand-dark' : 'bg-surface-200 text-stone-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
