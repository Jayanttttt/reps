import { useState, useMemo } from 'react';
import { WorkoutSession, Exercise, BODY_PART_LABELS } from '@shared/types';
import { useTheme } from '@shared/theme';
import { DEFAULT_EXERCISES } from '@shared/constants/exercises';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { Card, Badge, TrophyIcon, CalendarIcon } from '@shared/components';
import { formatDate } from '@shared/utils/dateUtils';
import { getExerciseHistory } from '@shared/utils/progressAnalyzer';

interface ExerciseHistoryProps {
  sessions: WorkoutSession[];
}

export function ExerciseHistory({ sessions }: ExerciseHistoryProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [customExercises] = useLocalStorage<Exercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES, []);
  const allExercises = useMemo(() => [...DEFAULT_EXERCISES, ...customExercises], [customExercises]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    allExercises[0]?.id || 'bench-press'
  );

  const selectedExercise = allExercises.find(e => e.id === selectedExerciseId);

  const history = useMemo(() => {
    return getExerciseHistory(sessions, selectedExerciseId);
  }, [sessions, selectedExerciseId]);

  // Calculate Personal Record (PR)
  const personalBest = useMemo(() => {
    let maxWeight = 0;
    let maxWeightReps = 0;
    let prDate = '';

    for (const item of history) {
      for (const set of item.log.sets) {
        if (set.isCompleted && set.weight > maxWeight) {
          maxWeight = set.weight;
          maxWeightReps = set.reps;
          prDate = item.date;
        }
      }
    }

    return maxWeight > 0 ? { weight: maxWeight, reps: maxWeightReps, date: prDate } : null;
  }, [history]);

  return (
    <div className="space-y-4">
      {/* Exercise Selector */}
      <div className={`p-3.5 rounded-2xl border transition-all ${isLight ? 'glass-card border-white/80' : 'glass-card'}`}>
        <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>
          Select Exercise to Track Progression
        </label>
        <select
          value={selectedExerciseId}
          onChange={e => setSelectedExerciseId(e.target.value)}
          className={`w-full rounded-xl p-2.5 text-sm font-semibold transition-colors border ${
            isLight
              ? 'bg-white/80 backdrop-blur-md border-[#E2E8F0] text-[#1A2238] focus:border-[#FF5B45]'
              : 'bg-black/40 border-white/20 text-white focus:border-red-500'
          }`}
        >
          {allExercises.map(ex => (
            <option key={ex.id} value={ex.id} className={isLight ? 'bg-white text-[#1A2238]' : 'bg-neutral-900 text-white'}>
              {ex.name} ({BODY_PART_LABELS[ex.bodyPart]})
            </option>
          ))}
        </select>
      </div>

      {/* PR Badge Card */}
      {personalBest && (
        <Card className={`flex items-center justify-between p-4 border transition-all ${isLight ? 'border-white/80' : 'border-red-500/40'}`}>
          <div>
            <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-[#FF5B45]' : 'text-rose-300 drop-shadow'}`}>
              <TrophyIcon className={`w-4 h-4 ${isLight ? 'text-[#FF5B45]' : 'text-rose-400'}`} />
              <span>All-Time PR</span>
            </div>
            <div className={`text-2xl font-black mt-0.5 ${isLight ? 'text-[#1A2238]' : 'text-white drop-shadow'}`}>
              {personalBest.weight} kg <span className={`text-sm font-normal ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>× {personalBest.reps} reps</span>
            </div>
          </div>
          <div className={`text-xs text-right ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
            Achieved on <br />
            <span className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{formatDate(personalBest.date)}</span>
          </div>
        </Card>
      )}

      {/* History Log */}
      <div className="space-y-3">
        <h3 className={`text-sm font-bold flex items-center gap-2 uppercase tracking-wider ${isLight ? 'text-[#1A2238]' : 'text-white drop-shadow'}`}>
          <CalendarIcon className={`w-4 h-4 ${isLight ? 'text-[#FF5B45]' : 'text-rose-400'}`} />
          <span>Progression Log</span>
          <span className={`text-xs font-medium ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>({history.length} logged workouts)</span>
        </h3>

        {history.length === 0 ? (
          <div className={`text-center py-10 rounded-2xl border border-dashed text-xs font-medium ${isLight ? 'bg-white border-[#E2E8F0] text-[#475569]' : 'bg-black/30 backdrop-blur-md border-white/15 text-slate-300'}`}>
            No logged workouts found for {selectedExercise?.name} yet.
          </div>
        ) : (
          history.map((entry, idx) => {
            const completedSets = entry.log.sets.filter(s => s.isCompleted);
            const bestSetWeight = Math.max(...completedSets.map(s => s.weight), 0);
            const isPRSession = personalBest && bestSetWeight === personalBest.weight && entry.date === personalBest.date;

            return (
              <div
                key={`${entry.date}-${idx}`}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isLight
                    ? isPRSession
                      ? 'bg-white border-[#FF5B45]/50 shadow-sm ring-1 ring-[#FF5B45]/20'
                      : 'bg-white border-[#EEF2F6] shadow-sm'
                    : isPRSession
                    ? 'glass-card border-red-500/50 shadow-red-950/20'
                    : 'glass-card'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-xs ${isLight ? 'text-[#1A2238]' : 'text-white drop-shadow'}`}>
                      {formatDate(entry.date)}
                    </span>
                    {isPRSession && (
                      <Badge color={isLight ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/40 font-bold' : 'bg-red-600/30 text-red-200 border-red-500/50'}>
                        PR SET
                      </Badge>
                    )}
                  </div>
                  <span className={`text-xs font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
                    Top Set: {bestSetWeight} kg
                  </span>
                </div>

                {/* Sets Pill Bar */}
                <div className="flex flex-wrap gap-1.5">
                  {completedSets.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className={`px-2 py-1 rounded-lg border text-xs font-medium ${
                        isLight
                          ? 'bg-[#F8FAFD] border-[#EEF2F6] text-[#334155]'
                          : 'bg-black/45 border-white/10 text-slate-200 backdrop-blur-sm'
                      }`}
                    >
                      <strong className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{s.weight}kg</strong> × {s.reps}
                    </span>
                  ))}
                </div>

                {entry.log.notes && (
                  <p className={`text-[11px] mt-2 italic font-medium ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
                    "{entry.log.notes}"
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
