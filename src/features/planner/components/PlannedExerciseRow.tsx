import { useState } from 'react';
import { useTheme } from '@shared/theme';
import { PlannedExercise, PreviousRecord, BODY_PART_LABELS } from '@shared/types';
import { Button, TrendingUpIcon, EditIcon, TrashIcon } from '@shared/components';

interface PlannedExerciseRowProps {
  exercise: PlannedExercise;
  previousRecord: PreviousRecord | null;
  prSuggestion: { suggestedWeight: number; message: string } | null;
  onUpdate: (updated: PlannedExercise) => void;
  onDelete: () => void;
}

export function PlannedExerciseRow({
  exercise,
  previousRecord,
  prSuggestion,
  onUpdate,
  onDelete,
}: PlannedExerciseRowProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isEditing, setIsEditing] = useState(false);
  const [sets, setSets] = useState(exercise.targetSets);
  const [reps, setReps] = useState(exercise.targetReps);
  const [weight, setWeight] = useState(exercise.targetWeight);

  const handleSave = () => {
    onUpdate({
      ...exercise,
      targetSets: Number(sets) || 1,
      targetReps: Number(reps) || 1,
      targetWeight: Number(weight) || 0,
    });
    setIsEditing(false);
  };

  return (
    <div
      className={`rounded-2xl p-3.5 border transition-all ${
        isLight
          ? 'bg-[#F8FAFD] border-[#EEF2F6] hover:border-[#FF5B45]/40 text-[#1A2238]'
          : 'bg-black/15 border-white/10 hover:border-red-500/35 text-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-sm tracking-tight ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
              {exercise.exerciseName}
            </span>
            <span
              className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase border ${
                isLight
                  ? 'bg-white text-[#5F6D7E] border-[#E2E8F0]'
                  : 'bg-white/10 text-neutral-300 border-white/15'
              }`}
            >
              {BODY_PART_LABELS[exercise.bodyPart]}
            </span>
          </div>

          {/* Previous record and PR suggestion */}
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {previousRecord ? (
              <div className={`flex items-center gap-1 font-medium ${isLight ? 'text-[#334155]' : 'text-neutral-300'}`}>
                <span className={isLight ? 'text-[#475569]' : 'text-neutral-400'}>Last:</span>
                <span className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
                  {previousRecord.bestWeight} kg &times; {previousRecord.bestReps} reps
                </span>
                <span className={`text-[11px] font-medium ${isLight ? 'text-[#475569]' : 'text-neutral-500'}`}>
                  ({previousRecord.date})
                </span>
              </div>
            ) : (
              <div className={`italic text-[11px] font-medium ${isLight ? 'text-[#475569]' : 'text-neutral-500'}`}>
                First time logging
              </div>
            )}
          </div>

          {prSuggestion && (
            <div
              className={`mt-1.5 text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-xl border w-fit ${
                isLight
                  ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/30'
                  : 'bg-red-600/20 text-rose-200 border-red-500/35 backdrop-blur-sm'
              }`}
            >
              <TrendingUpIcon className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-[#FF5B45]' : 'text-rose-300'}`} />
              <span>{prSuggestion.message}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'text-[#64748B] hover:text-[#1A2238] hover:bg-[#F1F4F9]'
                : 'text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            title="Edit target"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'text-[#64748B] hover:text-[#FF5B45] hover:bg-[#FFF0ED]'
                : 'text-neutral-400 hover:text-red-400 hover:bg-white/10'
            }`}
            title="Remove exercise"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target specs display / edit */}
      <div className={`mt-3 pt-2.5 border-t ${isLight ? 'border-[#EEF2F6]' : 'border-white/10'}`}>
        {isEditing ? (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <label className={`text-xs font-bold ${isLight ? 'text-[#5F6D7E]' : 'text-neutral-300'}`}>Sets:</label>
              <input
                type="number"
                min={1}
                max={20}
                value={sets}
                onChange={e => setSets(Number(e.target.value))}
                className={`w-14 rounded-lg px-2 py-1 text-xs text-center font-bold border ${
                  isLight
                    ? 'bg-white border-[#E2E8F0] text-[#1A2238] focus:border-[#FF5B45]'
                    : 'bg-black/60 border-red-500 text-white'
                }`}
              />
            </div>
            <div className="flex items-center gap-1">
              <label className={`text-xs font-bold ${isLight ? 'text-[#5F6D7E]' : 'text-neutral-300'}`}>Reps:</label>
              <input
                type="number"
                min={1}
                max={100}
                value={reps}
                onChange={e => setReps(Number(e.target.value))}
                className={`w-14 rounded-lg px-2 py-1 text-xs text-center font-bold border ${
                  isLight
                    ? 'bg-white border-[#E2E8F0] text-[#1A2238] focus:border-[#FF5B45]'
                    : 'bg-black/60 border-red-500 text-white'
                }`}
              />
            </div>
            <div className="flex items-center gap-1">
              <label className={`text-xs font-bold ${isLight ? 'text-[#5F6D7E]' : 'text-neutral-300'}`}>Weight (kg):</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className={`w-16 rounded-lg px-2 py-1 text-xs text-center font-bold border ${
                  isLight
                    ? 'bg-white border-[#E2E8F0] text-[#1A2238] focus:border-[#FF5B45]'
                    : 'bg-black/60 border-red-500 text-white'
                }`}
              />
            </div>
            <div className="flex gap-1.5 ml-auto">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSave}>
                Save Target
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center gap-4 font-medium ${isLight ? 'text-[#5F6D7E]' : 'text-neutral-300'}`}>
              <span>
                Target: <strong className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{exercise.targetSets}</strong> sets
              </span>
              <span>
                <strong className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{exercise.targetReps}</strong> reps
              </span>
              <span>
                @ <strong className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{exercise.targetWeight}</strong> kg
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
