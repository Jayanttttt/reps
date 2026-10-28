import { useState, useMemo } from 'react';
import { Exercise, BodyPart, BODY_PART_LABELS } from '@shared/types';
import { DEFAULT_EXERCISES } from '@shared/constants/exercises';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { Modal, Button } from '@shared/components';
import { generateId } from '@shared/utils/dateUtils';

interface ExercisePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  allowedBodyParts?: BodyPart[];
}

export function ExercisePicker({
  isOpen,
  onClose,
  onSelect,
  allowedBodyParts = [],
}: ExercisePickerProps) {
  const [customExercises, setCustomExercises] = useLocalStorage<Exercise[]>(
    STORAGE_KEYS.CUSTOM_EXERCISES,
    []
  );

  const [search, setSearch] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('all');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customBodyPart, setCustomBodyPart] = useState<BodyPart>(allowedBodyParts[0] || 'chest');

  const allExercises = useMemo(() => {
    return [...DEFAULT_EXERCISES, ...customExercises];
  }, [customExercises]);

  const filteredExercises = useMemo(() => {
    return allExercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesBodyPart =
        selectedBodyPart === 'all'
          ? (allowedBodyParts.length === 0 || allowedBodyParts.includes(ex.bodyPart))
          : ex.bodyPart === selectedBodyPart;
      return matchesSearch && matchesBodyPart;
    });
  }, [allExercises, search, selectedBodyPart, allowedBodyParts]);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newExercise: Exercise = {
      id: generateId(),
      name: customName.trim(),
      bodyPart: customBodyPart,
      isCustom: true,
    };

    setCustomExercises(prev => [...prev, newExercise]);
    onSelect(newExercise);
    setCustomName('');
    setIsCreatingCustom(false);
    onClose();
  };

  const bodyPartsToFilter = allowedBodyParts.length > 0 ? allowedBodyParts : (Object.keys(BODY_PART_LABELS) as BodyPart[]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Exercise" size="md">
      {!isCreatingCustom ? (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search exercise..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/45 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 text-sm backdrop-blur-sm"
              autoFocus
            />
          </div>

          {/* Body Part Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedBodyPart('all')}
              className={`px-3.5 py-1 rounded-xl whitespace-nowrap transition-all ${
                selectedBodyPart === 'all'
                  ? 'glass-tab-active font-bold'
                  : 'glass-tab-inactive bg-white/5'
              }`}
            >
              All {allowedBodyParts.length > 0 ? 'Selected' : ''}
            </button>
            {bodyPartsToFilter.map(bp => (
              <button
                key={bp}
                onClick={() => setSelectedBodyPart(bp)}
                className={`px-3.5 py-1 rounded-xl whitespace-nowrap transition-all ${
                  selectedBodyPart === bp
                    ? 'glass-tab-active font-bold'
                    : 'glass-tab-inactive bg-white/5'
                }`}
              >
                {BODY_PART_LABELS[bp]}
              </button>
            ))}
          </div>

          {/* Exercises List */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">
                No exercises found.
              </div>
            ) : (
              filteredExercises.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => {
                    onSelect(ex);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 hover:bg-white/10 cursor-pointer border border-white/10 hover:border-red-500/50 transition-all backdrop-blur-sm"
                >
                  <div>
                    <span className="font-semibold text-white text-sm drop-shadow">{ex.name}</span>
                    <span className="ml-2 text-xs text-slate-300">
                      ({BODY_PART_LABELS[ex.bodyPart]})
                    </span>
                  </div>
                  {ex.isCustom && (
                    <span className="text-[10px] bg-red-950/40 text-red-300 px-2 py-0.5 rounded border border-red-500/40 font-semibold">
                      Custom
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Custom Button */}
          <div className="pt-2 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-slate-300">Can't find your exercise?</span>
            <Button size="sm" variant="secondary" onClick={() => setIsCreatingCustom(true)}>
              + Add Custom
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreateCustom} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Exercise Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bulgarian Split Squat"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 text-sm backdrop-blur-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Body Part
            </label>
            <select
              value={customBodyPart}
              onChange={e => setCustomBodyPart(e.target.value as BodyPart)}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 text-sm backdrop-blur-sm"
            >
              {(Object.keys(BODY_PART_LABELS) as BodyPart[]).map(bp => (
                <option key={bp} value={bp}>
                  {BODY_PART_LABELS[bp]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsCreatingCustom(false)}>
              Back
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save & Add
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
