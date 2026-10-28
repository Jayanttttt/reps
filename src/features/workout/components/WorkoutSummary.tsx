import { WorkoutSession } from '@shared/types';
import { Modal, Button, TrophyIcon, ArrowRightIcon } from '@shared/components';
import { formatDate } from '@shared/utils/dateUtils';

interface WorkoutSummaryProps {
  session: WorkoutSession | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToRecords: () => void;
}

export function WorkoutSummary({
  session,
  isOpen,
  onClose,
  onGoToRecords,
}: WorkoutSummaryProps) {
  if (!session) return null;

  const totalExercises = session.exercises.length;
  const completedSets = session.exercises.flatMap(e => e.sets.filter(s => s.isCompleted));
  const totalVolume = completedSets.reduce((sum, s) => sum + s.weight * s.reps, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Workout Complete" size="md">
      <div className="space-y-5 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/25 border border-red-500/40 flex items-center justify-center text-red-400 shadow-xl shadow-red-600/20">
          <TrophyIcon className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Session Recorded</h3>
          <p className="text-neutral-400 text-xs mt-1">
            Logged on {formatDate(session.date)}
            {session.duration ? ` &bull; Duration: ${session.duration} mins` : ''}
          </p>
        </div>

        {/* Stats Grid (Bold Clean Numbers) */}
        <div className="grid grid-cols-3 gap-2.5 glass-card p-4 rounded-2xl">
          <div>
            <div className="text-2xl font-black text-white">{totalExercises}</div>
            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Exercises</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{completedSets.length}</div>
            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Total Sets</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalVolume.toLocaleString()}</div>
            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Kg Volume</div>
          </div>
        </div>

        {/* Exercises list snapshot */}
        <div className="text-left bg-black/20 p-3.5 rounded-2xl max-h-48 overflow-y-auto space-y-2 border border-white/10 text-xs">
          {session.exercises.map(ex => {
            const finishedSets = ex.sets.filter(s => s.isCompleted);
            const bestWeight = Math.max(...finishedSets.map(s => s.weight), 0);
            return (
              <div key={ex.exerciseId} className="flex justify-between items-center text-neutral-200">
                <span className="font-semibold text-white">{ex.exerciseName}</span>
                <span className="text-neutral-400 font-medium">
                  {finishedSets.length} sets &bull; Top: <strong className="text-white font-bold">{bestWeight}kg</strong>
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 justify-center pt-2">
          <Button variant="ghost" onClick={onClose} className="font-semibold text-xs">
            Return to Dashboard
          </Button>
          <Button variant="primary" onClick={onGoToRecords} className="font-bold text-xs uppercase tracking-wider">
            <span>View in History</span>
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
