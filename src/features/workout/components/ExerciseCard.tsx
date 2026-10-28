import { useState } from 'react';
import { useTheme } from '@shared/theme';
import {
  ExerciseLog,
  ExerciseSet,
  PreviousRecord,
  BODY_PART_LABELS,
} from '@shared/types';
import { BODY_PART_COLORS } from '@shared/constants/exercises';
import { Card, Button, Badge, TrendingUpIcon } from '@shared/components';
import { SetRow } from './SetRow';

interface ExerciseCardProps {
  exerciseLog: ExerciseLog;
  previousRecord: PreviousRecord | null;
  prSuggestion: { suggestedWeight: number; message: string } | null;
  targetWeight?: number;
  targetReps?: number;
  onUpdate: (updatedLog: ExerciseLog) => void;
  onRemove: () => void;
}

export function ExerciseCard({
  exerciseLog,
  previousRecord,
  prSuggestion,
  targetWeight,
  targetReps,
  onUpdate,
  onRemove,
}: ExerciseCardProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [showNotes, setShowNotes] = useState(Boolean(exerciseLog.notes));

  const handleUpdateSet = (index: number, updatedSet: ExerciseSet) => {
    const newSets = [...exerciseLog.sets];
    newSets[index] = updatedSet;
    onUpdate({
      ...exerciseLog,
      sets: newSets,
    });
  };

  const handleAddSet = () => {
    const lastSet = exerciseLog.sets[exerciseLog.sets.length - 1];
    const newSet: ExerciseSet = {
      setNumber: exerciseLog.sets.length + 1,
      weight: lastSet ? lastSet.weight : (targetWeight || 20),
      reps: lastSet ? lastSet.reps : (targetReps || 10),
      isCompleted: false,
    };

    onUpdate({
      ...exerciseLog,
      sets: [...exerciseLog.sets, newSet],
    });
  };

  const handleDeleteSet = (index: number) => {
    const newSets = exerciseLog.sets
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));

    onUpdate({
      ...exerciseLog,
      sets: newSets,
    });
  };

  const completedSetsCount = exerciseLog.sets.filter(s => s.isCompleted).length;

  return (
    <Card className="p-3 sm:p-5 space-y-3 sm:space-y-4 overflow-hidden">
      {/* Exercise Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-white drop-shadow">
              {exerciseLog.exerciseName}
            </h3>
            <Badge color={BODY_PART_COLORS[exerciseLog.bodyPart]}>
              {BODY_PART_LABELS[exerciseLog.bodyPart]}
            </Badge>
          </div>

          {/* Previous record display */}
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-300">
            {previousRecord ? (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Last workout:</span>
                <span className="text-white font-semibold">
                  {previousRecord.bestWeight} kg × {previousRecord.bestReps} reps
                </span>
                <span className="text-slate-400">({previousRecord.date})</span>
              </div>
            ) : (
              <span className="text-slate-400 italic">No previous logs for this exercise</span>
            )}
          </div>

          {/* PR recommendation */}
          {prSuggestion && (
            <div className={`mt-2 text-xs font-semibold px-2.5 py-1 rounded-xl w-fit flex items-center gap-1.5 border backdrop-blur-sm ${
              isLight
                ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/35'
                : 'text-rose-200 bg-red-600/20 border-red-500/35'
            }`}>
              <TrendingUpIcon className={`w-3.5 h-3.5 ${isLight ? 'text-[#FF5B45]' : 'text-rose-300'}`} />
              <span>{prSuggestion.message}</span>
            </div>
          )}
        </div>

        {/* Remove exercise button */}
        <button
          onClick={onRemove}
          className={`p-1.5 rounded-lg transition-colors ${
            isLight
              ? 'text-[#64748B] hover:text-[#FF5B45] hover:bg-[#FFF0ED]'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Remove exercise from workout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Sets Column Header */}
      <div className="space-y-2">
        <div className={`flex justify-between items-center text-xs px-2 ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
          <span>Completed: <strong className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{completedSetsCount}</strong> / {exerciseLog.sets.length} sets</span>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`font-semibold transition-colors cursor-pointer ${
              isLight ? 'text-[#334155] hover:text-[#FF5B45]' : 'text-slate-300 hover:text-white'
            }`}
          >
            {showNotes ? 'Hide Note' : '+ Note'}
          </button>
        </div>

        {/* Sets list */}
        <div className="space-y-1.5">
          {exerciseLog.sets.map((set, idx) => (
            <SetRow
              key={idx}
              set={set}
              index={idx}
              targetWeight={targetWeight}
              targetReps={targetReps}
              onUpdate={updated => handleUpdateSet(idx, updated)}
              onDelete={() => handleDeleteSet(idx)}
            />
          ))}
        </div>

        {/* Add Set Button */}
        <button
          type="button"
          onClick={handleAddSet}
          className={`w-full py-2.5 text-xs font-bold rounded-xl border border-dashed transition-all cursor-pointer ${
            isLight
              ? 'border-[#E2E8F0] text-[#334155] hover:text-[#FF5B45] hover:bg-[#FFF0ED] hover:border-[#FF5B45]/40'
              : 'border-white/20 text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
        >
          + Add Set
        </button>
      </div>

      {/* Notes */}
      {showNotes && (
        <div>
          <textarea
            placeholder="Exercise notes (form cues, grip, feelings)..."
            value={exerciseLog.notes || ''}
            onChange={e => onUpdate({ ...exerciseLog, notes: e.target.value })}
            className="w-full bg-black/45 border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 h-16 backdrop-blur-sm"
          />
        </div>
      )}
    </Card>
  );
}
