import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { createDefaultPlan } from '@shared/constants/defaultPlan';
import {
  WorkoutSession,
  WeeklyPlan,
  ExerciseLog,
  ExerciseSet,
  Exercise,
  BodyPart,
} from '@shared/types';
import {
  getTodayDate,
  getTodayDayOfWeek,
  getDayOfWeek,
  generateId,
  formatDate,
} from '@shared/utils/dateUtils';
import { getPreviousRecord, getPRSuggestion } from '@shared/utils/progressAnalyzer';
import {
  Button,
  Card,
  DumbbellIcon,
  CheckIcon,
  PlusIcon,
  CalendarIcon,
} from '@shared/components';
import { SectionHelpButton } from '../../help';
import { ExerciseCard } from './ExerciseCard';
import { WorkoutSummary } from './WorkoutSummary';
import { ExercisePicker } from '../../planner/components/ExercisePicker';

export default function WorkoutLogger() {
  const navigate = useNavigate();

  const [storedPlan] = useLocalStorage<WeeklyPlan>(STORAGE_KEYS.WEEKLY_PLAN, createDefaultPlan());
  const weeklyPlan: WeeklyPlan = storedPlan && storedPlan.days ? storedPlan : createDefaultPlan();
  const [sessions, setSessions] = useLocalStorage<WorkoutSession[]>(
    STORAGE_KEYS.WORKOUT_SESSIONS,
    []
  );

  const [workoutDate, setWorkoutDate] = useState<string>(getTodayDate());
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Load exercises from day plan or existing workout on date change
  useEffect(() => {
    // Check if a session already exists for this date
    const existing = sessions.find(s => s.date === workoutDate);
    if (existing) {
      setExercises(existing.exercises);
      return;
    }

    // Otherwise load from weekly plan
    if (weeklyPlan) {
      const dayOfWeek = getDayOfWeek(workoutDate);
      const dayPlan = weeklyPlan.days[dayOfWeek];

      if (dayPlan && !dayPlan.isRestDay && dayPlan.exercises.length > 0) {
        const initialLogs: ExerciseLog[] = dayPlan.exercises.map(pe => {
          const prev = getPreviousRecord(sessions, pe.exerciseId);
          const initialSets: ExerciseSet[] = Array.from(
            { length: pe.targetSets || 3 },
            (_, i) => ({
              setNumber: i + 1,
              weight: pe.targetWeight || (prev ? prev.bestWeight : 20),
              reps: pe.targetReps || (prev ? prev.bestReps : 10),
              isCompleted: false,
            })
          );

          return {
            exerciseId: pe.exerciseId,
            exerciseName: pe.exerciseName,
            bodyPart: pe.bodyPart,
            sets: initialSets,
          };
        });

        setExercises(initialLogs);
      } else {
        setExercises([]);
      }
    }
  }, [workoutDate, weeklyPlan]);

  const handleAddExercise = (exercise: Exercise) => {
    const prev = getPreviousRecord(sessions, exercise.id);
    const defaultWeight = prev ? prev.bestWeight : 20;
    const defaultReps = prev ? prev.bestReps : 10;

    const newLog: ExerciseLog = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      bodyPart: exercise.bodyPart,
      sets: [
        { setNumber: 1, weight: defaultWeight, reps: defaultReps, isCompleted: false },
        { setNumber: 2, weight: defaultWeight, reps: defaultReps, isCompleted: false },
        { setNumber: 3, weight: defaultWeight, reps: defaultReps, isCompleted: false },
      ],
    };

    setExercises(prev => [...prev, newLog]);
  };

  const handleUpdateExercise = (index: number, updatedLog: ExerciseLog) => {
    const newLogs = [...exercises];
    newLogs[index] = updatedLog;
    setExercises(newLogs);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinishWorkout = () => {
    if (exercises.length === 0) {
      alert('Please add at least one exercise before finishing your workout.');
      return;
    }

    // Extract body parts trained
    const bodyParts = Array.from(new Set(exercises.map(e => e.bodyPart))) as BodyPart[];
    const dayOfWeek = getDayOfWeek(workoutDate);

    const session: WorkoutSession = {
      id: generateId(),
      date: workoutDate,
      dayOfWeek,
      bodyParts,
      exercises,
      completed: true,
    };

    // Upsert into sessions
    setSessions(prev => {
      const filtered = prev.filter(s => s.date !== workoutDate);
      return [session, ...filtered];
    });

    setCompletedSession(session);
    setIsSummaryOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <Card className="border-red-500/40 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/35 flex items-center justify-center text-rose-300">
                <DumbbellIcon className="w-4 h-4" />
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Active Workout</h1>
            </div>
            <p className="text-neutral-400 text-xs mt-1 font-medium">
              {formatDate(workoutDate)} &bull; Record live sets and target progressive overload
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Tab Help Button */}
            <SectionHelpButton tab="workout" title="Workout Guide" />

            {/* Date Selector */}
            <input
              type="date"
              value={workoutDate}
              onChange={e => setWorkoutDate(e.target.value)}
              className="bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 backdrop-blur-sm font-semibold"
            />
          </div>
        </div>
      </Card>

      {/* Exercises Section */}
      <div className="space-y-4">
        {exercises.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-white/20 rounded-2xl p-6 glass-card">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mb-3">
              <DumbbellIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">No exercises added yet</h3>
            <p className="text-neutral-400 text-xs mt-1 max-w-sm mx-auto">
              Add movements to record your session or load your daily routine from the planner.
            </p>
            <Button
              className="mt-5 font-bold uppercase tracking-wider text-xs"
              size="md"
              onClick={() => setIsPickerOpen(true)}
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              <span>Add Exercise</span>
            </Button>
          </div>
        ) : (
          exercises.map((exerciseLog, idx) => {
            const prev = getPreviousRecord(sessions, exerciseLog.exerciseId, workoutDate);
            const pr = getPRSuggestion(prev, 2.0);

            // Fetch target from plan if available
            const dayOfWeek = getDayOfWeek(workoutDate);
            const planned = weeklyPlan?.days[dayOfWeek]?.exercises.find(
              pe => pe.exerciseId === exerciseLog.exerciseId
            );

            return (
              <ExerciseCard
                key={`${exerciseLog.exerciseId}-${idx}`}
                exerciseLog={exerciseLog}
                previousRecord={prev}
                prSuggestion={pr}
                targetWeight={planned?.targetWeight}
                targetReps={planned?.targetReps}
                onUpdate={updated => handleUpdateExercise(idx, updated)}
                onRemove={() => handleRemoveExercise(idx)}
              />
            );
          })
        )}
      </div>

      {/* Bottom Action Bar */}
      {exercises.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="secondary"
            className="flex-1 font-bold text-xs uppercase tracking-wider border border-white/15"
            onClick={() => setIsPickerOpen(true)}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            <span>Add Extra Exercise</span>
          </Button>

          <Button
            variant="primary"
            size="lg"
            className="flex-1 shadow-lg shadow-black/40 font-black text-sm uppercase tracking-wider py-3.5"
            onClick={handleFinishWorkout}
          >
            <CheckIcon className="w-4 h-4 mr-1" />
            <span>Finish Workout & Log Data</span>
          </Button>
        </div>
      )}

      {/* Exercise Picker Modal */}
      <ExercisePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleAddExercise}
      />

      {/* Post-Workout Summary Modal */}
      <WorkoutSummary
        session={completedSession}
        isOpen={isSummaryOpen}
        onClose={() => {
          setIsSummaryOpen(false);
          navigate('/');
        }}
        onGoToRecords={() => {
          setIsSummaryOpen(false);
          navigate('/records');
        }}
      />
    </div>
  );
}
