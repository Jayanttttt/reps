import { WeeklyPlan } from '../types';
import { generateId } from '../utils/dateUtils';

export const createDefaultPlan = (): WeeklyPlan => ({
  id: generateId(),
  name: 'Standard Split',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  days: {
    monday: {
      day: 'monday',
      isRestDay: false,
      splitType: 'double',
      bodyParts: ['chest', 'triceps'],
      exercises: [
        { exerciseId: 'bench-press', exerciseName: 'Bench Press', bodyPart: 'chest', targetSets: 4, targetReps: 8, targetWeight: 60 },
        { exerciseId: 'incline-dumbbell-press', exerciseName: 'Incline Dumbbell Press', bodyPart: 'chest', targetSets: 3, targetReps: 10, targetWeight: 22 },
        { exerciseId: 'tricep-pushdown', exerciseName: 'Tricep Pushdown', bodyPart: 'triceps', targetSets: 3, targetReps: 12, targetWeight: 25 },
      ],
    },
    tuesday: {
      day: 'tuesday',
      isRestDay: false,
      splitType: 'double',
      bodyParts: ['back', 'biceps'],
      exercises: [
        { exerciseId: 'deadlift', exerciseName: 'Deadlift', bodyPart: 'back', targetSets: 4, targetReps: 6, targetWeight: 100 },
        { exerciseId: 'lat-pulldown', exerciseName: 'Lat Pulldown', bodyPart: 'back', targetSets: 3, targetReps: 10, targetWeight: 50 },
        { exerciseId: 'barbell-curl', exerciseName: 'Barbell Curl', bodyPart: 'biceps', targetSets: 3, targetReps: 10, targetWeight: 25 },
      ],
    },
    wednesday: {
      day: 'wednesday',
      isRestDay: true,
      splitType: 'single',
      bodyParts: [],
      exercises: [],
    },
    thursday: {
      day: 'thursday',
      isRestDay: false,
      splitType: 'double',
      bodyParts: ['legs', 'calves'],
      exercises: [
        { exerciseId: 'squat', exerciseName: 'Squat', bodyPart: 'legs', targetSets: 4, targetReps: 8, targetWeight: 80 },
        { exerciseId: 'leg-press', exerciseName: 'Leg Press', bodyPart: 'legs', targetSets: 3, targetReps: 10, targetWeight: 140 },
        { exerciseId: 'standing-calf-raise', exerciseName: 'Standing Calf Raise', bodyPart: 'calves', targetSets: 4, targetReps: 15, targetWeight: 40 },
      ],
    },
    friday: {
      day: 'friday',
      isRestDay: false,
      splitType: 'double',
      bodyParts: ['shoulders', 'core'],
      exercises: [
        { exerciseId: 'overhead-press', exerciseName: 'Overhead Press', bodyPart: 'shoulders', targetSets: 4, targetReps: 8, targetWeight: 40 },
        { exerciseId: 'lateral-raise', exerciseName: 'Lateral Raise', bodyPart: 'shoulders', targetSets: 4, targetReps: 12, targetWeight: 10 },
        { exerciseId: 'plank', exerciseName: 'Plank', bodyPart: 'core', targetSets: 3, targetReps: 60, targetWeight: 0 },
      ],
    },
    saturday: {
      day: 'saturday',
      isRestDay: false,
      splitType: 'single',
      bodyParts: ['cardio'],
      exercises: [
        { exerciseId: 'treadmill', exerciseName: 'Treadmill', bodyPart: 'cardio', targetSets: 1, targetReps: 30, targetWeight: 0 },
      ],
    },
    sunday: {
      day: 'sunday',
      isRestDay: true,
      splitType: 'single',
      bodyParts: [],
      exercises: [],
    },
  },
});
