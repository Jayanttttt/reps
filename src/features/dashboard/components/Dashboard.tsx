import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import {
  Card,
  Button,
  StatCard,
  Badge,
  ProgressBar,
  CalendarIcon,
  DumbbellIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  RecordsIcon,
  ReportsIcon,
  GoalsIcon,
  CheckIcon,
  EditIcon,
} from '@shared/components';
import { SectionHelpButton } from '../../help';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { createDefaultPlan } from '@shared/constants/defaultPlan';
import {
  WeeklyPlan,
  WorkoutSession,
  MonthGoals,
  MonthlyGoal,
  DAY_LABELS,
  DayOfWeek,
} from '@shared/types';
import {
  getTodayDayOfWeek,
  getTodayDate,
  getCurrentMonth,
  getMonthProgress,
  getDaysRemainingInMonth,
  formatDate,
} from '@shared/utils/dateUtils';
import { AddGoalModal } from '../../goals/components/AddGoalModal';
import { useTheme } from '@shared/theme';

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [storedPlan] = useLocalStorage<WeeklyPlan>(
    STORAGE_KEYS.WEEKLY_PLAN,
    createDefaultPlan()
  );
  const weeklyPlan: WeeklyPlan =
    storedPlan && storedPlan.days ? storedPlan : createDefaultPlan();

  const [sessions, setSessions] = useLocalStorage<WorkoutSession[]>(
    STORAGE_KEYS.WORKOUT_SESSIONS,
    []
  );
  const [monthGoals, setAllMonthGoals] = useLocalStorage<MonthGoals[]>(
    STORAGE_KEYS.MONTHLY_GOALS,
    []
  );

  const [editingGoal, setEditingGoal] = useState<MonthlyGoal | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const today = getTodayDayOfWeek();
  const todayDate = getTodayDate();
  const currentMonth = getCurrentMonth();
  const monthProgress = getMonthProgress();
  const daysRemaining = getDaysRemainingInMonth();

  const todayWorkout = sessions.find(s => s.date === todayDate && s.completed);
  const currentMonthGoals = monthGoals.find(g => g.month === currentMonth);

  // Stats calculation
  const thisMonthSessions = sessions.filter(
    s => s.date.startsWith(currentMonth) && s.completed
  );

  const thisWeekSessions = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const startStr = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;
    return sessions.filter(s => s.date >= startStr && s.completed);
  }, [sessions]);

  const totalVolumeThisMonth = thisMonthSessions.reduce((sum, s) => {
    return (
      sum +
      s.exercises.reduce((eSum, e) => {
        return (
          eSum +
          e.sets
            .filter(set => set.isCompleted)
            .reduce((sSum, set) => sSum + set.weight * set.reps, 0)
        );
      }, 0)
    );
  }, 0);

  // Snapchat-style Streak Calculation
  const streakInfo = useMemo(() => {
    const completedDates = Array.from(
      new Set(
        sessions
          .filter(s => s.completed)
          .map(s => s.date)
      )
    ).sort();

    const dateSet = new Set(completedDates);
    const completedToday = dateSet.has(todayDate);

    const getOffsetDate = (baseDateStr: string, offsetDays: number): string => {
      const d = new Date(baseDateStr + 'T00:00:00');
      d.setDate(d.getDate() + offsetDays);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${dayNum}`;
    };

    const yesterday = getOffsetDate(todayDate, -1);
    const completedYesterday = dateSet.has(yesterday);

    let currentStreak = 0;
    if (completedToday || completedYesterday) {
      let checkDate = completedToday ? todayDate : yesterday;
      while (dateSet.has(checkDate)) {
        currentStreak++;
        checkDate = getOffsetDate(checkDate, -1);
      }
    }

    // Longest streak
    let longestStreak = 0;
    for (const d of completedDates) {
      const prev = getOffsetDate(d, -1);
      if (!dateSet.has(prev)) {
        let len = 1;
        let next = getOffsetDate(d, 1);
        while (dateSet.has(next)) {
          len++;
          next = getOffsetDate(next, 1);
        }
        if (len > longestStreak) longestStreak = len;
      }
    }

    // Last 7 days streak timeline (ending today)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const dateStr = getOffsetDate(todayDate, i - 6);
      const dObj = new Date(dateStr + 'T00:00:00');
      const dayLetter = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dObj.getDay()];
      const isCompleted = dateSet.has(dateStr);
      const isTodayItem = dateStr === todayDate;
      return {
        dateStr,
        dayLetter,
        dayNumber: dObj.getDate(),
        isCompleted,
        isToday: isTodayItem,
      };
    });

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      completedToday,
      last7Days,
    };
  }, [sessions, todayDate]);

  // Handle saving edited goal from Dashboard
  const handleSaveGoal = (goalToSave: MonthlyGoal) => {
    setAllMonthGoals(prev => {
      const existingEntry = prev.find(g => g.month === currentMonth);
      if (!existingEntry) {
        return [
          ...prev,
          {
            month: currentMonth,
            goals: [goalToSave],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }

      const isExisting = existingEntry.goals.some(g => g.id === goalToSave.id);
      const updatedGoals = isExisting
        ? existingEntry.goals.map(g => (g.id === goalToSave.id ? goalToSave : g))
        : [...existingEntry.goals, goalToSave];

      return prev.map(entry =>
        entry.month === currentMonth
          ? { ...entry, goals: updatedGoals, updatedAt: new Date().toISOString() }
          : entry
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Header section with clean typography */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-[#FF5B45]' : 'text-rose-300/90'}`}>
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{DAY_LABELS[today]} &bull; {formatDate(todayDate)}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-black tracking-tight ${theme === 'light' ? 'text-[#1A2238]' : 'text-white'}`}>
            Daily Workout
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 font-medium ${theme === 'light' ? 'text-[#5F6D7E]' : 'text-neutral-400'}`}>
            Track performance, push incremental overload, and set new personal records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SectionHelpButton tab="home" title="Home Guide" />
        </div>
      </div>

      {/* Start Today's Workout Button Card */}
      <Card className={`p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 transition-all ${
        theme === 'light'
          ? 'glass-card border-white/80 shadow-[0_10px_32px_-4px_rgba(24,39,75,0.06)]'
          : 'border-red-500/40 bg-gradient-to-r from-neutral-950/90 via-red-950/30 to-neutral-950/90 backdrop-blur-xl'
      }`}>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0" style={{ background: theme === 'light' ? 'linear-gradient(135deg, #FF5B45 0%, #FF7854 100%)' : 'linear-gradient(to bottom right, #dc2626, #be123c)' }}>
            <DumbbellIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Ready for Today's Lift?
              </h2>
              {todayWorkout && (
                <Badge color={theme === 'light' ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/40 text-[10px] py-1 px-2.5 font-bold' : 'bg-red-600/25 text-red-300 border-red-500/40 text-[10px] py-1 px-2.5 font-bold'}>
                  ✓ Completed Today
                </Badge>
              )}
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              {todayWorkout
                ? `You already logged a session today! You can start another or review sets.`
                : `Launch active session with your planned exercises, weights, and set tracking.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/workout')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-white font-black text-sm uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          style={{ background: theme === 'light' ? 'linear-gradient(135deg, #FF5B45 0%, #FF7854 100%)' : 'linear-gradient(to right, #dc2626, #e11d48)' }}
        >
          <DumbbellIcon className="w-4 h-4" />
          <span>Start Today's Workout</span>
          <ArrowRightIcon className="w-4 h-4 ml-1" />
        </button>
      </Card>

      {/* Snapchat-Style Workout Streak Section */}
      <div className={`border rounded-3xl p-5 shadow-2xl relative overflow-hidden transition-all ${
        theme === 'light'
          ? 'glass-card border-orange-200/60 shadow-[0_10px_32px_-4px_rgba(255,91,69,0.08)]'
          : 'bg-gradient-to-br from-neutral-950 via-neutral-900 to-orange-950/30 border-orange-500/40 shadow-orange-950/20'
      }`}>
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-amber-400 to-yellow-500 shadow-sm shadow-orange-500/50" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10" style={{ borderBottomColor: theme === 'light' ? '#F1F5F9' : undefined }}>
          <div className="flex items-center gap-3.5">
            {/* Snapchat Flame Badge */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center text-3xl shadow-lg shadow-orange-600/30 shrink-0">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {streakInfo.currentStreak}
                </span>
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
                  DAY STREAK
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  streakInfo.completedToday
                    ? theme === 'light'
                      ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/40 font-bold'
                      : 'bg-red-600/25 text-red-300 border-red-500/40 font-bold'
                    : streakInfo.currentStreak > 0
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 animate-pulse'
                    : 'bg-neutral-800 text-neutral-400 border-white/10'
                }`} style={theme === 'light' && !streakInfo.completedToday && streakInfo.currentStreak === 0 ? { backgroundColor: '#F1F5F9', color: '#64748B', borderColor: '#E2E8F0' } : undefined}>
                  {streakInfo.completedToday
                    ? '✓ Streak Safe Today'
                    : streakInfo.currentStreak > 0
                    ? '⏳ Workout Needed Today'
                    : 'Ignite Streak'}
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1 font-medium">
                {streakInfo.completedToday
                  ? "You're on fire! Today's session is locked in and your streak is preserved."
                  : streakInfo.currentStreak > 0
                  ? "Don't let the fire go out! Complete a workout today to keep your streak burning."
                  : "Start your streak today! Every workout counts towards building unstoppable momentum."}
              </p>
            </div>
          </div>

          {/* Longest Record Badge */}
          <div className="self-end sm:self-center shrink-0 border rounded-2xl px-3.5 py-2 text-right backdrop-blur-sm" style={{ backgroundColor: theme === 'light' ? '#F8FAFC' : 'rgba(0,0,0,0.5)', borderColor: theme === 'light' ? '#FED7AA' : 'rgba(249,115,22,0.3)' }}>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">All-Time Best</span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-base font-black text-amber-500">🏆 {streakInfo.longestStreak}</span>
              <span className="text-xs font-bold text-neutral-400">Days</span>
            </div>
          </div>
        </div>

        {/* 7-Day Flame Track (Snapchat-style Dots) */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
              <span>🔥</span>
              <span>Last 7 Days Activity</span>
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">
              {streakInfo.last7Days.filter(d => d.isCompleted).length} / 7 Days Completed
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {streakInfo.last7Days.map(item => (
              <div
                key={item.dateStr}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                  item.isCompleted
                    ? 'bg-gradient-to-b from-orange-600/20 to-amber-600/10 border-orange-500/50 shadow-sm'
                    : item.isToday
                    ? 'bg-orange-500/10 border-orange-400/50'
                    : 'border-transparent text-neutral-400'
                }`}
                style={theme === 'light' && !item.isCompleted && !item.isToday ? { backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' } : undefined}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  item.isToday ? 'text-amber-500 font-black' : 'text-neutral-400'
                }`}>
                  {item.dayLetter}
                </span>

                <div className={`w-8 h-8 rounded-full my-1 flex items-center justify-center text-sm transition-all ${
                  item.isCompleted
                    ? 'bg-gradient-to-tr from-orange-600 to-yellow-400 text-white shadow-sm scale-105'
                    : item.isToday
                    ? 'border-2 border-dashed border-orange-400 text-orange-500 animate-pulse font-bold text-xs'
                    : 'bg-neutral-800/40 text-neutral-400 text-xs'
                }`} style={theme === 'light' && !item.isCompleted && !item.isToday ? { backgroundColor: '#E2E8F0', color: '#94A3B8' } : undefined}>
                  {item.isCompleted ? '🔥' : item.isToday ? '⏳' : '·'}
                </div>

                <span className={`text-[10px] font-bold ${
                  item.isCompleted ? (theme === 'light' ? 'text-neutral-800' : 'text-white') : item.isToday ? 'text-amber-500' : 'text-neutral-400'
                }`}>
                  {item.dayNumber}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards (Bold Numbers like in Reference Image) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="This Week"
          value={thisWeekSessions.length}
          unit="sessions"
          icon={<CalendarIcon className="w-4 h-4" />}
        />
        <StatCard
          label="This Month"
          value={thisMonthSessions.length}
          unit="sessions"
          icon={<DumbbellIcon className="w-4 h-4" />}
        />
        <StatCard
          label="Volume Lifted"
          value={
            totalVolumeThisMonth > 1000
              ? `${(totalVolumeThisMonth / 1000).toFixed(1)}k`
              : totalVolumeThisMonth.toString()
          }
          unit="kg"
          icon={<TrendingUpIcon className="w-4 h-4" />}
        />
        <StatCard
          label="Days Remaining"
          value={daysRemaining}
          unit="days left"
          icon={<CalendarIcon className="w-4 h-4" />}
        />
      </div>

      {/* Monthly Goals Highlight with Direct Edit Capability */}
      {currentMonthGoals && currentMonthGoals.goals.length > 0 && (
        <Card className={`border transition-all ${theme === 'light' ? 'glass-card border-white/80' : 'border-white/10 bg-black/40 backdrop-blur-md'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">
                Active Monthly Goals
              </h2>
              <p className="text-[11px] text-neutral-400">Pacing against monthly timeline ({monthProgress}% completed) &bull; Click pencil to edit target</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/goals')}>
              Manage All
            </Button>
          </div>

          <div className="space-y-3">
            {currentMonthGoals.goals.slice(0, 3).map(goal => {
              const progress =
                goal.targetValue > 0
                  ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
                  : 0;
              const diff = Math.max(0, goal.targetValue - goal.currentValue);
              const isAchieved = goal.currentValue >= goal.targetValue;

              return (
                <div key={goal.id} className={`p-3.5 rounded-2xl border transition-all ${theme === 'light' ? 'bg-white/60 backdrop-blur-md border-white/80' : 'bg-black/35 backdrop-blur-sm border-white/10 hover:border-red-500/30'}`}>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-white text-sm">{goal.exerciseName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      {/* Direct Edit Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGoal(goal);
                          setIsGoalModalOpen(true);
                        }}
                        className={`p-1 rounded-lg transition-colors border ${theme === 'light' ? 'text-[#334155] hover:text-[#1A2238] hover:bg-[#FFF0ED] border-[#E2E8F0]' : 'text-neutral-400 hover:text-white hover:bg-white/10 border-white/10'}`}
                        title="Edit this goal"
                      >
                        <EditIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <ProgressBar
                    value={goal.currentValue}
                    max={goal.targetValue}
                    color={theme === 'light' ? 'bg-gradient-to-r from-[#FF5B45] to-[#FF7854]' : 'bg-red-600/70'}
                    showLabel={false}
                  />

                  <div className="flex justify-between text-[11px] text-neutral-400 mt-1.5 font-medium">
                    <span>{progress}% completed</span>
                    <span>
                      {isAchieved ? (
                        <strong className={theme === 'light' ? 'text-[#FF5B45] font-bold uppercase tracking-wider' : 'text-rose-300 font-bold uppercase tracking-wider'}>Goal Achieved</strong>
                      ) : (
                        <span>{diff} {goal.unit} remaining</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Quick Navigation Cards with Elaborated Labels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <Button
          variant="secondary"
          className={`w-full py-4 flex-col gap-1 rounded-2xl transition-all border ${
            theme === 'light'
              ? 'glass-card hover:border-[#FF5B45]/40 text-[#1A2238]'
              : 'border-white/10 bg-black/30 hover:border-red-500/40 hover:bg-black/50 backdrop-blur-md'
          }`}
          onClick={() => navigate('/planner')}
        >
          <CalendarIcon className={`w-5 h-5 ${theme === 'light' ? 'text-[#FF5B45]' : 'text-rose-300'}`} />
          <span className="text-xs font-bold uppercase tracking-wide">Weekly Plan</span>
          <span className={`text-[10px] font-semibold ${theme === 'light' ? 'text-[#475569]' : 'text-neutral-400'}`}>Configure Splits</span>
        </Button>
        <Button
          variant="secondary"
          className={`w-full py-4 flex-col gap-1 rounded-2xl transition-all border ${
            theme === 'light'
              ? 'glass-card hover:border-[#FF5B45]/40 text-[#1A2238]'
              : 'border-white/10 bg-black/30 hover:border-red-500/40 hover:bg-black/50 backdrop-blur-md'
          }`}
          onClick={() => navigate('/records')}
        >
          <RecordsIcon className={`w-5 h-5 ${theme === 'light' ? 'text-[#FF5B45]' : 'text-rose-300'}`} />
          <span className="text-xs font-bold uppercase tracking-wide">Workout History</span>
          <span className={`text-[10px] font-semibold ${theme === 'light' ? 'text-[#475569]' : 'text-neutral-400'}`}>6-Month Archive &amp; PRs</span>
        </Button>
        <Button
          variant="secondary"
          className={`w-full py-4 flex-col gap-1 rounded-2xl transition-all border ${
            theme === 'light'
              ? 'glass-card hover:border-[#FF5B45]/40 text-[#1A2238]'
              : 'border-white/10 bg-black/30 hover:border-red-500/40 hover:bg-black/50 backdrop-blur-md'
          }`}
          onClick={() => navigate('/reports')}
        >
          <ReportsIcon className={`w-5 h-5 ${theme === 'light' ? 'text-[#FF5B45]' : 'text-rose-300'}`} />
          <span className="text-xs font-bold uppercase tracking-wide">Progress Report</span>
          <span className={`text-[10px] font-semibold ${theme === 'light' ? 'text-[#475569]' : 'text-neutral-400'}`}>Volume &amp; Balance</span>
        </Button>
        <Button
          variant="secondary"
          className={`w-full py-4 flex-col gap-1 rounded-2xl transition-all border ${
            theme === 'light'
              ? 'glass-card hover:border-[#FF5B45]/40 text-[#1A2238]'
              : 'border-white/10 bg-black/30 hover:border-red-500/40 hover:bg-black/50 backdrop-blur-md'
          }`}
          onClick={() => navigate('/goals')}
        >
          <GoalsIcon className={`w-5 h-5 ${theme === 'light' ? 'text-[#FF5B45]' : 'text-rose-300'}`} />
          <span className="text-xs font-bold uppercase tracking-wide">Monthly Goals</span>
          <span className={`text-[10px] font-semibold ${theme === 'light' ? 'text-[#475569]' : 'text-neutral-400'}`}>Target Milestones</span>
        </Button>
      </div>

      {/* Edit Goal Modal from Dashboard */}
      <AddGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        initialGoal={editingGoal}
      />
    </div>
  );
}
