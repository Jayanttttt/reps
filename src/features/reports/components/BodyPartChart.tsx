import { BodyPart, BODY_PART_LABELS } from '@shared/types';
import { useTheme } from '@shared/theme';
import { Card, ProgressBar, DumbbellIcon } from '@shared/components';

interface BodyPartChartProps {
  breakdown: Record<BodyPart, { sets: number; volume: number }>;
}

export function BodyPartChart({ breakdown }: BodyPartChartProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const entries = Object.entries(breakdown) as [BodyPart, { sets: number; volume: number }][];
  const totalVolume = entries.reduce((sum, [, d]) => sum + d.volume, 0);

  if (entries.length === 0 || totalVolume === 0) {
    return null;
  }

  // Sort by volume descending
  const sorted = [...entries].sort((a, b) => b[1].volume - a[1].volume);

  return (
    <Card className={`space-y-3 p-4 ${isLight ? 'border-white/80' : ''}`}>
      <h3 className={`text-sm font-bold flex items-center gap-2 uppercase tracking-wider ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
        <DumbbellIcon className={`w-4 h-4 ${isLight ? 'text-[#FF5B45]' : 'text-red-400'}`} />
        <span>Muscle Group Volume Breakdown</span>
      </h3>

      <div className="space-y-3 pt-1">
        {sorted.map(([part, data]) => {
          const percentage = Math.round((data.volume / totalVolume) * 100);
          return (
            <div key={part} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className={`font-semibold flex items-center gap-2 ${isLight ? 'text-[#1A2238]' : 'text-slate-200'}`}>
                  <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-[#FF5B45]' : 'bg-red-500'}`} />
                  <span>{BODY_PART_LABELS[part] || part}</span>
                  <span className={`font-medium ${isLight ? 'text-[#475569]' : 'text-slate-400'}`}>({data.sets} sets)</span>
                </span>
                <span className={`font-bold ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>
                  {data.volume.toLocaleString()} kg ({percentage}%)
                </span>
              </div>
              <ProgressBar
                value={data.volume}
                max={totalVolume}
                color={isLight ? 'bg-gradient-to-r from-[#FF5B45] to-[#FF7854]' : 'bg-gradient-to-r from-red-600 to-rose-600'}
                showLabel={false}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
