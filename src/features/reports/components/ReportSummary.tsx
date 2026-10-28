import { MonthlyReport } from '@shared/types';
import { useTheme } from '@shared/theme';
import { StatCard, Card, TrendingUpIcon, DumbbellIcon, RecordsIcon, CheckIcon } from '@shared/components';

interface ReportSummaryProps {
  report: MonthlyReport;
}

export function ReportSummary({ report }: ReportSummaryProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isImproved = report.overallStrengthChange >= 0;

  return (
    <div className="space-y-4">
      {/* Highlight Banner */}
      <Card
        className={`p-5 transition-all border ${
          isLight
            ? 'border-white/80'
            : isImproved
            ? 'border-red-500/40 shadow-red-950/20'
            : 'border-white/20'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl border flex items-center justify-center shrink-0 ${
              isLight
                ? 'bg-[#FFF0ED] border-[#FF5B45]/35 text-[#FF5B45]'
                : 'bg-red-600/20 border-red-500/30 text-rose-300'
            }`}
          >
            <TrendingUpIcon className="w-7 h-7" />
          </div>
          <div>
            <div className={`text-xs font-bold uppercase tracking-widest ${isLight ? 'text-[#334155]' : 'text-slate-400'}`}>
              Monthly Progress Analysis
            </div>
            <div className={`text-lg sm:text-2xl font-black mt-0.5 ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
              {report.overallStrengthChange !== 0 ? (
                <>
                  <span className={isLight ? 'text-[#FF5B45]' : isImproved ? 'text-rose-300' : 'text-slate-300'}>
                    {isImproved ? 'Improved strength with +' : 'Strength shifted '}
                    {Math.abs(report.overallStrengthChange)}%
                  </span>{' '}
                  from last month
                </>
              ) : (
                <span>Baseline month established. Keep lifting!</span>
              )}
            </div>
            <p className={`text-xs mt-1 font-medium ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
              Calculated based on completed training volume, weight lifted, and repetition counts.
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Workouts"
          value={report.totalWorkouts}
          icon={<DumbbellIcon className="w-4 h-4" />}
          unit="sessions"
        />
        <StatCard
          label="Exercises"
          value={report.totalExercises}
          icon={<RecordsIcon className="w-4 h-4" />}
          unit="performed"
        />
        <StatCard
          label="Completed Sets"
          value={report.totalSets}
          icon={<CheckIcon className="w-4 h-4" />}
          unit="sets"
        />
        <StatCard
          label="Total Volume"
          value={report.totalVolume > 1000 ? `${(report.totalVolume / 1000).toFixed(1)}k` : report.totalVolume}
          icon={<TrendingUpIcon className="w-4 h-4" />}
          unit="kg"
        />
      </div>
    </div>
  );
}
