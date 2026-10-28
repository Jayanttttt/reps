import { MonthlyGoal, BODY_PART_LABELS } from '@shared/types';
import { useTheme } from '@shared/theme';
import { Card, Badge, ProgressBar, EditIcon, TrashIcon } from '@shared/components';
import { BODY_PART_COLORS } from '@shared/constants/exercises';
import { getMonthProgress } from '@shared/utils/dateUtils';

interface GoalCardProps {
  goal: MonthlyGoal;
  onEdit: () => void;
  onDelete: () => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const monthProgress = getMonthProgress();
  const goalProgress = goal.targetValue > 0
    ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
    : 0;

  const isCompleted = goal.currentValue >= goal.targetValue;
  const difference = Math.max(0, goal.targetValue - goal.currentValue);

  // Status calculation
  let statusBadge = {
    label: 'IN PROGRESS',
    color: isLight ? 'bg-[#F8FAFD] text-[#475569] border-[#E2E8F0]' : 'bg-white/10 text-slate-200 border-white/20',
  };

  if (isCompleted) {
    statusBadge = {
      label: 'ACHIEVED',
      color: isLight ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/40 font-bold' : 'bg-red-600/30 text-red-200 border-red-500/50 font-bold',
    };
  } else if (goalProgress >= monthProgress) {
    statusBadge = {
      label: 'ON TRACK',
      color: isLight ? 'bg-[#F1F4F9] text-[#1A2238] border-[#E2E8F0] font-bold' : 'bg-neutral-800/90 text-slate-200 border-white/20',
    };
  } else {
    statusBadge = {
      label: 'BEHIND PACE',
      color: isLight ? 'bg-[#FFF0ED] text-[#C2410C] border-[#FFD8CF] font-bold' : 'bg-red-950/40 text-red-400 border-red-500/30',
    };
  }

  const metricLabel = {
    weight: 'Max Weight',
    reps: 'Max Reps',
    volume: 'Total Volume',
  }[goal.metric];

  return (
    <Card className={`p-4 space-y-3 border transition-all ${isLight ? 'border-white/80 hover:border-[#FF5B45]/40' : 'hover:border-red-500/40'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`font-bold text-base ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
              {goal.exerciseName}
            </h4>
            <Badge color={isLight ? 'bg-[#FFF0ED] text-[#FF5B45] border-[#FF5B45]/30' : BODY_PART_COLORS[goal.bodyPart]}>
              {BODY_PART_LABELS[goal.bodyPart]}
            </Badge>
          </div>
          <div className={`text-xs mt-0.5 font-medium ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>
            Target Metric: <strong className={`font-bold ${isLight ? 'text-[#1A2238]' : 'text-slate-200'}`}>{metricLabel}</strong>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge color={statusBadge.color} className="text-[10px] font-bold">
            {statusBadge.label}
          </Badge>

          <button
            onClick={onEdit}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight
                ? 'text-[#475569] hover:text-[#1A2238] bg-[#F1F4F9] hover:bg-[#E5EBF4] border-[#E2E8F0]'
                : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
            title="Edit goal"
          >
            <EditIcon className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onDelete}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight
                ? 'text-[#475569] hover:text-[#FF5B45] bg-[#F1F4F9] hover:bg-[#FFF0ED] border-[#E2E8F0]'
                : 'text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-950/30 border border-white/10'
            }`}
            title="Delete goal"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description if present */}
      {goal.description && (
        <p className={`text-xs italic ${isLight ? 'text-[#475569]' : 'text-slate-300'}`}>
          "{goal.description}"
        </p>
      )}

      {/* Progress Bar & Numbers */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-baseline text-xs">
          <span className={`font-medium ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>
            Current: <strong className={`text-sm font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{goal.currentValue} {goal.unit}</strong>
          </span>
          <span className={`font-medium ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>
            Target: <strong className={`text-sm font-bold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>{goal.targetValue} {goal.unit}</strong>
          </span>
        </div>

        <ProgressBar
          value={goal.currentValue}
          max={goal.targetValue}
          color={isLight ? 'bg-gradient-to-r from-[#FF5B45] to-[#FF7854]' : 'bg-red-600/70'}
          showLabel={false}
        />

        <div className="flex justify-between items-center text-[11px] pt-0.5">
          <span className={`font-medium ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>{goalProgress}% Completed</span>

          {/* Distance from goal */}
          <span className="font-semibold">
            {isCompleted ? (
              <span className={`font-bold tracking-wider ${isLight ? 'text-[#FF5B45]' : 'text-rose-300'}`}>TARGET REACHED</span>
            ) : (
              <span className={isLight ? 'text-[#475569]' : 'text-slate-300'}>
                {difference} {goal.unit} away from goal
              </span>
            )}
          </span>
        </div>
      </div>
    </Card>
  );
}
