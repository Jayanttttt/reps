import { useState, useMemo, useEffect } from 'react';
import { MonthlyGoal, Exercise, BodyPart, BODY_PART_LABELS } from '@shared/types';
import { useTheme } from '@shared/theme';
import { DEFAULT_EXERCISES } from '@shared/constants/exercises';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { Modal, Button } from '@shared/components';
import { generateId } from '@shared/utils/dateUtils';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: MonthlyGoal) => void;
  initialGoal?: MonthlyGoal | null;
}

export function AddGoalModal({
  isOpen,
  onClose,
  onSave,
  initialGoal,
}: AddGoalModalProps) {
  const [customExercises] = useLocalStorage<Exercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES, []);
  const allExercises = useMemo(() => [...DEFAULT_EXERCISES, ...customExercises], [customExercises]);

  const [exerciseId, setExerciseId] = useState(
    initialGoal?.exerciseId || allExercises[0]?.id || 'bench-press'
  );
  const [metric, setMetric] = useState<'weight' | 'reps' | 'volume'>(
    initialGoal?.metric || 'weight'
  );
  const [targetValue, setTargetValue] = useState<number>(
    initialGoal?.targetValue || 80
  );
  const [description, setDescription] = useState(initialGoal?.description || '');

  // Synchronize form whenever editing a goal or reopening modal
  useEffect(() => {
    if (initialGoal) {
      setExerciseId(initialGoal.exerciseId);
      setMetric(initialGoal.metric);
      setTargetValue(initialGoal.targetValue);
      setDescription(initialGoal.description || '');
    } else {
      setExerciseId(allExercises[0]?.id || 'bench-press');
      setMetric('weight');
      setTargetValue(80);
      setDescription('');
    }
  }, [initialGoal, isOpen, allExercises]);

  const selectedExercise = allExercises.find(e => e.id === exerciseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExercise) return;

    const unit = metric === 'weight' ? 'kg' : metric === 'reps' ? 'reps' : 'kg volume';

    const goalToSave: MonthlyGoal = {
      id: initialGoal ? initialGoal.id : generateId(),
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      bodyPart: selectedExercise.bodyPart,
      metric,
      targetValue: Number(targetValue) || 1,
      currentValue: initialGoal ? initialGoal.currentValue : 0,
      unit,
      description: description.trim(),
    };

    onSave(goalToSave);
    onClose();
  };

  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialGoal ? 'Edit Monthly Goal' : 'Set New Monthly Goal'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exercise Selection */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>
            Exercise
          </label>
          <select
            value={exerciseId}
            onChange={e => setExerciseId(e.target.value)}
            className={`w-full rounded-xl p-2.5 text-sm font-semibold transition-colors border ${
              isLight
                ? 'bg-[#F8FAFD] border-[#E2E8F0] text-[#1A2238] focus:border-[#FF5B45]'
                : 'bg-black/60 border-white/20 text-white focus:border-red-500'
            }`}
          >
            {allExercises.map(ex => (
              <option key={ex.id} value={ex.id} className={isLight ? 'bg-white text-[#1A2238]' : 'bg-neutral-900 text-white'}>
                {ex.name} ({BODY_PART_LABELS[ex.bodyPart]})
              </option>
            ))}
          </select>
        </div>

        {/* Metric Selection */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>
            Target Metric
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'weight', label: 'Max Weight (kg)' },
              { id: 'reps', label: 'Max Reps' },
              { id: 'volume', label: 'Monthly Volume (kg)' },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetric(m.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                  metric === m.id
                    ? 'glass-tab-active font-bold'
                    : isLight
                    ? 'bg-[#F1F4F9] text-[#475569] border border-[#E2E8F0] hover:bg-[#E5EBF4]'
                    : 'glass-tab-inactive bg-black/30'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Value Input */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>
            Target Value ({metric === 'weight' ? 'kg' : metric === 'reps' ? 'reps' : 'kg volume'})
          </label>
          <input
            type="number"
            step={metric === 'reps' ? 1 : 0.5}
            min={1}
            required
            value={targetValue}
            onChange={e => setTargetValue(parseFloat(e.target.value) || 0)}
            className={`w-full rounded-xl p-2.5 text-sm font-bold transition-colors border ${
              isLight
                ? 'bg-[#F8FAFD] border-[#E2E8F0] text-[#1A2238] focus:border-[#FF5B45]'
                : 'bg-black/60 border-white/20 text-white focus:border-red-500'
            }`}
          />
        </div>

        {/* Optional Description */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>
            Motivation / Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Hit 80kg bench before month end!"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={`w-full rounded-xl p-2.5 text-xs transition-colors border ${
              isLight
                ? 'bg-[#F8FAFD] border-[#E2E8F0] text-[#1A2238] placeholder-[#475569] focus:border-[#FF5B45]'
                : 'bg-black/60 border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-red-500'
            }`}
          />
        </div>

        <div className={`flex gap-2 justify-end pt-3 border-t ${isLight ? 'border-[#EEF2F6]' : 'border-white/10'}`}>
          <Button variant="ghost" size="sm" onClick={onClose} className={isLight ? 'text-[#475569] hover:bg-[#F1F4F9]' : ''}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {initialGoal ? 'Update Goal' : 'Save Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
