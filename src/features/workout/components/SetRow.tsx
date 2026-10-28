import { ExerciseSet } from '@shared/types';
import { useTheme } from '@shared/theme';

interface SetRowProps {
  set: ExerciseSet;
  index: number;
  onUpdate: (updatedSet: ExerciseSet) => void;
  onDelete: () => void;
  targetWeight?: number;
  targetReps?: number;
}

export function SetRow({
  set,
  index,
  onUpdate,
  onDelete,
  targetWeight,
  targetReps,
}: SetRowProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all border ${
        set.isCompleted
          ? isLight
            ? 'bg-[#FFF9F8] border-[#FFE4DE] text-[#1A2238] shadow-xs'
            : 'bg-red-950/40 border-red-500/40 backdrop-blur-md shadow-sm'
          : isLight
          ? 'bg-[#F8FAFD] border-[#EEF2F6] text-[#1A2238]'
          : 'bg-black/35 border border-white/10 backdrop-blur-sm'
      }`}
    >
      {/* Set Number */}
      <span className={`w-5 text-center text-xs font-black shrink-0 ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>
        #{index + 1}
      </span>

      {/* Target hint (if applicable on desktop) */}
      {(targetWeight !== undefined || targetReps !== undefined) && (
        <span className={`hidden md:inline-block text-[11px] shrink-0 ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>
          ({targetWeight ?? '-'}kg×{targetReps ?? '-'})
        </span>
      )}

      {/* Inputs (Weight & Reps) */}
      <div className="flex items-center gap-1 shrink-0">
        <div className="flex items-center gap-0.5">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.5}
            value={set.weight === 0 ? '' : set.weight}
            placeholder="0"
            onChange={e =>
              onUpdate({
                ...set,
                weight: Math.max(0, parseFloat(e.target.value) || 0),
              })
            }
            className={`w-12 sm:w-16 rounded-lg px-1 py-1 text-xs sm:text-sm text-center font-bold border ${
              isLight
                ? 'bg-white/85 backdrop-blur-sm border-[#E2E8F0] focus:border-[#FF5B45] text-[#1A2238]'
                : 'bg-black/50 border-white/20 focus:border-red-500 text-white backdrop-blur-sm'
            }`}
          />
          <span className={`text-[10px] font-semibold ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>kg</span>
        </div>

        <span className={`text-xs px-0.5 font-bold ${isLight ? 'text-[#475569]' : 'text-slate-500'}`}>×</span>

        <div className="flex items-center gap-0.5">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={set.reps === 0 ? '' : set.reps}
            placeholder="0"
            onChange={e =>
              onUpdate({
                ...set,
                reps: Math.max(0, parseInt(e.target.value) || 0),
              })
            }
            className={`w-11 sm:w-14 rounded-lg px-1 py-1 text-xs sm:text-sm text-center font-bold border ${
              isLight
                ? 'bg-white/85 backdrop-blur-sm border-[#E2E8F0] focus:border-[#FF5B45] text-[#1A2238]'
                : 'bg-black/50 border-white/20 focus:border-red-500 text-white backdrop-blur-sm'
            }`}
          />
          <span className={`text-[10px] font-semibold ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>reps</span>
        </div>
      </div>

      {/* Action Controls - Aligned Right with ml-auto */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
        {/* Mark as Done Button */}
        <button
          type="button"
          onClick={() => onUpdate({ ...set, isCompleted: !set.isCompleted })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-manipulation whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center gap-1 shadow-sm ${
            set.isCompleted
              ? isLight
                ? 'keep-white-text border border-transparent shadow-[0_3px_12px_rgba(255,91,69,0.3)]'
                : 'bg-red-600 hover:bg-red-500 text-white border border-red-500/50'
              : isLight
              ? 'bg-[#F1F4F9] hover:bg-[#E5EBF4] text-[#1A2238] border border-[#E2E8F0]'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/20'
          }`}
          style={
            set.isCompleted && isLight
              ? {
                  background: 'linear-gradient(135deg, #FF5B45 0%, #FF7854 100%)',
                  color: '#FFFFFF',
                }
              : undefined
          }
          title={set.isCompleted ? 'Completed! Click to unmark' : 'Click to mark as done'}
        >
          <span style={{ color: set.isCompleted ? '#FFFFFF' : undefined }}>
            {set.isCompleted ? 'Done ✓' : 'Mark as Done'}
          </span>
        </button>

        {/* Remove Set Button */}
        <button
          type="button"
          onClick={onDelete}
          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
            isLight
              ? 'text-[#475569] hover:text-[#FF5B45] hover:bg-[#FFF0ED]'
              : 'text-neutral-400 hover:text-red-400 hover:bg-white/10'
          }`}
          title="Delete set"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
