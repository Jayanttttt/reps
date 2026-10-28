import { ExerciseProgress, BODY_PART_LABELS } from '@shared/types';
import { useTheme } from '@shared/theme';
import { Card, Badge, TrendingUpIcon } from '@shared/components';
import { BODY_PART_COLORS } from '@shared/constants/exercises';

interface ExerciseProgressListProps {
  progressList: ExerciseProgress[];
}

export function ExerciseProgressList({ progressList }: ExerciseProgressListProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (progressList.length === 0) {
    return (
      <div className={`text-center py-8 rounded-xl text-xs font-medium border ${isLight ? 'glass-card border-white/80 text-[#475569]' : 'glass-card text-slate-300'}`}>
        No exercise progress data for this month.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className={`text-sm font-bold flex items-center gap-2 uppercase tracking-wider ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
        <TrendingUpIcon className={`w-4 h-4 ${isLight ? 'text-[#FF5B45]' : 'text-red-400'}`} />
        <span>Exercise-by-Exercise Strength Progress</span>
      </h3>

      <div className="space-y-2.5">
        {progressList.map(item => {
          const isGain = item.weightChange >= 0;
          return (
            <Card
              key={item.exerciseId}
              className={`p-3.5 transition-all ${
                isLight
                  ? 'border-white/80 hover:border-[#FF5B45]/40'
                  : 'hover:border-red-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
                      {item.exerciseName}
                    </span>
                    <Badge color={isLight ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/30' : BODY_PART_COLORS[item.bodyPart]}>
                      {BODY_PART_LABELS[item.bodyPart]}
                    </Badge>
                  </div>

                  <div className={`text-xs mt-1 flex items-center gap-2 flex-wrap font-medium ${isLight ? 'text-[#334155]' : 'text-slate-400'}`}>
                    <span>
                      Start: <strong className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-slate-200'}`}>{item.startWeight}kg</strong>
                    </span>
                    <span className={isLight ? 'text-[#64748B]' : 'text-neutral-400'}>&rarr;</span>
                    <span>
                      End: <strong className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{item.endWeight}kg</strong>
                    </span>
                    <span className={isLight ? 'text-[#475569]' : 'text-slate-500'}>
                      ({item.totalSets} sets, {item.totalReps} reps)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold flex items-center justify-end gap-1 ${
                        isGain
                          ? isLight ? 'text-[#FF5B45]' : 'text-rose-300'
                          : isLight ? 'text-[#64748B]' : 'text-neutral-400'
                      }`}
                    >
                      <span>{isGain ? '+' : ''}{item.weightChange} kg</span>
                      <span className="text-xs font-normal">
                        ({isGain ? '+' : ''}{item.weightChangePercent}%)
                      </span>
                    </div>
                    <div className={`text-[11px] mt-0.5 font-medium ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>
                      Volume: {item.totalVolume.toLocaleString()} kg
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
