import { useState } from 'react';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { useTheme } from '@shared/theme';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { createDefaultPlan } from '@shared/constants/defaultPlan';
import {
  WeeklyPlan,
  DayPlan,
  DayOfWeek,
  DAYS_OF_WEEK,
  WorkoutSession,
} from '@shared/types';
import { getTodayDayOfWeek } from '@shared/utils/dateUtils';
import { Button, Tabs, CalendarIcon, RefreshIcon } from '@shared/components';
import { SectionHelpButton } from '../../help';
import { DayCard } from './DayCard';

export default function WeeklyPlanner() {
  const [storedPlan, setWeeklyPlan] = useLocalStorage<WeeklyPlan>(
    STORAGE_KEYS.WEEKLY_PLAN,
    createDefaultPlan()
  );

  const [sessions] = useLocalStorage<WorkoutSession[]>(
    STORAGE_KEYS.WORKOUT_SESSIONS,
    []
  );

  // Guarantee valid weekly plan structure even if storage had bad data
  const weeklyPlan: WeeklyPlan = storedPlan && storedPlan.days ? storedPlan : createDefaultPlan();

  const today = getTodayDayOfWeek();
  const [activeTab, setActiveTab] = useState<string>('all');

  const handleUpdateDay = (day: DayOfWeek, updatedPlan: DayPlan) => {
    setWeeklyPlan(prev => {
      const base = prev && prev.days ? prev : createDefaultPlan();
      return {
        ...base,
        updatedAt: new Date().toISOString(),
        days: {
          ...base.days,
          [day]: updatedPlan,
        },
      };
    });
  };

  const handleResetToDefault = () => {
    if (confirm('Reset weekly plan to recommended split? Your custom entries will be reset.')) {
      setWeeklyPlan(createDefaultPlan());
    }
  };

  const dayTabs = [
    { id: 'all', label: 'All Days', icon: <CalendarIcon className="w-3.5 h-3.5" /> },
    ...DAYS_OF_WEEK.map(d => ({
      id: d,
      label: d === today ? `${d.slice(0, 3).toUpperCase()} (TODAY)` : d.slice(0, 3).toUpperCase(),
    })),
  ];

  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${isLight ? 'text-[#FF5B45]' : 'text-rose-300/90'}`}>
            Routine Architecture
          </span>
          <h1 className={`text-3xl font-black tracking-tight ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
            Weekly Workout Planner
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 font-medium ${isLight ? 'text-[#5F6D7E]' : 'text-neutral-400'}`}>
            Configure muscle splits (single, double, triple), plan exercises, and track progressive overload targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SectionHelpButton tab="planner" title="Planner Guide" />
          <Button size="sm" variant="secondary" onClick={handleResetToDefault} className="font-bold text-xs">
            <RefreshIcon className="w-3.5 h-3.5 mr-1" />
            <span>Reset Split</span>
          </Button>
        </div>
      </div>

      {/* Tabs for Day navigation */}
      <Tabs
        tabs={dayTabs}
        activeTab={activeTab}
        onChange={tabId => setActiveTab(tabId)}
      />

      {/* Days List */}
      <div className="space-y-4">
        {DAYS_OF_WEEK.filter(day => activeTab === 'all' || activeTab === day).map(day => {
          const dayPlan: DayPlan = weeklyPlan.days?.[day] || {
            day,
            isRestDay: false,
            splitType: 'single',
            bodyParts: [],
            exercises: [],
          };

          return (
            <DayCard
              key={day}
              day={day}
              plan={dayPlan}
              sessions={sessions}
              onUpdatePlan={updatedPlan => handleUpdateDay(day, updatedPlan)}
              isToday={day === today}
            />
          );
        })}
      </div>
    </div>
  );
}
