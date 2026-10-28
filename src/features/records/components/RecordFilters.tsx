import { BodyPart, BODY_PART_LABELS } from '@shared/types';
import { useTheme } from '@shared/theme';

interface RecordFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedBodyPart: string;
  onBodyPartChange: (part: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export function RecordFilters({
  search,
  onSearchChange,
  selectedBodyPart,
  onBodyPartChange,
  timeRange,
  onTimeRangeChange,
}: RecordFiltersProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`p-3.5 rounded-2xl space-y-3 border transition-all ${isLight ? 'glass-card border-white/80' : 'glass-card'}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by exercise name..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className={`w-full rounded-xl px-3 py-2 text-xs transition-colors border ${
            isLight
              ? 'bg-[#F8FAFD] border-[#E2E8F0] text-[#1A2238] placeholder-[#475569] focus:outline-none focus:border-[#FF5B45]'
              : 'bg-black/45 border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 backdrop-blur-sm'
          }`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        {/* Time Range Filter */}
        <div className="flex items-center gap-1.5">
          <span className={`font-bold ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>Range:</span>
          <select
            value={timeRange}
            onChange={e => onTimeRangeChange(e.target.value)}
            className={`rounded-xl px-2.5 py-1 text-xs transition-colors border ${
              isLight
                ? 'bg-[#F8FAFD] border-[#E2E8F0] text-[#1A2238] focus:border-[#FF5B45]'
                : 'bg-black/45 border-white/15 text-white focus:border-red-500 backdrop-blur-sm'
            }`}
          >
            <option value="all" className={isLight ? 'bg-white text-[#1A2238]' : 'bg-neutral-900 text-white'}>Last 6 Months (Full Archive)</option>
            <option value="7days" className={isLight ? 'bg-white text-[#1A2238]' : 'bg-neutral-900 text-white'}>Last 7 Days</option>
            <option value="30days" className={isLight ? 'bg-white text-[#1A2238]' : 'bg-neutral-900 text-white'}>Last 30 Days</option>
            <option value="90days" className={isLight ? 'bg-white text-[#1A2238]' : 'bg-neutral-900 text-white'}>Last 3 Months</option>
          </select>
        </div>

        {/* Body Part Filter */}
        <div className="flex items-center gap-1.5">
          <span className={`font-bold ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>Muscle:</span>
          <select
            value={selectedBodyPart}
            onChange={e => onBodyPartChange(e.target.value)}
            className={`rounded-xl px-2.5 py-1 text-xs transition-colors border ${
              isLight
                ? 'bg-[#F8FAFD] border-[#E2E8F0] text-[#1A2238] focus:border-[#FF5B45]'
                : 'bg-black/45 border-white/15 text-white focus:border-red-500 backdrop-blur-sm'
            }`}
          >
            <option value="all" className={isLight ? 'bg-white text-[#1A2238]' : 'bg-neutral-900 text-white'}>All Muscles</option>
            {(Object.keys(BODY_PART_LABELS) as BodyPart[]).map(bp => (
              <option key={bp} value={bp} className={isLight ? 'bg-white text-[#1A2238]' : 'bg-neutral-900 text-white'}>
                {BODY_PART_LABELS[bp]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
