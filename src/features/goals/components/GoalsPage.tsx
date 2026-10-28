import { useState, useMemo } from 'react';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { useTheme } from '@shared/theme';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { MonthGoals, MonthlyGoal, WorkoutSession } from '@shared/types';
import { getCurrentMonth, getPreviousMonth, formatMonth, getMonthDates } from '@shared/utils/dateUtils';
import { Button, GoalsIcon, PlusIcon } from '@shared/components';
import { SectionHelpButton } from '../../help';
import { MonthProgress } from './MonthProgress';
import { GoalCard } from './GoalCard';
import { AddGoalModal } from './AddGoalModal';

export default function GoalsPage() {
  const currentMonth = getCurrentMonth();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

  const [allMonthGoals, setAllMonthGoals] = useLocalStorage<MonthGoals[]>(
    STORAGE_KEYS.MONTHLY_GOALS,
    []
  );

  const [sessions] = useLocalStorage<WorkoutSession[]>(
    STORAGE_KEYS.WORKOUT_SESSIONS,
    []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<MonthlyGoal | null>(null);

  // Available months (last 6 months)
  const availableMonths = useMemo(() => {
    const list: string[] = [];
    let cur = currentMonth;
    for (let i = 0; i < 6; i++) {
      list.push(cur);
      cur = getPreviousMonth(cur);
    }
    return list;
  }, [currentMonth]);

  // Current month's saved goals entry
  const monthGoalsEntry = allMonthGoals.find(g => g.month === selectedMonth);

  // Compute live progress from workout sessions for the selected month
  const evaluatedGoals: MonthlyGoal[] = useMemo(() => {
    if (!monthGoalsEntry) return [];

    const { start, end } = getMonthDates(selectedMonth);
    const monthSessions = sessions.filter(
      s => s.completed && s.date >= start && s.date <= end
    );

    return monthGoalsEntry.goals.map(goal => {
      let currentValue = 0;

      for (const session of monthSessions) {
        for (const exercise of session.exercises) {
          if (exercise.exerciseId === goal.exerciseId) {
            for (const set of exercise.sets) {
              if (!set.isCompleted) continue;

              if (goal.metric === 'weight') {
                if (set.weight > currentValue) currentValue = set.weight;
              } else if (goal.metric === 'reps') {
                if (set.reps > currentValue) currentValue = set.reps;
              } else if (goal.metric === 'volume') {
                currentValue += set.weight * set.reps;
              }
            }
          }
        }
      }

      return {
        ...goal,
        currentValue: Math.round(currentValue * 10) / 10,
      };
    });
  }, [monthGoalsEntry, selectedMonth, sessions]);

  // Save/Update Goal
  const handleSaveGoal = (goalToSave: MonthlyGoal) => {
    setAllMonthGoals(prev => {
      const existingEntry = prev.find(g => g.month === selectedMonth);

      if (!existingEntry) {
        const newEntry: MonthGoals = {
          month: selectedMonth,
          goals: [goalToSave],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [...prev, newEntry];
      }

      const isExisting = existingEntry.goals.some(g => g.id === goalToSave.id);
      const updatedGoals = isExisting
        ? existingEntry.goals.map(g => (g.id === goalToSave.id ? goalToSave : g))
        : [...existingEntry.goals, goalToSave];

      return prev.map(entry =>
        entry.month === selectedMonth
          ? { ...entry, goals: updatedGoals, updatedAt: new Date().toISOString() }
          : entry
      );
    });
  };

  // Delete Goal
  const handleDeleteGoal = (goalId: string) => {
    setAllMonthGoals(prev =>
      prev.map(entry =>
        entry.month === selectedMonth
          ? {
              ...entry,
              goals: entry.goals.filter(g => g.id !== goalId),
              updatedAt: new Date().toISOString(),
            }
          : entry
      )
    );
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
              <GoalsIcon className="w-6 h-6" />
            </span>
            <span>Monthly Fitness Goals</span>
          </h1>
          <p className={`text-xs sm:text-sm mt-1 font-medium ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
            Set target weights, reps, or monthly volume and monitor how far you are from reaching them.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SectionHelpButton tab="goals" title="Goals Guide" />
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setEditingGoal(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 font-bold"
          >
            <PlusIcon className="w-4 h-4" /> Set New Goal
          </Button>
        </div>
      </div>

      {/* Month Progress & Selector */}
      <MonthProgress month={selectedMonth} />

      {/* Month Filter Bar */}
      <div className={`p-3.5 rounded-2xl flex items-center justify-between flex-wrap gap-2 border transition-all ${isLight ? 'glass-card border-white/80' : 'glass-card'}`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>
            Viewing Goals for:
          </span>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none transition-colors border ${
              isLight
                ? 'bg-[#F8FAFD] border-[#E2E8F0] text-[#1A2238] focus:border-[#FF5B45]'
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
          Goals active: <strong className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{evaluatedGoals.length}</strong>
        </span>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {evaluatedGoals.length === 0 ? (
          <div className="text-center py-14 glass-card rounded-2xl border-dashed border-white/20 p-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-3">
              <GoalsIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              No goals set for {formatMonth(selectedMonth)}
            </h3>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
              Set monthly targets like "Bench Press 80kg" or "1000kg Squat Volume" to keep yourself accountable and driven.
            </p>
            <Button
              size="sm"
              variant="primary"
              className="mt-4 font-bold"
              onClick={() => {
                setEditingGoal(null);
                setIsModalOpen(true);
              }}
            >
              Set First Goal
            </Button>
          </div>
        ) : (
          evaluatedGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => {
                setEditingGoal(goal);
                setIsModalOpen(true);
              }}
              onDelete={() => handleDeleteGoal(goal.id)}
            />
          ))
        )}
      </div>

      {/* Add / Edit Goal Modal */}
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        initialGoal={editingGoal}
      />
    </div>
  );
}
