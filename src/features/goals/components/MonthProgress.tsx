import { getMonthProgress, getDaysRemainingInMonth, formatMonth } from '@shared/utils/dateUtils';
import { useTheme } from '@shared/theme';
import { Card, ProgressBar, CalendarIcon } from '@shared/components';

interface MonthProgressProps {
  month: string;
}

export function MonthProgress({ month }: MonthProgressProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const progress = getMonthProgress();
  const daysLeft = getDaysRemainingInMonth();
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();

  return (
    <Card className={`p-4 space-y-2 border transition-all ${isLight ? 'border-white/80' : ''}`}>
      <div className="flex items-center justify-between text-xs">
        <span className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
          <CalendarIcon className={`w-3.5 h-3.5 ${isLight ? 'text-[#FF5B45]' : 'text-rose-400'}`} />
          <span>{formatMonth(month)} Timeline</span>
        </span>
        <span className={`font-semibold ${isLight ? 'text-[#334155]' : 'text-neutral-200'}`}>
          {daysLeft} days remaining
        </span>
      </div>

      <ProgressBar
        value={dayOfMonth}
        max={daysInMonth}
        color={isLight ? 'bg-gradient-to-r from-[#FF5B45] to-[#FF7854]' : 'bg-red-600/70'}
        showLabel={false}
      />

      <div className={`flex justify-between items-center text-[11px] pt-0.5 font-medium ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
        <span>Day {dayOfMonth} of {daysInMonth}</span>
        <span>{progress}% of month elapsed</span>
      </div>
    </Card>
  );
}
