import { useState } from 'react';
import { WorkoutSession, BODY_PART_LABELS } from '@shared/types';
import { useTheme } from '@shared/theme';
import { BODY_PART_COLORS } from '@shared/constants/exercises';
import { Card, Badge, ConfirmDialog, ClockIcon, EditIcon, TrashIcon } from '@shared/components';
import { formatDate } from '@shared/utils/dateUtils';

interface SessionCardProps {
  session: WorkoutSession;
  onUpdateSession: (updated: WorkoutSession) => void;
  onDeleteSession: () => void;
}

export function SessionCard({
  session,
  onUpdateSession,
  onDeleteSession,
}: SessionCardProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedSession, setEditedSession] = useState<WorkoutSession>(session);

  const totalVolume = session.exercises.reduce((sum, e) => {
    return sum + e.sets.filter(s => s.isCompleted).reduce((sSum, s) => sSum + s.weight * s.reps, 0);
  }, 0);

  const handleSave = () => {
    onUpdateSession(editedSession);
    setIsEditing(false);
  };

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    updatedWeight: number,
    updatedReps: number
  ) => {
    const newExercises = [...editedSession.exercises];
    const newSets = [...newExercises[exerciseIndex].sets];
    newSets[setIndex] = {
      ...newSets[setIndex],
      weight: updatedWeight,
      reps: updatedReps,
    };
    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      sets: newSets,
    };
    setEditedSession({ ...editedSession, exercises: newExercises });
  };

  return (
    <Card className="space-y-3">
      {/* Session Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base drop-shadow">
              {formatDate(session.date)}
            </span>
            <span className="text-xs text-slate-300 capitalize">
              ({session.dayOfWeek})
            </span>
          </div>

          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {session.bodyParts.map(bp => (
              <Badge key={bp} color={BODY_PART_COLORS[bp]}>
                {BODY_PART_LABELS[bp]}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session.duration && (
            <span
              className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 font-semibold ${
                isLight
                  ? 'bg-[#F1F4F9] border-[#E2E8F0] text-[#1A2238]'
                  : 'text-slate-300 bg-black/40 border-white/10 backdrop-blur-sm'
              }`}
            >
              <ClockIcon className={`w-3.5 h-3.5 ${isLight ? 'text-[#FF5B45]' : 'text-rose-300'}`} /> {session.duration}m
            </span>
          )}

          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isLight
                ? 'bg-[#FFF0ED] border-[#FF5B45]/30 text-[#FF5B45]'
                : 'text-white bg-white/10 border-white/15 backdrop-blur-sm'
            }`}
          >
            {totalVolume.toLocaleString()} kg
          </span>

          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setEditedSession(session);
                setIsEditing(true);
              }
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border ${
              isEditing
                ? 'bg-[#FF5B45] text-white border-transparent shadow-sm'
                : isLight
                ? 'text-[#334155] bg-[#F1F4F9] hover:bg-[#E5EBF4] border-[#E2E8F0]'
                : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border-white/10'
            }`}
            title={isEditing ? 'Save edits' : 'Edit workout record'}
          >
            <EditIcon className="w-3 h-3" />
            {isEditing ? 'Save' : 'Edit'}
          </button>

          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight
                ? 'text-[#475569] hover:text-[#FF5B45] hover:bg-[#FFF0ED] border-[#E2E8F0]'
                : 'text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-950/40 border-white/10'
            }`}
            title="Delete session"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Exercises Breakdown */}
      <div className="space-y-3 pt-1">
        {(isEditing ? editedSession.exercises : session.exercises).map((ex, exIdx) => {
          const completedSets = ex.sets.filter(s => s.isCompleted);
          return (
            <div
              key={`${ex.exerciseId}-${exIdx}`}
              className={`p-2.5 rounded-xl border ${
                isLight ? 'bg-[#F8FAFD] border-[#EEF2F6]' : 'bg-black/15 border-white/10'
              }`}
            >
              <div className={`flex items-center justify-between text-xs font-bold mb-1.5 ${isLight ? 'text-[#1A2238]' : 'text-slate-100'}`}>
                <span>{ex.exerciseName}</span>
                <span className={`font-medium ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
                  {completedSets.length} sets
                </span>
              </div>

              {/* Sets List */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {ex.sets.map((set, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-1.5 rounded-lg text-xs flex items-center justify-between border ${
                      set.isCompleted
                        ? isLight
                          ? 'bg-[#FFF9F8] border-[#FFE4DE] text-[#1A2238] shadow-xs'
                          : 'bg-black/55 border-red-500/40 text-slate-100 shadow-sm'
                        : isLight
                        ? 'bg-white text-[#475569] border-[#E2E8F0]'
                        : 'bg-black/30 text-slate-400 border-white/5'
                    }`}
                  >
                    <span className={`text-[10px] font-bold ${isLight ? 'text-[#64748B]' : 'text-slate-400'}`}>
                      #{sIdx + 1}
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step={0.5}
                          value={set.weight}
                          onChange={e =>
                            handleUpdateSet(
                              exIdx,
                              sIdx,
                              parseFloat(e.target.value) || 0,
                              set.reps
                            )
                          }
                          className={`w-12 rounded px-1 text-center font-bold border ${
                            isLight
                              ? 'bg-white border-[#E2E8F0] text-[#1A2238]'
                              : 'bg-black/50 border-white/20 text-white'
                          }`}
                        />
                        <span className={isLight ? 'text-[#475569]' : ''}>kg ×</span>
                        <input
                          type="number"
                          value={set.reps}
                          onChange={e =>
                            handleUpdateSet(
                              exIdx,
                              sIdx,
                              set.weight,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className={`w-10 rounded px-1 text-center font-bold border ${
                            isLight
                              ? 'bg-white border-[#E2E8F0] text-[#1A2238]'
                              : 'bg-black/50 border-white/20 text-white'
                          }`}
                        />
                      </div>
                    ) : (
                      <span className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
                        {set.weight}kg × {set.reps}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {ex.notes && (
                <div className={`text-[11px] italic mt-1.5 ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
                  Note: {ex.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={() => {
          onDeleteSession();
          setIsDeleteDialogOpen(false);
        }}
        onCancel={() => setIsDeleteDialogOpen(false)}
        title="Delete Workout Record?"
        message={`Are you sure you want to delete the workout from ${formatDate(session.date)}? This action cannot be undone.`}
      />
    </Card>
  );
}
