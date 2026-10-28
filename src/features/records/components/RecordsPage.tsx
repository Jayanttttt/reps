import { useState, useMemo } from 'react';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { useTheme } from '@shared/theme';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { WorkoutSession, AppSettings, DEFAULT_SETTINGS } from '@shared/types';
import { isWithinMonths } from '@shared/utils/dateUtils';
import { generateRecordsPDF } from '@shared/utils/pdfGenerator';
import {
  Button,
  Tabs,
  DownloadIcon,
  RefreshIcon,
  DumbbellIcon,
  TrendingUpIcon,
  RecordsIcon,
} from '@shared/components';
import { SectionHelpButton } from '../../help';
import { RecordFilters } from './RecordFilters';
import { SessionCard } from './SessionCard';
import { ExerciseHistory } from './ExerciseHistory';

export default function RecordsPage() {
  const [sessions, setSessions] = useLocalStorage<WorkoutSession[]>(
    STORAGE_KEYS.WORKOUT_SESSIONS,
    []
  );

  const [settings] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.APP_SETTINGS,
    DEFAULT_SETTINGS
  );

  const [activeTab, setActiveTab] = useState<'sessions' | 'exercises'>('sessions');
  const [search, setSearch] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  // Filter sessions within 6 months retention period
  const retentionMonths = settings.dataRetentionMonths || 6;
  const validSessions = useMemo(() => {
    return sessions.filter(s => isWithinMonths(s.date, retentionMonths));
  }, [sessions, retentionMonths]);

  // Apply UI filters
  const filteredSessions = useMemo(() => {
    return validSessions.filter(session => {
      // Time range filter
      if (timeRange === '7days' && !isWithinMonths(session.date, 0.25)) return false;
      if (timeRange === '30days' && !isWithinMonths(session.date, 1)) return false;
      if (timeRange === '90days' && !isWithinMonths(session.date, 3)) return false;

      // Body part filter
      if (selectedBodyPart !== 'all' && !session.bodyParts.includes(selectedBodyPart as any)) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const hasMatchingExercise = session.exercises.some(e =>
          e.exerciseName.toLowerCase().includes(query)
        );
        if (!hasMatchingExercise) return false;
      }

      return true;
    });
  }, [validSessions, search, selectedBodyPart, timeRange]);

  const handleUpdateSession = (updatedSession: WorkoutSession) => {
    setSessions(prev =>
      prev.map(s => (s.id === updatedSession.id ? updatedSession : s))
    );
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleDownloadPDF = () => {
    generateRecordsPDF(
      filteredSessions,
      `Workout_Records_${retentionMonths}_Months`
    );
  };

  const handlePruneOldRecords = () => {
    const pruned = sessions.filter(s => isWithinMonths(s.date, retentionMonths));
    const countRemoved = sessions.length - pruned.length;
    if (countRemoved === 0) {
      alert('All your records are already within the last 6 months.');
      return;
    }
    if (confirm(`Remove ${countRemoved} record(s) older than 6 months?`)) {
      setSessions(pruned);
    }
  };

  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${isLight ? 'text-[#FF5B45]' : 'text-rose-300/90'}`}>
            Archive & Performance Vault
          </span>
          <h1 className={`text-3xl font-black tracking-tight ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
            Workout Records
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 font-medium ${isLight ? 'text-[#475569]' : 'text-neutral-400'}`}>
            Preserved up to {retentionMonths} months &bull; Exportable as professional PDF dossier
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SectionHelpButton tab="records" title="Records Guide" />

          <Button
            size="sm"
            variant="secondary"
            onClick={handlePruneOldRecords}
            className="font-bold text-xs"
            title="Clean records older than 6 months"
          >
            <RefreshIcon className="w-3.5 h-3.5 mr-1" />
            <span>Prune &gt; 6m</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={handleDownloadPDF}
            className="font-bold text-xs uppercase tracking-wider shadow-lg shadow-black/40"
          >
            <DownloadIcon className="w-3.5 h-3.5 mr-1" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'sessions', label: 'Workout Sessions', icon: <DumbbellIcon className="w-3.5 h-3.5" /> },
          { id: 'exercises', label: 'Exercise Progression', icon: <TrendingUpIcon className="w-3.5 h-3.5" /> },
        ]}
        activeTab={activeTab}
        onChange={id => setActiveTab(id as 'sessions' | 'exercises')}
      />

      {activeTab === 'sessions' ? (
        <div className="space-y-4">
          {/* Filters */}
          <RecordFilters
            search={search}
            onSearchChange={setSearch}
            selectedBodyPart={selectedBodyPart}
            onBodyPartChange={setSelectedBodyPart}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />

          {/* Sessions List */}
          {filteredSessions.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border-dashed border-white/20 p-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mb-3">
                <RecordsIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">No workout records found</h3>
              <p className="text-neutral-400 text-xs mt-1 max-w-sm mx-auto">
                Complete a session in the Workout tab to establish your historical logs.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onUpdateSession={handleUpdateSession}
                  onDeleteSession={() => handleDeleteSession(session.id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <ExerciseHistory sessions={validSessions} />
      )}
    </div>
  );
}
