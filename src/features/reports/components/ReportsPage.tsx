import { useState, useMemo } from 'react';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { useTheme } from '@shared/theme';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { WorkoutSession, MonthlyReport } from '@shared/types';
import { getCurrentMonth, getPreviousMonth, formatMonth, getMonthDates } from '@shared/utils/dateUtils';
import { generateMonthlyReport } from '@shared/utils/progressAnalyzer';
import { generateReportPDF } from '@shared/utils/pdfGenerator';
import { Button, ReportsIcon, DownloadIcon, TrendingUpIcon } from '@shared/components';
import { SectionHelpButton } from '../../help';
import { ReportSummary } from './ReportSummary';
import { ExerciseProgressList } from './ExerciseProgressList';
import { BodyPartChart } from './BodyPartChart';

export default function ReportsPage() {
  const [sessions] = useLocalStorage<WorkoutSession[]>(
    STORAGE_KEYS.WORKOUT_SESSIONS,
    []
  );

  const [savedReports, setSavedReports] = useLocalStorage<MonthlyReport[]>(
    STORAGE_KEYS.MONTHLY_REPORTS,
    []
  );

  const currentMonth = getCurrentMonth();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

  // Generate available months (last 6 months)
  const availableMonths = useMemo(() => {
    const months: string[] = [];
    let cur = currentMonth;
    for (let i = 0; i < 6; i++) {
      months.push(cur);
      cur = getPreviousMonth(cur);
    }
    return months;
  }, [currentMonth]);

  // Compute report for selected month
  const report: MonthlyReport = useMemo(() => {
    const prevMonth = getPreviousMonth(selectedMonth);
    const { start: prevStart, end: prevEnd } = getMonthDates(prevMonth);
    const prevSessions = sessions.filter(s => s.completed && s.date >= prevStart && s.date <= prevEnd);

    return generateMonthlyReport(sessions, selectedMonth, prevSessions);
  }, [sessions, selectedMonth]);

  const handleDownloadPDF = () => {
    if (report.totalWorkouts === 0) {
      alert('No workout data recorded for this month to generate a PDF.');
      return;
    }
    generateReportPDF(report);
  };

  const handleSaveReport = () => {
    setSavedReports(prev => {
      const filtered = prev.filter(r => r.month !== selectedMonth);
      return [report, ...filtered];
    });
    alert(`Report for ${formatMonth(selectedMonth)} saved to your local storage.`);
  };

  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black flex items-center gap-2.5 uppercase tracking-wide ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
            <span
              className={`p-2 rounded-xl border flex items-center justify-center ${
                isLight
                  ? 'bg-[#FFF0ED] border-[#FF5B45]/30 text-[#FF5B45]'
                  : 'bg-red-600/20 border-red-500/30 text-rose-300'
              }`}
            >
              <ReportsIcon className="w-6 h-6" />
            </span>
            <span>Monthly Progress Analysis</span>
          </h1>
          <p className={`text-xs sm:text-sm mt-1 font-medium ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
            Track strength improvements, total volume, and muscle group development.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SectionHelpButton tab="reports" title="Reports Guide" />
          <Button
            size="sm"
            variant="secondary"
            onClick={handleSaveReport}
            disabled={report.totalWorkouts === 0}
            className={isLight ? 'border-[#E2E8F0] bg-[#F1F4F9] hover:bg-[#E5EBF4] text-[#1A2238]' : 'border-white/20 bg-black/40 hover:bg-white/10 text-white'}
          >
            Save Snapshot
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={handleDownloadPDF}
            disabled={report.totalWorkouts === 0}
            className="flex items-center gap-1.5 font-bold"
          >
            <DownloadIcon className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Month Selector Bar */}
      <div className={`p-3.5 rounded-2xl flex items-center justify-between flex-wrap gap-2 border transition-all ${isLight ? 'glass-card border-white/80' : 'glass-card'}`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>
            Month:
          </span>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none transition-colors border ${
              isLight
                ? 'bg-white/80 backdrop-blur-md border-[#E2E8F0] text-[#1A2238] focus:border-[#FF5B45]'
                : 'bg-black/60 border-white/20 text-white focus:border-red-500 backdrop-blur-sm'
            }`}
          >
            {availableMonths.map(m => (
              <option key={m} value={m} className={isLight ? 'bg-white text-[#1A2238]' : 'bg-neutral-900 text-white'}>
                {formatMonth(m)} {m === currentMonth ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>

        <span className={`text-xs font-medium ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
          Workouts logged: <strong className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{report.totalWorkouts}</strong>
        </span>
      </div>

      {/* Report Content */}
      {report.totalWorkouts === 0 ? (
        <div className={`text-center py-16 rounded-2xl border-dashed p-6 border ${isLight ? 'glass-card border-white/80 text-[#1A2238]' : 'glass-card border-white/20'}`}>
          <div className={`w-12 h-12 mx-auto rounded-2xl border flex items-center justify-center mb-3 ${isLight ? 'bg-[#FFF0ED] border-[#FF5B45]/30 text-[#FF5B45]' : 'bg-white/5 border-white/10 text-slate-400'}`}>
            <TrendingUpIcon className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
            No workouts logged in {formatMonth(selectedMonth)}
          </h3>
          <p className={`text-xs mt-1 max-w-sm mx-auto font-medium ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>
            Log your workouts in the Workout tab to generate full monthly strength analysis and progress charts.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary & Strength Improvement Banner */}
          <ReportSummary report={report} />

          {/* Muscle Group Chart */}
          <BodyPartChart breakdown={report.bodyPartBreakdown} />

          {/* Exercise-by-Exercise Progress */}
          <ExerciseProgressList progressList={report.exerciseProgress} />
        </div>
      )}
    </div>
  );
}
