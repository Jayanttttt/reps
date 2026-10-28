import { useState } from 'react';
import { useTheme } from '@shared/theme';
import {
  DayPlan,
  DayOfWeek,
  BodyPart,
  BODY_PART_LABELS,
  DAY_LABELS,
  SplitType,
  PlannedExercise,
  WorkoutSession,
  Exercise,
} from '@shared/types';
import { BODY_PART_COLORS } from '@shared/constants/exercises';
import { Card, Button, Badge, SettingsIcon, PlusIcon, CalendarIcon } from '@shared/components';
import { ExercisePicker } from './ExercisePicker';
import { PlannedExerciseRow } from './PlannedExerciseRow';
import { getPreviousRecord, getPRSuggestion } from '@shared/utils/progressAnalyzer';

interface DayCardProps {
  day: DayOfWeek;
  plan: DayPlan;
  sessions: WorkoutSession[];
  onUpdatePlan: (updatedPlan: DayPlan) => void;
  isToday?: boolean;
}

export function DayCard({
  day,
  plan,
  sessions,
  onUpdatePlan,
  isToday = false,
}: DayCardProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isEditingSplit, setIsEditingSplit] = useState(false);

  // Toggle Rest Day
  const handleToggleRestDay = () => {
    onUpdatePlan({
      ...plan,
      isRestDay: !plan.isRestDay,
    });
  };

  // Change split type (single, double, triple, custom)
  const handleChangeSplitType = (splitType: SplitType) => {
    const limits: Record<SplitType, number> = { single: 1, double: 2, triple: 3, custom: 12 };
    const maxParts = limits[splitType];
    const adjustedBodyParts = plan.bodyParts.slice(0, maxParts);

    onUpdatePlan({
      ...plan,
      splitType,
      bodyParts: adjustedBodyParts,
    });
  };

  // Toggle body part selection
  const handleToggleBodyPart = (bp: BodyPart) => {
    let newBodyParts = [...plan.bodyParts];
    let newSplitType = plan.splitType;

    if (newBodyParts.includes(bp)) {
      newBodyParts = newBodyParts.filter(p => p !== bp);
    } else {
      newBodyParts.push(bp);
      if (newBodyParts.length > 3) {
        newSplitType = 'custom';
      } else if (newBodyParts.length === 3 && plan.splitType === 'single') {
        newSplitType = 'triple';
      } else if (newBodyParts.length === 2 && plan.splitType === 'single') {
        newSplitType = 'double';
      }
    }

    onUpdatePlan({
      ...plan,
      splitType: newSplitType,
      bodyParts: newBodyParts,
    });
  };

  // Add exercise to day plan
  const handleAddExercise = (exercise: Exercise) => {
    const prev = getPreviousRecord(sessions, exercise.id);
    const targetWeight = prev ? prev.bestWeight : 20;
    const targetReps = prev ? prev.bestReps : 10;

    const newPlannedExercise: PlannedExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      bodyPart: exercise.bodyPart,
      targetSets: 3,
      targetReps: targetReps,
      targetWeight: targetWeight,
    };

    onUpdatePlan({
      ...plan,
      exercises: [...plan.exercises, newPlannedExercise],
    });
  };

  // Update planned exercise
  const handleUpdateExercise = (index: number, updated: PlannedExercise) => {
    const newExercises = [...plan.exercises];
    newExercises[index] = updated;
    onUpdatePlan({
      ...plan,
      exercises: newExercises,
    });
  };

  // Remove planned exercise
  const handleRemoveExercise = (index: number) => {
    const newExercises = plan.exercises.filter((_, i) => i !== index);
    onUpdatePlan({
      ...plan,
      exercises: newExercises,
    });
  };

  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Card
      className={`transition-all ${
        isToday
          ? isLight
            ? 'border-[#FF5B45]/60 ring-2 ring-[#FF5B45]/20 shadow-md'
            : 'border-red-500/50 ring-1 ring-red-500/30'
          : ''
      }`}
    >
      {/* Day Header */}
      <div className={`flex items-center justify-between flex-wrap gap-2 pb-3 border-b ${isLight ? 'border-[#EEF2F6]' : 'border-white/10'}`}>
        <div className="flex items-center gap-2">
          <h3 className={`text-base font-black tracking-tight uppercase ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
            {DAY_LABELS[day]}
          </h3>
          {isToday && (
            <span
              className={`text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase shadow-sm ${
                isLight
                  ? 'bg-[#FFF0ED] text-[#FF5B45] border border-[#FF5B45]/30'
                  : 'bg-red-600/25 text-red-200 border border-red-500/40 backdrop-blur-md'
              }`}
            >
              Today
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Rest day button */}
          <button
            onClick={handleToggleRestDay}
            className={`text-xs px-3 py-1 rounded-xl font-bold uppercase tracking-wider transition-colors border ${
              plan.isRestDay
                ? isLight
                  ? 'bg-[#F1F4F9] text-[#64748B] border-[#E2E8F0] hover:bg-[#E5EBF4]'
                  : 'bg-neutral-800 text-neutral-300 border-white/15'
                : isLight
                ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/40 hover:bg-[#FFE5DF]'
                : 'bg-red-600/20 text-red-300 border-red-500/40 hover:bg-red-600/30'
            }`}
          >
            {plan.isRestDay ? 'Rest Day' : 'Active Split'}
          </button>

          {!plan.isRestDay && (
            <button
              onClick={() => setIsEditingSplit(!isEditingSplit)}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight
                  ? 'text-[#64748B] hover:text-[#1A2238] hover:bg-[#F1F4F9]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
              title="Configure Split"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Rest Day view */}
      {plan.isRestDay ? (
        <div className={`py-7 text-center ${isLight ? 'text-[#64748B]' : 'text-neutral-400'}`}>
          <div
            className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2 border ${
              isLight
                ? 'bg-[#F1F4F9] border-[#E2E8F0] text-[#FF5B45]'
                : 'bg-white/5 border-white/10 text-neutral-400'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
          </div>
          <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[#1A2238]' : 'text-neutral-300'}`}>
            Scheduled Recovery Day
          </p>
          <p className={`text-[11px] mt-0.5 font-medium ${isLight ? 'text-[#475569]' : 'text-neutral-500'}`}>
            Muscle recovery in progress
          </p>
        </div>
      ) : (
        <div className="pt-3 space-y-3">
          {/* Split Configuration drawer */}
          {isEditingSplit && (
            <div
              className={`p-4 rounded-2xl border space-y-3 text-xs ${
                isLight
                  ? 'bg-[#F8FAFD] border-[#EEF2F6] text-[#1A2238] shadow-sm'
                  : 'bg-black/60 backdrop-blur-xl border-white/15 text-white shadow-2xl'
              }`}
            >
              <div>
                <label className={`block font-bold uppercase tracking-wider text-[11px] mb-2 ${isLight ? 'text-[#1A2238]' : 'text-neutral-300'}`}>
                  Split Configuration (Target muscle groups):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['single', 'double', 'triple', 'custom'] as SplitType[]).map(st => (
                    <button
                      key={st}
                      onClick={() => handleChangeSplitType(st)}
                      className={`py-2 px-2 rounded-xl font-bold uppercase tracking-wider text-center transition-all border text-[11px] ${
                        plan.splitType === st
                          ? isLight
                            ? 'bg-gradient-to-r from-[#FF5B45] to-[#FF7854] text-white border-transparent shadow-sm'
                            : 'bg-red-600/30 text-white border-red-400/60 shadow-md shadow-black/30 backdrop-blur-md'
                          : isLight
                          ? 'bg-white text-[#5F6D7E] border-[#E2E8F0] hover:bg-[#F1F4F9]'
                          : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {st === 'single' ? '1 Group' : st === 'double' ? '2 Groups' : st === 'triple' ? '3 Groups' : 'Custom (4+ Any)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block font-bold uppercase tracking-wider text-[11px] mb-2 ${isLight ? 'text-[#1A2238]' : 'text-neutral-300'}`}>
                  Select Muscle Groups ({plan.bodyParts.length} selected &bull; select as many as you want):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(Object.keys(BODY_PART_LABELS) as BodyPart[]).map(bp => {
                    const isSelected = plan.bodyParts.includes(bp);
                    return (
                      <button
                        key={bp}
                        onClick={() => handleToggleBodyPart(bp)}
                        className={`py-1.5 px-2.5 rounded-xl flex items-center justify-between text-left text-xs transition-colors border ${
                          isSelected
                            ? isLight
                              ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45] font-bold shadow-sm'
                              : 'bg-red-600/25 text-red-200 border-red-500 font-bold shadow-sm shadow-red-600/20'
                            : isLight
                            ? 'bg-white text-[#5F6D7E] border-[#E2E8F0] hover:border-[#CBD5E1]'
                            : 'bg-black/30 text-neutral-300 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <span className="font-semibold uppercase text-[11px] tracking-wide">{BODY_PART_LABELS[bp]}</span>
                        {isSelected && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#FF5B45]' : 'bg-red-400'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-right pt-1">
                <Button size="sm" variant="secondary" onClick={() => setIsEditingSplit(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}

          {/* Body Part Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-[#334155]' : 'text-neutral-400'}`}>
              Focus:
            </span>
            {plan.bodyParts.length === 0 ? (
              <span className={`text-xs italic ${isLight ? 'text-[#475569]' : 'text-neutral-400'}`}>
                No muscle groups selected yet. Configure via settings icon.
              </span>
            ) : (
              plan.bodyParts.map(bp => (
                <Badge key={bp} color={isLight ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/30' : BODY_PART_COLORS[bp]}>
                  {BODY_PART_LABELS[bp]}
                </Badge>
              ))
            )}
          </div>

          {/* Planned Exercises List */}
          <div className="space-y-2 pt-1">
            {plan.exercises.length === 0 ? (
              <div
                className={`text-center py-5 text-xs rounded-xl font-medium border border-dashed ${
                  isLight
                    ? 'border-[#E2E8F0] text-[#475569] bg-[#F8FAFD]'
                    : 'border-white/15 text-neutral-400'
                }`}
              >
                No exercises planned for {DAY_LABELS[day]}.
              </div>
            ) : (
              plan.exercises.map((exercise, idx) => {
                const prev = getPreviousRecord(sessions, exercise.exerciseId);
                const pr = getPRSuggestion(prev, 2.0);

                return (
                  <PlannedExerciseRow
                    key={`${exercise.exerciseId}-${idx}`}
                    exercise={exercise}
                    previousRecord={prev}
                    prSuggestion={pr}
                    onUpdate={updated => handleUpdateExercise(idx, updated)}
                    onDelete={() => handleRemoveExercise(idx)}
                  />
                );
              })
            )}
          </div>

          {/* Add Exercise Button */}
          <Button
            size="sm"
            variant="secondary"
            className={`w-full mt-2 font-bold uppercase tracking-wide text-xs border ${
              isLight
                ? 'border-[#E2E8F0] hover:border-[#FF5B45]/40 text-[#1A2238] bg-[#F1F4F9]'
                : 'border-white/15 hover:border-red-500/40'
            }`}
            onClick={() => setIsPickerOpen(true)}
          >
            <PlusIcon className={`w-3.5 h-3.5 mr-1 ${isLight ? 'text-[#FF5B45]' : 'text-red-500'}`} />
            <span>Add Exercise</span>
          </Button>

          {/* Exercise Picker Modal */}
          <ExercisePicker
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            onSelect={handleAddExercise}
            allowedBodyParts={plan.bodyParts}
          />
        </div>
      )}
    </Card>
  );
}
