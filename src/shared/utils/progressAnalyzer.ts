import {
  WorkoutSession,
  ExerciseLog,
  PreviousRecord,
  ExerciseSet,
  MonthlyReport,
  ExerciseProgress,
  BodyPart,
} from '../types';
import { getMonthDates } from './dateUtils';

/**
 * Get the previous record for a specific exercise from workout history.
 * Returns the most recent session where this exercise was performed.
 */
export function getPreviousRecord(
  sessions: WorkoutSession[],
  exerciseId: string,
  beforeDate?: string
): PreviousRecord | null {
  const sorted = [...sessions]
    .filter(s => s.completed)
    .filter(s => !beforeDate || s.date < beforeDate)
    .sort((a, b) => b.date.localeCompare(a.date));

  for (const session of sorted) {
    const exerciseLog = session.exercises.find(e => e.exerciseId === exerciseId);
    if (exerciseLog && exerciseLog.sets.length > 0) {
      const completedSets = exerciseLog.sets.filter(s => s.isCompleted);
      if (completedSets.length === 0) continue;

      const bestWeight = Math.max(...completedSets.map(s => s.weight));
      const bestReps = Math.max(...completedSets.map(s => s.reps));
      const bestVolume = Math.max(...completedSets.map(s => s.weight * s.reps));

      return {
        date: session.date,
        bestWeight,
        bestReps,
        bestVolume,
        sets: completedSets,
      };
    }
  }

  return null;
}

/**
 * Get all records for a specific exercise within a date range.
 */
export function getExerciseHistory(
  sessions: WorkoutSession[],
  exerciseId: string,
  startDate?: string,
  endDate?: string
): { date: string; log: ExerciseLog }[] {
  return sessions
    .filter(s => s.completed)
    .filter(s => !startDate || s.date >= startDate)
    .filter(s => !endDate || s.date <= endDate)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(session => {
      const log = session.exercises.find(e => e.exerciseId === exerciseId);
      return log ? { date: session.date, log } : null;
    })
    .filter((item): item is { date: string; log: ExerciseLog } => item !== null);
}

/**
 * Calculate PR suggestion based on previous record.
 */
export function getPRSuggestion(
  previousRecord: PreviousRecord | null,
  incrementKg: number = 2.5
): { suggestedWeight: number; message: string } | null {
  if (!previousRecord) {
    return null;
  }

  const suggestedWeight = previousRecord.bestWeight + incrementKg;
  return {
    suggestedWeight,
    message: `Last: ${previousRecord.bestWeight}kg × ${previousRecord.bestReps} reps → Lift ${suggestedWeight}kg to set new PR`,
  };
}

/**
 * Generate a monthly report from workout sessions.
 */
export function generateMonthlyReport(
  sessions: WorkoutSession[],
  month: string,
  previousMonthSessions?: WorkoutSession[]
): MonthlyReport {
  const { start, end } = getMonthDates(month);

  const monthSessions = sessions
    .filter(s => s.completed && s.date >= start && s.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Aggregate exercise data
  const exerciseMap = new Map<string, {
    exerciseId: string;
    exerciseName: string;
    bodyPart: BodyPart;
    weights: { date: string; weight: number; reps: number }[];
    totalSets: number;
    totalReps: number;
    totalVolume: number;
  }>();

  let totalSets = 0;
  let totalReps = 0;
  let totalVolume = 0;
  let totalExercises = 0;

  const bodyPartBreakdown: Record<string, { sets: number; volume: number }> = {};

  for (const session of monthSessions) {
    for (const exercise of session.exercises) {
      const completedSets = exercise.sets.filter(s => s.isCompleted);
      if (completedSets.length === 0) continue;

      totalExercises++;

      if (!exerciseMap.has(exercise.exerciseId)) {
        exerciseMap.set(exercise.exerciseId, {
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          bodyPart: exercise.bodyPart,
          weights: [],
          totalSets: 0,
          totalReps: 0,
          totalVolume: 0,
        });
      }

      const data = exerciseMap.get(exercise.exerciseId)!;

      for (const set of completedSets) {
        data.weights.push({ date: session.date, weight: set.weight, reps: set.reps });
        data.totalSets++;
        data.totalReps += set.reps;
        data.totalVolume += set.weight * set.reps;

        totalSets++;
        totalReps += set.reps;
        totalVolume += set.weight * set.reps;

        // Body part breakdown
        if (!bodyPartBreakdown[exercise.bodyPart]) {
          bodyPartBreakdown[exercise.bodyPart] = { sets: 0, volume: 0 };
        }
        bodyPartBreakdown[exercise.bodyPart].sets++;
        bodyPartBreakdown[exercise.bodyPart].volume += set.weight * set.reps;
      }
    }
  }

  // Calculate exercise progress
  const exerciseProgress: ExerciseProgress[] = [];
  for (const [, data] of exerciseMap) {
    if (data.weights.length < 2) {
      exerciseProgress.push({
        exerciseId: data.exerciseId,
        exerciseName: data.exerciseName,
        bodyPart: data.bodyPart,
        startWeight: data.weights[0]?.weight || 0,
        endWeight: data.weights[data.weights.length - 1]?.weight || 0,
        weightChange: 0,
        weightChangePercent: 0,
        startMaxReps: data.weights[0]?.reps || 0,
        endMaxReps: data.weights[data.weights.length - 1]?.reps || 0,
        totalSets: data.totalSets,
        totalReps: data.totalReps,
        totalVolume: data.totalVolume,
      });
      continue;
    }

    // Get first and last session weights (max weight per session)
    const firstSessionDate = data.weights[0].date;
    const lastSessionDate = data.weights[data.weights.length - 1].date;

    const firstWeights = data.weights.filter(w => w.date === firstSessionDate);
    const lastWeights = data.weights.filter(w => w.date === lastSessionDate);

    const startWeight = Math.max(...firstWeights.map(w => w.weight));
    const endWeight = Math.max(...lastWeights.map(w => w.weight));
    const weightChange = endWeight - startWeight;
    const weightChangePercent = startWeight > 0 ? (weightChange / startWeight) * 100 : 0;

    exerciseProgress.push({
      exerciseId: data.exerciseId,
      exerciseName: data.exerciseName,
      bodyPart: data.bodyPart,
      startWeight,
      endWeight,
      weightChange,
      weightChangePercent: Math.round(weightChangePercent * 10) / 10,
      startMaxReps: Math.max(...firstWeights.map(w => w.reps)),
      endMaxReps: Math.max(...lastWeights.map(w => w.reps)),
      totalSets: data.totalSets,
      totalReps: data.totalReps,
      totalVolume: data.totalVolume,
    });
  }

  // Overall strength change calculation
  let overallStrengthChange = 0;
  if (previousMonthSessions && previousMonthSessions.length > 0) {
    const prevVolume = previousMonthSessions.reduce((sum, s) => {
      return sum + s.exercises.reduce((eSum, e) => {
        return eSum + e.sets
          .filter(set => set.isCompleted)
          .reduce((sSum, set) => sSum + set.weight * set.reps, 0);
      }, 0);
    }, 0);

    if (prevVolume > 0) {
      overallStrengthChange = Math.round(((totalVolume - prevVolume) / prevVolume) * 100 * 10) / 10;
    }
  }

  return {
    month,
    totalWorkouts: monthSessions.length,
    totalExercises,
    totalSets,
    totalReps,
    totalVolume: Math.round(totalVolume),
    overallStrengthChange,
    exerciseProgress,
    bodyPartBreakdown: bodyPartBreakdown as Record<BodyPart, { sets: number; volume: number }>,
    generatedAt: new Date().toISOString(),
  };
}
